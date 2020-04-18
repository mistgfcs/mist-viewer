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
    TableBody} from "@material-ui/core";

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
}
const ExifCard: React.FC<ExifProps> = (props) => {
    const classes = useStyles();
    const rows = [
        { key: "ISO", value: props.ISOSpeedRatings },
        { key: "SS", value: props.ExposureTime?.numerator + "/" + props.ExposureTime?.denominator },
        { key: "F値", value: props.FNumber?.value },
        { key: "AEモード", value: props.ExposureProgram },
        { key: "Flash", value: props.Flash },
        { key: "焦点距離", value: props.FocalLengthIn35mmFilm + "mm" },
    ]
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