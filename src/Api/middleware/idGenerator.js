const seedrandom = require('seedrandom')
const idGenerator = (seed, length = 15) => {
    const generator = seedrandom(seed);
    let result = '';
    while (result.length < length) {
        result += generator().toString(36).substring(2);
    }
    result = result.substring(0, length);

    // Sørger for at første tegn er et bogstav (a-z)
    if (!/^[a-z]/i.test(result[0])) {
        const prefixChar = String.fromCharCode(97 + Math.floor(generator() * 26)); // a-z
        result = prefixChar + result.substring(1);
    }

    return result;
}
module.exports = idGenerator