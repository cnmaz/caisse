import { Alert, CircularProgress, Table, TableBody, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useQuery } from 'react-query';
import { CartStatesLabels } from "../hooks/useCart";

export default function History() {
    const { data: products, loading: loadingProducts, error: errorProducts } = useQuery(["products"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))

    const { data: sales, loading: loadingSales, error: errorSales
    } = useQuery(["sales"], () =>
        fetch('/api/sale').then(res =>
            res.json()
        ))


    if (loadingSales || loadingProducts) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorSales || errorProducts) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les produits et/ou les ventes</Alert></div>
    }

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
        [`&.${tableCellClasses.warning}`]: {
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.common.white,
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

    return <Table size="small" aria-label="Detail ticket" className="detail-table">
        <TableHead>
            <StyledTableRow>
                <StyledTableCell variant="head">Id</StyledTableCell>
                <StyledTableCell variant="head">Heure</StyledTableCell>
                <StyledTableCell variant="head">Nb. Produits</StyledTableCell>
                <StyledTableCell variant="head">Total</StyledTableCell>
                <StyledTableCell variant="head">Statut</StyledTableCell>
            </StyledTableRow>
        </TableHead>
        <TableBody>
            {sales?.map((row) => (
                <StyledTableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <StyledTableCell component="th" scope="row">
                        {row.id}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        TODO
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.products.length}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.products
                            ?.map(pid => products
                                ?.find(it => it.id === pid)
                            )
                            ?.map(p => p.price)
                            ?.reduce((acc, it) => acc + parseFloat(it), 0)
                        }
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {CartStatesLabels[row.state]}
                    </StyledTableCell>
                </StyledTableRow>
            ))}
        </TableBody>
    </Table>;
}