"use strict";

const binding = require(`../build/Release/binding`);

class TsCrc32 {
    static calc(buffer) {
	    return binding.tscrc32(buffer, buffer.length);
    }

    static calcToBuffer(buffer) {
        const result = Buffer.alloc(4);

        result.writeInt32BE(TsCrc32.calc(buffer), 0);

        return result;
    }
}


module.exports = TsCrc32;
