"use strict";

const TsCrc32 = require("../crc32");
const TsReader = require("../reader");
const TsDescriptors = require("../descriptors");
const TsSectionBase = require("./base");

class TsSectionBouquetAssociation extends TsSectionBase {
    constructor(buffer, pid) {
        super(buffer, pid);
    }

    decode() {
        const reader = new TsReader(this._buffer);
        const objSection = {};

        objSection.table_id = reader.uimsbf(8);
        objSection.section_syntax_indicator = reader.bslbf(1);
        reader.next(1);    // reserved_future_use
        reader.next(2);    // reserved
        objSection.section_length = reader.uimsbf(12);
        objSection.bouquet_id = reader.uimsbf(16);
        reader.next(2);    // reserved
        objSection.version_number = reader.uimsbf(5);
        objSection.current_next_indicator = reader.bslbf(1);
        objSection.section_number = reader.uimsbf(8);
        objSection.last_section_number = reader.uimsbf(8);

        reader.next(4);    // reserved_future_use
        objSection.bouquet_descriptors_length = reader.uimsbf(12);
        objSection.bouquet_descriptors = new TsDescriptors(reader.readBytesRaw(objSection.bouquet_descriptors_length));

        reader.next(4);    // reserved_future_use
        objSection.transport_stream_loop_length = reader.uimsbf(12);
        objSection.transport_streams = [];

        for (let length = (reader.position >> 3) + objSection.transport_stream_loop_length; reader.position >> 3 < length; ) {
            const transport_stream = {};

            transport_stream.transport_stream_id = reader.uimsbf(16);
            transport_stream.original_network_id = reader.uimsbf(16);
            reader.next(4);    // reserved_future_use
            transport_stream.transport_descriptors_length = reader.uimsbf(12);
            transport_stream.transport_descriptors = new TsDescriptors(reader.readBytesRaw(transport_stream.transport_descriptors_length));

            objSection.transport_streams.push(transport_stream);
        }

        objSection.CRC_32 = reader.readBytes(4);

        return objSection;
    }

    checkCrc32() {
        return TsCrc32.calc(this._buffer) === 0;
    }

    getBouquetId() {
        return this._buffer[3] << 8 | this._buffer[4];
    }

    getVersionNumber() {
        return (this._buffer[5] & 0x3E) >> 1;
    }

    getCurrentNextIndicator() {
        return this._buffer[5] & 0x01;
    }

    getSectionNumber() {
        return this._buffer[6];
    }

    getLastSectionNumber() {
        return this._buffer[7];
    }
}

module.exports = TsSectionBouquetAssociation;
