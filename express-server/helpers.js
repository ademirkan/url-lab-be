export function ensureAbsoluteURL(url) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }
    return "http://" + url; // or 'https://' if you prefer
}

export function generateUniqueId(connection, callback) {
    let id = generateId(5);
    checkUniqueness(id, connection, (err, isUnique) => {
        if (err) {
            callback(err);
        } else if (!isUnique) {
            // Recursively call the function if id is not unique
            generateUniqueId(connection, callback);
        } else {
            callback(null, id);
        }
    });
}

function generateId(length) {
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

function checkUniqueness(id, connection, callback) {
    connection.query(
        "SELECT url FROM urls WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                callback(err);
            } else if (results.length === 0) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }
    );
}
