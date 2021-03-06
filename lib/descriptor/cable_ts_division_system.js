"use strict";

const TsReader = require("../reader");
const TsDescriptorBase = require("./base");

class TsDescriptorCableTsDivisionSystem extends TsDescriptorBase {
    constructor(buffer) {
        super(buffer);
    }

    decode() {
        const reader = new TsReader(this._buffer);
        const objDescriptor = {};

        objDescriptor.descriptor_tag = reader.uimsbf(8);
        objDescriptor.descriptor_length = reader.uimsbf(8);

        objDescriptor.frequencies = [];

        for (const l = 2 + objDescriptor.descriptor_length; reader.position >> 3 < l; ) {
            const frequency = {};

            frequency.frequency = reader.uimsbf(32);
            reader.next(7);    // '1111111'
            frequency.future_use_flag = reader.bslbf(1);
            frequency.multiplex_frame_format_number = reader.uimsbf(4);
            frequency.FEC_outer = reader.uimsbf(4);
            frequency.modulation = reader.uimsbf(8);
            frequency.symbol_rate = reader.uimsbf(28);
            reader.next(4);    // '1111'

            if (frequency.future_use_flag === 0) {
                frequency.future_use_data_length = reader.uimsbf(8);
                frequency.future_use_data = reader.readBytes(frequency.future_use_data_length);
            }

            frequency.num_of_services = reader.uimsbf(28);
            frequency.services = [];

            for (let i = 0; i < frequency.num_of_services; i++) {
                const service = {};

                service.service_id = reader.uimsbf(16);

                frequency.services.push(service);
            }

            objDescriptor.frequencies.push(frequency);
        }

        return objDescriptor;
    }
}

module.exports = TsDescriptorCableTsDivisionSystem;
