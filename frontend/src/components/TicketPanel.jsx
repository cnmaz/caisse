import { Table, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import './TicketPanel.scss';
import { CartType } from '../hooks/useCart';
import { bool } from 'prop-types';


export default function TicketPanel({ cart, totalOnly, className }) {
    const formatCurrency = (val) => {
        if (val === undefined) { return val; }
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
        [`&.${tableCellClasses.footer}`]: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            fontSize: 18,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    return <Paper className={className ?? "ticket-panel-container"}>
        {totalOnly || (
            <>
                <div className="label">Ticket en cours</div>
                <div className="detail-table-container">
                    <Table size="small" aria-label="Detail ticket" className="detail-table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell variant="head">Libellé</StyledTableCell>
                                <StyledTableCell variant="head" align="right">Prix</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {cart?.items?.map((row) => (
                                <StyledTableRow
                                    key={row.label}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {row.label}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{formatCurrency(row.price)}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>)
        }
        <Table size="small" aria-label="Total ticket" className="total-table">
            <TableBody>
                <StyledTableRow className="total">
                    <StyledTableCell variant="footer" >Total</StyledTableCell>
                    <StyledTableCell align="right" variant="footer">{formatCurrency(cart?.getTotal())}</StyledTableCell>
                </StyledTableRow>
            </TableBody>
        </Table>
    </Paper>
}
TicketPanel.propTypes = {
    cart: CartType,
    totalOnly: bool
}