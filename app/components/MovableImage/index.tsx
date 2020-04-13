import { Component, createRef } from "react";
import React from "react";

const abs: "absolute" = "absolute";

const styleGenerator = (isExpansion: boolean, x: number, y: number) =>
    ({
        // position: abs,
        width: "auto",
        height: "auto",
        transform: isExpansion ? "translate(" + x + "px, " + y + "px)" : "",
        maxWidth: isExpansion ? "" : "100%",
        maxHeight: isExpansion ? "" : "100%",
    })

interface MovableImageProps {
    isExpansion: boolean,
    x: number,
    y: number,
    src: string
}
class MovableImage extends Component<MovableImageProps> {
    constructor(props: Readonly<MovableImageProps>) {
        super(props);
        this.imgRefs = createRef<HTMLImageElement>();
    }
    private imgRefs: React.RefObject<HTMLImageElement>;

    NaturalWidth() {
        return this.imgRefs.current?.naturalWidth;
    }
    NaturalHeight() {
        return this.imgRefs.current?.naturalHeight;
    }
    Width() {
        return this.imgRefs.current?.width;
    }
    Height() {
        return this.imgRefs.current?.height;
    }
    render() {
        return <img ref={this.imgRefs} style={styleGenerator(this.props.isExpansion, this.props.x, this.props.y)}
            src={this.props.src} />
    }
}

export default MovableImage;