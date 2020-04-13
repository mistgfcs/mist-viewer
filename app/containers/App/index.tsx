import React, { useState, useEffect } from "react";
import Container from "../Container"
const { ipcRenderer } = window;

const useKeyPress = (targetKey: string) => {
    const [keyPressed, setKeyPressed] = useState(false);
    const downHandler = (key: KeyboardEvent) => {
        if (key.key === targetKey) {
            setKeyPressed(true);
        }
    }
    const upHandler = (key: KeyboardEvent) => {
        if (key.key === targetKey) {
            setKeyPressed(false);
        }
    };
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    });
    return keyPressed;
};

const App: React.FC = () => {
    const rightPress = useKeyPress("ArrowRight");
    const leftPress = useKeyPress("ArrowLeft");
    const [expandExif, setExpandExif] = useState(false);
    const [showFileName, setShowFileName] = useState(false);

    useEffect(()=>{
        ipcRenderer.on("set-expand-exif", (event, arg) => {
            setExpandExif(arg)
        });
        ipcRenderer.on("set-show-file-name", (event, arg) =>{
            setShowFileName(arg);
        });
    }, []);

    return <Container rightPress={rightPress} leftPress={leftPress} expandExif={expandExif} showFileName={showFileName} />
};

export default App;