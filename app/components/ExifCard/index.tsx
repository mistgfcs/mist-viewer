import React from "react";
import {
    makeStyles,
    Theme,
    createStyles,
    Card,
    CardContent,
    Table,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            position: "absolute",
            zIndex: 100,
            bottom: "20px",
            right: "20px",
            borderRadius: theme.spacing(0.5),
            overflow: "initial",
            backgroundColor: "rgba(255, 255, 255, 0.6)"
        },
        content: {
            textAlign: "left",
            overflowX: "auto",
        },
    })
);

interface ExifProps {
    ExposureTime?: { value: number, numerator: number, denominator: number },
    ISOSpeedRatings?: number,
    FNumber?: { value: number, numerator: number, denominator: number },
    Flash?: string,
    ExposureProgram?: string,
    FocalLengthIn35mmFilm?: number,
    DateTime?: string,
}
const ExifCard: React.FC<ExifProps> = (props) => {
    const classes = useStyles();
    const rows = []
    if (props.DateTime) rows.push({ key: "撮影日時", value: props.DateTime });
    if (props.ISOSpeedRatings) rows.push({ key: "ISO", value: props.ISOSpeedRatings });
    if (props.ExposureTime) rows.push({
        key: "SS",
        value: (props.ExposureTime.value >= 1 ? props.ExposureTime.value
            : props.ExposureTime.numerator + "/" + props.ExposureTime.denominator)
            + " s"
    });
    if (props.FNumber) rows.push({ key: "F値", value: props.FNumber.value });
    if (props.ExposureProgram) rows.push({ key: "AEモード", value: props.ExposureProgram });
    if (props.Flash) rows.push({ key: "Flash", value: props.Flash });
    if (props.FocalLengthIn35mmFilm) rows.push({ key: "35mm焦点距離", value: props.FocalLengthIn35mmFilm + "mm" });

    if (rows.length === 0) return <></>;
    return (
        <Card className={classes.card}>
            <CardContent className={classes.content}>
                <Table size="small">
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.key}>
                                <TableCell component="th" scope="row">{row.key}</TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ExifCard;