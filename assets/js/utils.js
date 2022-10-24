class Utils {
    constructor() {}
    createID(length = 6) {
        let token = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }
    escapeHTML = (str) => { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
}