const MakernoteTags = {
    0xFFFF: "Hoge",
}

const IsAvailable = () => false;

const ReadOffset = () => 0;

const SubjectLocation = (tags) => [tags.Hoge[0], tags.Hoge[1]];

exports.MakernoteTags = MakernoteTags;
exports.ReadOffset = ReadOffset;
exports.IsAvailable = IsAvailable;
exports.SubjectLocation = SubjectLocation;