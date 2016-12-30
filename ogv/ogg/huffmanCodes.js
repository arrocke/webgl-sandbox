var longRunBitStringTable = {
    '0': {
        RSTART: 1,
        RBITS: 0,
    },
    '10': {
        RSTART: 2,
        RBITS: 1,
    },
    '110': {
        RSTART: 4,
        RBITS: 1,
    },
    '1110': {
        RSTART: 6,
        RBITS: 2,
    },
    '11110': {
        RSTART: 10,
        RBITS: 3,
    },
    '111110': {
        RSTART: 18,
        RBITS: 4,
    },
    '111111': {
        RSTART: 34,
        RBITS: 12,
    }
};

var shortRunBitStringTable = {
    '0': {
        RSTART: 1,
        RBITS: 0
    },
    '10': {
        RSTART: 2,
        RBITS: 1
    },
    '110': {
        RSTART: 4,
        RBITS: 1
    },
    '1110': {
        RSTART: 6,
        RBITS: 2
    },
    '11110': {
        RSTART: 10,
        RBITS: 3
    },
    '11111': {
        RSTART: 34,
        RBITS: 12
    }
}

var macroBlockCodingSchemes = [];

macroBlockCodingSchemes[0] = {
    '0': 3,
    '10': 4,
    '110': 2,
    '1110': 0,
    '11110': 1,
    '111110': 5,
    '1111110': 6,
    '1111111': 7,
};
macroBlockCodingSchemes[1] = {
    '0': 3,
    '10': 4,
    '110': 0,
    '1110': 2,
    '11110': 1,
    '111110': 5,
    '1111110': 6,
    '1111111': 7,
};
macroBlockCodingSchemes[2] = {
    '0': 3,
    '10': 2,
    '110': 4,
    '1110': 0,
    '11110': 1,
    '111110': 5,
    '1111110': 6,
    '1111111': 7,
};
macroBlockCodingSchemes[3] = {
    '0': 3,
    '10': 2,
    '110': 0,
    '1110': 4,
    '11110': 1,
    '111110': 5,
    '1111110': 6,
    '1111111': 7,
};
macroBlockCodingSchemes[4] = {
    '0': 0,
    '10': 3,
    '110': 4,
    '1110': 2,
    '11110': 1,
    '111110': 5,
    '1111110': 6,
    '1111111': 7,
};
macroBlockCodingSchemes[5] = {
    '0': 0,
    '10': 5,
    '110': 3,
    '1110': 4,
    '11110': 2,
    '111110': 1,
    '1111110': 6,
    '1111111': 7,
};
macroBlockCodingSchemes[6] = {
    '0': 0,
    '10': 1,
    '110': 2,
    '1110': 3,
    '11110': 4,
    '111110': 5,
    '1111110': 6,
    '1111111': 7,
};

module.exports = {
    longRunBitString: longRunBitStringTable,
    shortRunBitString: shortRunBitStringTable,
    macroBlockCodingSchemes: macroBlockCodingSchemes
};
