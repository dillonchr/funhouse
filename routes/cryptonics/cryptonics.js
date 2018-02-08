module.exports = {
    get alpha() {
        return Array(26).fill().map((c, i) => (i + 10).toString(36));
    },
    getOffsetChars(offset) {
        return this.alpha
            .slice(offset)
            .concat(this.alpha.slice(0, offset));
    },
    createMap(source, matched) {
        return source.reduce((obj, curr, i) => {
            obj[curr] = matched[i];
            return obj;
        }, {});
    },
    getEncryptAlpha(offset) {
        return this.createMap(this.alpha, this.getOffsetChars(offset));
    },
    getDecryptAlpha(offset) {
        return this.createMap(this.getOffsetChars(offset), this.alpha);
    },
    messageMap(message, map) {
        return Array.from(message).map(char => {
            const isUppercase = char === char.toUpperCase();
            return (map[char.toLowerCase()] || char)[isUppercase ? 'toUpperCase' : 'trim']();
        }).join('');
    },
    base64Encode(str) {
        return new Buffer(str).toString('base64');
    },
    base64Decode(str) {
        return new Buffer(str, 'base64').toString('ascii');
    },
    encrypt(offset, message) {
        const map = this.getEncryptAlpha(offset);
        const firstPass = this.messageMap(message, map);
        return this.messageMap(this.base64Encode(firstPass), map);
    },
    decrypt(offset, code) {
        const map = this.getDecryptAlpha(offset);
        const firstPass = this.base64Decode(this.messageMap(code, map));
        return this.messageMap(firstPass, map);
    }
};