export function ensureAbsoluteURL(url) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return "http://" + url; // or 'https://' if you prefer
}

export function generateId(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}
