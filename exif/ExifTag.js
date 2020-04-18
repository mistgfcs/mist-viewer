const ExifTags = {

    // version tags
    0x9000: "ExifVersion",             // EXIF version
    0xA000: "FlashpixVersion",         // Flashpix format version

    // colorspace tags
    0xA001: "ColorSpace",              // Color space information tag

    // image configuration
    0xA002: "PixelXDimension",         // Valid width of meaningful image
    0xA003: "PixelYDimension",         // Valid height of meaningful image
    0x9101: "ComponentsConfiguration", // Information about channels
    0x9102: "CompressedBitsPerPixel",  // Compressed bits per pixel

    // user information
    0x927C: "MakerNote",               // Any desired information written by the manufacturer
    0x9286: "UserComment",             // Comments by user

    // related file
    0xA004: "RelatedSoundFile",        // Name of related sound file

    // date and time
    0x9003: "DateTimeOriginal",        // Date and time when the original image was generated
    0x9004: "DateTimeDigitized",       // Date and time when the image was stored digitally
    0x9290: "SubsecTime",              // Fractions of seconds for DateTime
    0x9291: "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
    0x9292: "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

    // picture-taking conditions
    0x829A: "ExposureTime",            // Exposure time (in seconds)
    0x829D: "FNumber",                 // F number
    0x8822: "ExposureProgram",         // Exposure program
    0x8824: "SpectralSensitivity",     // Spectral sensitivity
    0x8827: "ISOSpeedRatings",         // ISO speed rating
    0x8828: "OECF",                    // Optoelectric conversion factor
    0x8830: "SensitivityType",
    0x8832: "RecommendedExposureIndex",
    0x9201: "ShutterSpeedValue",       // Shutter speed
    0x9202: "ApertureValue",           // Lens aperture
    0x9203: "BrightnessValue",         // Value of brightness
    0x9204: "ExposureBias",            // Exposure bias
    0x9205: "MaxApertureValue",        // Smallest F number of lens
    0x9206: "SubjectDistance",         // Distance to subject in meters
    0x9207: "MeteringMode",            // Metering mode
    0x9208: "LightSource",             // Kind of light source
    0x9209: "Flash",                   // Flash status
    0x9214: "SubjectArea",             // Location and area of main subject
    0x920A: "FocalLength",             // Focal length of the lens in mm
    0xA20B: "FlashEnergy",             // Strobe energy in BCPS
    0xA20C: "SpatialFrequencyResponse",    //
    0xA20E: "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
    0xA20F: "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
    0xA210: "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
    0xA214: "SubjectLocation",         // Location of subject in image
    0xA215: "ExposureIndex",           // Exposure index selected on camera
    0xA217: "SensingMethod",           // Image sensor type
    0xA300: "FileSource",              // Image source (3 == DSC)
    0xA301: "SceneType",               // Scene type (1 == directly photographed)
    0xA302: "CFAPattern",              // Color filter array geometric pattern
    0xA401: "CustomRendered",          // Special processing
    0xA402: "ExposureMode",            // Exposure mode
    0xA403: "WhiteBalance",            // 1 = auto white balance, 2 = manual
    0xA404: "DigitalZoomRation",       // Digital zoom ratio
    0xA405: "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
    0xA406: "SceneCaptureType",        // Type of scene
    0xA407: "GainControl",             // Degree of overall image gain adjustment
    0xA408: "Contrast",                // Direction of contrast processing applied by camera
    0xA409: "Saturation",              // Direction of saturation processing applied by camera
    0xA40A: "Sharpness",               // Direction of sharpness processing applied by camera
    0xA40B: "DeviceSettingDescription",    //
    0xA40C: "SubjectDistanceRange",    // Distance to subject

    // other tags
    0xA005: "InteroperabilityIFDPointer",
    0xA420: "ImageUniqueID",           // Identifier assigned uniquely to each image
    0xA432: "LensInfo"
};

const FlashValue = {
    0x0: "No Flash",
    0x1: "Fired",
    0x5: "Fired, Return not detected",
    0x7: "Fired, Return detected",
    0x8: "On, Did not fire",
    0x9: "On, Fired",
    0xd: "On, Return not detected",
    0xf: "On, Return detected",
    0x10: "Off, Did not fire",
    0x14: "Off, Did not fire, Return not detected",
    0x18: "Auto, Did not fire",
    0x19: "Auto, Fired",
    0x1d: "Auto, Fired, Return not detected",
    0x1f: "Auto, Fired, Return detected",
    0x20: "No flash function",
    0x30: "Off, No flash function",
    0x41: "Fired, Red-eye reduction",
    0x45: "Fired, Red-eye reduction, Return not detected",
    0x47: "Fired, Red-eye reduction, Return detected",
    0x49: "On, Red-eye reduction",
    0x4d: "On, Red-eye reduction, Return not detected",
    0x4f: "On, Red-eye reduction, Return detected",
    0x50: "Off, Red-eye reduction",
    0x58: "Auto, Did not fire, Red-eye reduction",
    0x59: "Auto, Fired, Red-eye reduction",
    0x5d: "Auto, Fired, Red-eye reduction, Return not detected",
    0x5f: "Auto, Fired, Red-eye reduction, Return detected",
}

const ExposureProgramValue = {
    0: "Not Defined",
    1: "Manual",
    2: "Program AE",
    3: "Aperture-priority AE",
    4: "Shutter speed priority AE",
    5: "Creative (Slow speed)",
    6: "Action (High speed)",
    7: "Portrait",
    8: "Landscape",
    9: "Bulb",
}

exports.ExifTags = ExifTags;
exports.FlashValue = FlashValue;
exports.ExposureProgramValue = ExposureProgramValue;