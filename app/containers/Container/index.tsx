import React, { useState, useEffect, createRef, useRef } from "react";
import MovableImage from "../../components/MovableImage";
import ExifCard from "../../components/ExifCard";
const { ipcRenderer } = window;
import { makeStyles, createStyles, Theme } from "@material-ui/core"
import NameCard from "../../components/NameCard";

const DEFAULT_IMAGE_SIZE_X = 800;
const DEFAULT_IMAGE_SIZE_Y = DEFAULT_IMAGE_SIZE_X * 2 / 3;
const ORIGINAL_IMAGE_SIZE_X = 6000;
const ORIGINAL_IMAGE_SIZE_Y = 4000;

interface ContainerProps {
    rightPress: boolean,
    leftPress: boolean,
    expandExif: boolean,
    showFileName: boolean,
    showExif: boolean,
}

interface ExifProps {
    SubjectLocation: { x: number, y: number },
    ExposureTime: { value: number, numerator: number, denominator: number },
    ISOSpeedRatings: number,
    FNumber: { value: number, numerator: number, denominator: number },
    Flash: string,
    ExposureProgram: string,
    FocalLengthIn35mmFilm: number,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dropArea: {
            width: "inherit",
            height: "inherit",
            textAlign: "center",
            cursor: "default",
        }
    })
);

const Container: React.FC<ContainerProps> = (props) => {
    const classes = useStyles();

    const [isExpansion, setExpansion] = useState(false);
    const [pos, setPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const [clickMode, setClickMode] =
        useState<"Move" | "Expansion" | undefined>(undefined);

    const [imageList, setImageList] = useState<string[]>();
    const [showImageIndex, setShowImageIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const currentImage = useRef<MovableImage>(null);

    const [exif, setExif] = useState<ExifProps>();

    const preloadImage: HTMLImageElement[] = [
        document.createElement("img"),
        document.createElement("img"),
        document.createElement("img"),
        document.createElement("img"),
        document.createElement("img"),
    ];

    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        setStartPos({ x: event.pageX, y: event.pageY });
        setClickMode("Expansion");
    }

    const handleMouseMove = (event: React.MouseEvent) => {
        event.preventDefault();
        if (clickMode !== undefined) {
            const moveX = event.pageX - startPos.x;
            const moveY = event.pageY - startPos.y;
            if (clickMode !== "Move" && ((moveX === 0) && (moveY === 0))) {
                setClickMode("Expansion");
                return;
            }
            setPos({ x: pos.x + moveX, y: pos.y + moveY });
            setStartPos({ x: event.pageX, y: event.pageY });
            setClickMode("Move");
        }
    }

    const handleMouseUp = (event: React.MouseEvent) => {
        event.preventDefault();
        if (clickMode === "Expansion") {
            const containerSizeX = containerRef.current?.clientWidth || ORIGINAL_IMAGE_SIZE_X;
            const containerSizeY = containerRef.current?.clientHeight || ORIGINAL_IMAGE_SIZE_Y;
            const imageSizeX = currentImage.current?.NaturalWidth() || ORIGINAL_IMAGE_SIZE_X;
            const imageSizeY = currentImage.current?.NaturalHeight() || ORIGINAL_IMAGE_SIZE_Y;
            const smallImageSizeX = currentImage.current?.Width() || DEFAULT_IMAGE_SIZE_X;
            const smallImageSizeY = currentImage.current?.Height() || DEFAULT_IMAGE_SIZE_Y;
            const imageOffsetX = (containerSizeX - smallImageSizeX) / 2; // 中央配置しているからずれる
            const imageOffsetY = 0; // 縦位置は上詰め

            const clickPosXRatio = (event.pageX - imageOffsetX) / smallImageSizeX;
            const clickPosYRatio = (event.pageY - imageOffsetY) / smallImageSizeY;
            // コンテナサイズを超えないときは中央配置が効く
            const shiftX = containerSizeX > imageSizeX ? 0 : imageSizeX * clickPosXRatio - (containerSizeX / 2);
            const shiftY = imageSizeY * clickPosYRatio - (containerSizeY / 2);
            setPos({ x: -shiftX, y: -shiftY });
            setExpansion(!isExpansion);
        }
        setClickMode(undefined);
    }

    // 画面外にマウスが出たときの動作
    const handleMouseLeave = (event: React.MouseEvent) => {
        event.preventDefault();
        setClickMode(undefined);
    }

    const getImageList = async (paths: string[]) => {
        const i: string[] = await ipcRenderer.invoke("get-image-list", paths);
        return i.slice();
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const paths: string[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < event.dataTransfer.files.length; index++) {
            const element = event.dataTransfer.files[index];
            paths.push(element.path);
        }
        getImageList(paths).then(result => {
            setImageList(result);
            setShowImageIndex(0);
            return result;
        }).then(p => {
            ipcRenderer.invoke("preload-exif", p);
            if (props.expandExif) {
                setXYFromExif(p[0]);
            }
            getExif(p[0]);
        });

        ipcRenderer.invoke("set-focus");
    }

    const handlePreventDefault = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const setXYFromExif = async (path: string) => {
        const location: { x: number | undefined, y: number | undefined } = await ipcRenderer.invoke("get-location", path);
        const windowSizeX = containerRef.current?.clientWidth || 0;
        const windowSizeY = containerRef.current?.clientHeight || 0;
        const imageSizeX = currentImage.current?.NaturalWidth() || 0;
        const imageSizeY = currentImage.current?.NaturalHeight() || 0;
        const x = location.x ? location.x : imageSizeX / 2;
        const y = location.y ? location.y : imageSizeY / 2;
        setPos({
            x: -x + windowSizeX / 2,
            y: -y + windowSizeY / 2
        });
    }

    const getExif = async (path: string) => {
        const e = await ipcRenderer.invoke("get-exif", path)
        setExif(e);
    }

    useEffect(() => {
        if (props.expandExif && imageList) {
            setXYFromExif(imageList[showImageIndex]);
        }
        if (props.showExif && imageList) {
            getExif(imageList[showImageIndex]);
        }
    }, [showImageIndex]);

    useEffect(() => {
        if (imageList && props.rightPress) {
            setShowImageIndex((old) => {
                return (old + 1) % imageList?.length;
            });
            if (props.expandExif) {
                setExpansion(true);
            }
        }
    }, [props.rightPress]);

    useEffect(() => {
        if (imageList && props.leftPress) {
            setShowImageIndex((old) => {
                let i = old - 1;
                i = i < 0 ? imageList?.length - 1 : i;
                return i;
            });
            if (props.expandExif) {
                setExpansion(true);
            }
        }
    }, [props.leftPress]);

    useEffect(() => {
        if (props.expandExif && imageList) {
            setXYFromExif(imageList[showImageIndex]);
        }
        setExpansion(props.expandExif);
    }, [props.expandExif])

    useEffect(() => {
        if (props.showExif && imageList) {
            getExif(imageList[showImageIndex]);
        }
    }, [props.showExif])

    useEffect(() => {
        if (imageList === undefined) return;

        // preloadしてみているものの本当に早くなっているのかは測ってない
        // ラップアラウンドしているからコードが汚い・・・
        preloadImage[0].src = imageList[showImageIndex];
        let forwardIndex = (showImageIndex + 1) % imageList.length;
        preloadImage[1].src = imageList[forwardIndex];
        forwardIndex = (forwardIndex + 1) % imageList.length;
        preloadImage[2].src = imageList[forwardIndex];
        let backwardIndex = (showImageIndex - 1) < 0 ? imageList.length - 1 : showImageIndex - 1;
        preloadImage[4].src = imageList[backwardIndex];
        backwardIndex = (backwardIndex - 1) < 0 ? imageList.length - 1 : backwardIndex - 1;
        preloadImage[3].src = imageList[backwardIndex];
    }, [showImageIndex]);

    if (imageList === undefined) {
        return (
            <div
                style={{ width: "100%", height: "100%" }}
                onDragOver={handlePreventDefault}
                onDragLeave={handlePreventDefault}
                onDragEnd={handlePreventDefault}
                onDrop={handleDrop}
            >
            </div>
        )
    } else {
        return (
            <div
                ref={containerRef}
                className={classes.dropArea}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onDragOver={handlePreventDefault}
                onDragLeave={handlePreventDefault}
                onDragEnd={handlePreventDefault}
                onDrop={handleDrop}
            >
                {props.showFileName ?
                    <NameCard name={imageList[showImageIndex]}></NameCard>
                    : ""
                }
                <MovableImage ref={currentImage} src={imageList[showImageIndex]} isExpansion={isExpansion} x={pos.x} y={pos.y} />
                {props.showExif && exif !== undefined ?
                    <ExifCard ExposureTime={exif.ExposureTime}
                        ISOSpeedRatings={exif.ISOSpeedRatings}
                        FNumber={exif.FNumber}
                        Flash={exif.Flash}
                        ExposureProgram={exif.ExposureProgram}
                        FocalLengthIn35mmFilm={exif.FocalLengthIn35mmFilm} />
                    : ""
                }
            </div >
        )
    }
};

export default Container;