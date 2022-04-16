import { useState, useCallback } from 'react';
import { Paper, Button } from '@mui/material';
import "./PaveNumerique.scss"

export default function PaveNumerique({ value, setValue }) {
    const [comma, setComma] = useState(false);
    const [mantisse, setMantisse] = useState(Math.trunc(value));
    const [fraction, setFraction] = useState(0);
    const actionHandler = useCallback((item) => {
        switch (item) {
            case "AC":
                setValue(0)
                setMantisse(0)
                setFraction(0)
                setComma(false);
                break;
            case ".":
                setComma(true);
                break;
            default:
                const newFraction = fraction * 10 + parseInt(item);
                const newMantisse = mantisse * 10 + parseInt(item);
                if (comma) {
                    setFraction(newFraction);
                    setValue(mantisse + Math.pow(10, -(newFraction.toString().length)) * newFraction)
                } else {
                    setMantisse(newMantisse);
                    setValue(newMantisse + Math.pow(10, -(fraction.toString().length)) * fraction)
                }
                break
        }
    }, [mantisse, fraction, setMantisse, setFraction, comma, setValue]);

    const buttonOrder = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "AC", "0", "."];
    return <Paper elevation="4" className="pave-numerique-container">
        <div>
            {value}
        </div>
        {buttonOrder?.map(val =>
            <Button variant="outlined" onClick={() => actionHandler(val)}>
                {val}
            </Button>
        )}
    </Paper>
}