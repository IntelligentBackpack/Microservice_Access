import hash from 'object-hash'

const hashIteration = 50

export function apply_hash(password: string) {
    var hashed:string = hash(password)
    for(var i = 0; i < hashIteration-1; i++)
        hashed = hash(hashed)
    
    return hashed;
}