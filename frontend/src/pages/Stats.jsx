import './Stats.scss';
import { Alert, CircularProgress, Table, TableBody, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { formatCurrency } from '../utils';

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

    const dayOfSale = (sale) =>
        new Date(sale.created * 1000).toLocaleDateString()

    const days = useMemo(() => {
        return [...new Set(sales?.map(dayOfSale))];
    }, [sales]);


    if (loadingSales || loadingProducts) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorSales || errorProducts) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les produits et/ou les ventes</Alert></div>
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
        {days?.map(day => {
            const daySales = sales?.filter(sale => dayOfSale(sale) === day);
            return (<details open={day === new Date().toLocaleDateString()}>
                <summary>Ventes du {day}</summary>
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
                            ?.map((row) => {
                                const nbSales = daySales
                                    ?.flatMap(sale => sale.items)
                                    ?.filter(item => item?.product_id === row.id)
                                    ?.reduce((acc, it) => acc + 1, 0)
                                    ;
                                const amountSales = daySales
                                    ?.flatMap(sale => sale.items)
                                    ?.filter(item => item?.product_id === row.id)
                                    ?.map(item => products.find(p => p.id === item?.product_id))
                                    ?.map(p => p?.price)
                                    ?.reduce((acc, it) => acc + parseFloat(it), 0)
                                    ;
                                return nbSales > 0 && (
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
                                            {nbSales}
                                        </StyledTableCell>
                                        <StyledTableCell align="right" component="th" scope="row">
                                            {formatCurrency(amountSales)}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        <StyledTableRow className="total">
                            <StyledTableCell variant="footer" >Total</StyledTableCell>
                            <StyledTableCell variant="footer"></StyledTableCell>
                            <StyledTableCell variant="footer"></StyledTableCell>
                            <StyledTableCell align="right" variant="footer">{formatCurrency(daySales
                                ?.flatMap(sale => sale.items)
                                ?.map(item => products.find(p => p.id === item?.product_id))
                                ?.map(p => p?.price)
                                ?.reduce((acc, it) => acc + parseFloat(it), 0)
                            )}</StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </details>)
        }
        )}
    </div>;
}