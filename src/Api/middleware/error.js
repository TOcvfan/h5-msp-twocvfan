'use strict'

class PasswordMismatchError extends Error {
    constructor(message) {
        super(message || 'Invalid password')
        this.name = 'PasswordMismatchError'
    }
}

export default PasswordMismatchError