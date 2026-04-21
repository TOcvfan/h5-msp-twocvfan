import path from 'path';
import fs from 'fs';
import multer from 'multer';

const dateZero = (d) => d < 10 ? '0' + d : '' + d;
let count;
let fileName;
count = 0;
let billedeNavn = 'Intet billede';

const tegn = (text) => {
    const charMap = {
        'æ': 'ae',
        'ø': 'oe',
        'å': 'aa',
        'Æ': 'AE',
        'Ø': 'OE',
        'Å': 'AA',
        '&': 'og',
    };
    return text.split('').map(char => charMap[char] || char).join('');
}
let billedeSti = "";
const storage = multer.diskStorage({
    destination: function (req, _file, cb) {
        const { titel, navn, begivenhed, sti, pdf } = req.body;
        let mappe;
        let folderName = "";
        if (sti) {
            mappe = sti
        } else if (pdf) {
            mappe = "pdfer";
        } else {
            if (titel && !begivenhed) {
                folderName = 'bestyrelsen'
            }
            if (!titel && navn) {
                folderName = 'logoer'
            }
            if (begivenhed) {
                folderName = `begivenheder/${begivenhed}/${titel}`
            }
            const nymappe = tegn(folderName.replace(/\s/g, '')).toLowerCase();
            mappe = nymappe.replace(":", '')
        }

        billedeSti = `./public/${mappe}`
        if (!fs.existsSync(billedeSti)) {
            fs.mkdirSync(billedeSti, { recursive: true });
        }

        cb(null, billedeSti);
    },
    filename: function (req, file, cb) {
        fileName = dateZero(new Date().getDate()) + dateZero(new Date().getMonth() + 1) + new Date().getFullYear() + dateZero(new Date().getHours()) + dateZero(new Date().getMinutes());
        let { titel, navn, sti } = req.body;
        const ext = path.extname(file.originalname);
        if (sti) {
            const ting = sti.split('/');
            titel = ting[2]
        }
        const navnefil = titel ? titel : navn
        const filnavn = tegn(navnefil.replace(/\s/g, '')).toLowerCase();

        let endeligtfilnavn = fileName + '_' + filnavn + ext;
        billedeNavn = endeligtfilnavn.toLowerCase();

        const stiMedFil = billedeSti + '/' + billedeNavn;
        if (fs.existsSync(stiMedFil)) {
            count++
            billedeNavn = fileName + '_' + count + '_' + filnavn + ext;
            const nySti = billedeSti + '/' + billedeNavn;
            if (fs.existsSync(nySti)) {
                count++
                billedeNavn = fileName + '_' + count + '_' + filnavn + ext;
            }
        }

        cb(null, billedeNavn);
    }
});

function checkFileTypePDF(file, cb) {
    // Allowed ext
    const filetypes = /pdf|PDF/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDF Only!');
    }
}

export const uploadPDF = multer({
    storage: storage,
    fileFilter: function (_req, file, cb) {
        checkFileTypePDF(file, cb);
    }
});

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
});
