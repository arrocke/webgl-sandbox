function ilog(n) {
    if (n <= 0) {
        return 0;
    }
    else {
        return Math.floor(Math.log2(n)) + 1;
    }
}

function intDiv(a, b) {
    return Math.floor(a / b);
}

module.exports = {
    ilog: ilog,
    intDiv: intDiv
};
