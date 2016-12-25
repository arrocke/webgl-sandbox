var encodings = {};

for (var i = 0; i < 26; i++) {
    var code = i + 65;
    var letter = String.fromCharCode(code);
    encodings[letter] = code;
}

for (var i = 0; i < 26; i++) {
    var code = i + 97;
    var letter = String.fromCharCode(code);
    encodings[letter] = code;
}

module.exports = encodings;
