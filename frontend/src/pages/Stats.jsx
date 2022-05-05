import './Stats.scss';
import { Alert, CircularProgress, Table, TableBody, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useQuery } from 'react-query';

export default function Stats() {

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


    return <div className="stats-container">
        <Table size="small" aria-label="Historique des ventes" className="history-table">
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell variant="head">Produit</StyledTableCell>
                    <StyledTableCell variant="head">PU</StyledTableCell>
                    <StyledTableCell variant="head">Nb. Ventes</StyledTableCell>
                    <StyledTableCell variant="head">Revenu Total</StyledTableCell>
                </StyledTableRow>
            </TableHead>
            <TableBody>
                {products
                    ?.map((row) => (
                        <StyledTableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <StyledTableCell component="th" scope="row">
                                {row.label}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {formatCurrency(row.price)}
                            </StyledTableCell>
                            <StyledTableCell align="right" component="th" scope="row">
                                {sales
                                    ?.flatMap(sale => sale.products)
                                    ?.filter(pid => pid === row.id)
                                    ?.reduce((acc, it) => acc + 1, 0)
                                }
                            </StyledTableCell>
                            <StyledTableCell align="right" component="th" scope="row">
                                {formatCurrency(sales
                                    ?.flatMap(sale => sale.products)
                                    ?.filter(pid => pid === row.id)
                                    ?.map(pid => products.find(p => p.id === pid))
                                    ?.map(p => p.price)
                                    ?.reduce((acc, it) => acc + parseFloat(it), 0)
                                )}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                <StyledTableRow className="total">
                    <StyledTableCell variant="footer" >Total</StyledTableCell>
                    <StyledTableCell variant="footer"></StyledTableCell>
                    <StyledTableCell variant="footer"></StyledTableCell>
                    <StyledTableCell align="right" variant="footer">{formatCurrency(sales
                        ?.flatMap(sale => sale.products)
                        ?.map(pid => products.find(p => p.id === pid))
                        ?.map(p => p.price)
                        ?.reduce((acc, it) => acc + parseFloat(it), 0)
                    )}</StyledTableCell>
                </StyledTableRow>
            </TableBody>
        </Table>
    </div>;
}