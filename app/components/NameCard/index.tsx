import React from "react"
import { Card, makeStyles, Theme, createStyles } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            position: "absolute",
            zIndex: 100,
            padding: "2px",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            top: "2px",
            left: "2px",
            fontSize: "x-small",
        }
    })
)

interface NameCardProps {
    name: string;
}

const NameCard: React.FC<NameCardProps> = (props) => {
    const classes = useStyles();
    return (
        <Card className={classes.card}>{props.name}</Card>
    )
}

export default NameCard;