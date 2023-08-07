export function ensureAbsoluteURL(url) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return "http://" + url; // or 'https://' if you prefer
}
