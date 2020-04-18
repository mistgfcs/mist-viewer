import React from "react";
import ReactDom from "react-dom";
import App from "./containers/App";
import "../style.css";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            root:{
                fontSize: "0.75em",
                borderBottom: "",
            }
        }
    }
})

ReactDom.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    document.getElementById("root"),
);
