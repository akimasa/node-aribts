"use strict";

const binding = require(`../build/Release/binding`);

class TsCrc32 {
    constructor(buffer) {
        this.buffer = buffer;
    }

    decode() {
        return TsCrc32.calc(this.buffer);
    }

    decodeBuffer() {
        return TsCrc32.calcToBuffer(this.buffer);
    }

    static calc(buffer) {
        return binding.tscrc32(buffer, buffer.length);
    }

    static calcToBuffer(buffer) {
        let result = Buffer.alloc(4);

        result.writeInt32BE(TsCrc32.calc(buffer), 0);

        return result;
    }
}

module.exports = TsCrc32;
