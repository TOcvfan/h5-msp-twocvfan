import { randomBytes } from "crypto";
const accessSecret = randomBytes(64).toString("hex");
const refreshSecret = randomBytes(64).toString("hex");

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

function generatePassword(length = 20) {
    let password = "";
    const bytes = randomBytes(length);

    for (let i = 0; i < length; i++) {
        password += chars[bytes[i] % chars.length];
    }

    return password;
}

console.log("Generated password:", generatePassword(20));
console.log("ACCESS_SECRET=", accessSecret);
console.log("REFRESH_SECRET=", refreshSecret);