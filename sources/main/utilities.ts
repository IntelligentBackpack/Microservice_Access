/*import crypto from 'crypto'
const hashIteration = 50

export function encrypt(password: string) {
    var hash = crypto.createHash('sha512').update(password).digest('hex');
    for(var i = 0; i < hashIteration-1; i++) {
        hash = crypto.createHash('sha512').update(hash).digest('hex');
    }
    return hash;
}
*/