const fs = require("fs").promises
const TiffTags = require("./TiffTag").TiffTags
const ExifTags = require("./ExifTag").ExifTags
const FlashValue = require("./ExifTag").FlashValue
const ExposureProgramValue = require("./ExifTag").ExposureProgramValue
const Makernote = require("./MakernoteTag")

async function readFile(path) {
    const buffer = await fs.readFile(path);
    let ab = new ArrayBuffer(buffer.length);
    let view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function getString(dataview, start, length) {
    var outstr = "";
    for (var n = start; n < start + length; n++) {
        outstr += String.fromCharCode(dataview.getUint8(n));
    }
    return outstr;
}

function readTags(dataview, tiffStart, dirStart, strings, isLittleEndian, debug = false) {
    const entries = dataview.getUint16(dirStart, isLittleEndian);
    if (debug) console.log("entries:", entries)
    let tags = {};

    for (let i = 0; i < entries; i++) {
        let entryOffset = dirStart + i * 12 + 2;
        let tag = strings[dataview.getUint16(entryOffset, isLittleEndian)];
        if (!tag && debug) console.log("Unknown tag: " + dataview.getUint16(entryOffset, isLittleEndian).toString(16));
        if (tag === "MakerNote") {
            tags["MakerNotePointer"] = dataview.getUint32(entryOffset + 8, isLittleEndian) + tiffStart;
        } else {
            tags[tag] = readTagValue(dataview, entryOffset, tiffStart, isLittleEndian);
        }
    }
    return tags;
}


function readTagValue(dataview, entryOffset, tiffStart, isLittleEndian) {
    const type = dataview.getUint16(entryOffset + 2, isLittleEndian);
    const numValues = dataview.getUint32(entryOffset + 4, isLittleEndian);
    const valueOffset = dataview.getUint32(entryOffset + 8, isLittleEndian) + tiffStart;

    switch (type) {
        case 1: // byte, 8-bit unsigned int
        case 7: // undefined, 8-bit byte, value depending on field
            if (numValues == 1) {
                return dataview.getUint8(entryOffset + 8, isLittleEndian);
            } else {
                const offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                let vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = dataview.getUint8(offset + n);
                }
                return vals;
            }

        case 2: // ascii, 8-bit byte
            const offset = numValues > 4 ? valueOffset : (entryOffset + 8);
            return getString(dataview, offset, numValues - 1);

        case 3: // short, 16 bit int
            if (numValues == 1) {
                return dataview.getUint16(entryOffset + 8, isLittleEndian);
            } else {
                const offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                let vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = dataview.getUint16(offset + 2 * n, isLittleEndian);
                }
                return vals;
            }

        case 4: // long, 32 bit int
            if (numValues == 1) {
                return dataview.getUint32(entryOffset + 8, isLittleEndian);
            } else {
                let vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = dataview.getUint32(valueOffset + 4 * n, isLittleEndian);
                }
                return vals;
            }

        case 5:    // rational = two long values, first is numerator, second is denominator
            if (numValues == 1) {
                const numerator = dataview.getUint32(valueOffset, isLittleEndian);
                const denominator = dataview.getUint32(valueOffset + 4, isLittleEndian);
                let val = { value: numerator / denominator, numerator: numerator, denominator: denominator };
                return val;
            } else {
                let vals = [];
                for (n = 0; n < numValues; n++) {
                    const numerator = dataview.getUint32(valueOffset + 8 * n, isLittleEndian);
                    const denominator = dataview.getUint32(valueOffset + 4 + 8 * n, isLittleEndian);
                    vals[n] = { value: numerator / denominator, numerator: numerator, denominator: denominator };
                }
                return vals;
            }

        case 9: // slong, 32 bit signed int
            if (numValues == 1) {
                return dataview.getInt32(entryOffset + 8, isLittleEndian);
            } else {
                let vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = dataview.getInt32(valueOffset + 4 * n, isLittleEndian);
                }
                return vals;
            }

        case 10: // signed rational, two slongs, first is numerator, second is denominator
            if (numValues == 1) {
                return dataview.getInt32(valueOffset, isLittleEndian) / dataview.getInt32(valueOffset + 4, isLittleEndian);
            } else {
                let vals = [];
                for (n = 0; n < numValues; n++) {
                    vals[n] = dataview.getInt32(valueOffset + 8 * n, isLittleEndian) / dataview.getInt32(valueOffset + 4 + 8 * n, isLittleEndian);
                }
                return vals;
            }
    }
}

const parse = async (path) => {
    const arraybuffer = await readFile(path);
    const dv = new DataView(arraybuffer);
    if (dv.getUint16(0) !== 0xFFD8) {
        throw "SOI error";
    }
    let app1MarkerOffset = 2;
    if (dv.getUint16(app1MarkerOffset) === 0xFFE0) {
        app1MarkerOffset += dv.getUint16(app1MarkerOffset + 2) + 2
    }
    if (dv.getUint16(app1MarkerOffset) !== 0xFFE1) {
        throw "App1 Marker error";
    }
    if (dv.getUint32(app1MarkerOffset + 4) !== 0x45786966) {
        throw "Invalid Exif data";
    }
    if (dv.getUint16(app1MarkerOffset + 8) !== 0x0000) {
        throw "Invalid header";
    }
    const tiffOffset = app1MarkerOffset + 10;
    let isLittleEndian = false;
    switch (dv.getUint16(tiffOffset)) {
        case 0x4949:
            isLittleEndian = true;
            break;
        case 0x4D4D:
            isLittleEndian = false;
            break;
        default:
            throw "Invalid Endian";
    }
    if (dv.getUint16(tiffOffset + 2, isLittleEndian) !== 0x002A) {
        throw "Invalid Tiff Header";
    }
    const IFD0Offset = dv.getUint32(tiffOffset + 4, isLittleEndian);
    let tags = readTags(dv, tiffOffset, tiffOffset + IFD0Offset, TiffTags, isLittleEndian);
    exifData = readTags(dv, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, isLittleEndian);
    let location;
    if (Makernote.IsAvailable()) {
        const offset = Makernote.ReadOffset();
        makernote = readTags(dv, tiffOffset, offset + exifData.MakerNotePointer, Makernote.MakernoteTags, isLittleEndian);
        location = Makernote.SubjectLocation(makernote);
    } else {
        location = exifData.SubjectLocation;
    }
    const is_exist_location = location !== undefined;
    return {
        file_path: path,
        exif: {
            SubjectLocation: is_exist_location ? { x: location[0], y: location[1] } : { x: undefined, y: undefined },
            ExposureTime: exifData.ExposureTime,
            ISOSpeedRatings: exifData.ISOSpeedRatings,
            FNumber: exifData.FNumber,
            Flash: FlashValue[exifData.Flash],
            ExposureProgram: ExposureProgramValue[exifData.ExposureProgram],
            FocalLengthIn35mmFilm: exifData.FocalLengthIn35mmFilm,
            DateTime: exifData.DateTimeOriginal,
        }
    };
}

exports.parse = parse;