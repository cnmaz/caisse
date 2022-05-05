import { Alert, CircularProgress, Table, TableBody, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useQuery } from 'react-query';
import './Commandes.scss';
import { CartStates, ProductStatesLabels } from "../hooks/useCart";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Commandes() {
    const largeMode = useMediaQuery('(min-width:600px)');

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

    const rsales = sales?.sort((a, b) => a.id === b.id ? 0 : (a.id < b.id ? -1 : 1));


    return <div className="stats-container">
        <Table size="small" aria-label="Historique des ventes" className="history-table">
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell variant="head">{largeMode ? "No. Commande" : "Cmd."}</StyledTableCell>
                    <StyledTableCell variant="head">Produit</StyledTableCell>
                    <StyledTableCell variant="head">Etat</StyledTableCell>
                    <StyledTableCell variant="head">Actions</StyledTableCell>
                </StyledTableRow>
            </TableHead>
            <TableBody>
                {rsales
                    ?.filter(row => parseInt(row.state) === CartStates.Paye)
                    ?.map((sale) => ({
                        ...sale, items: sale.items
                            ?.map(item => ({
                                ...item, product: products
                                    ?.map(product => ({ ...product, price: parseFloat(product.price) }))
                                    ?.find(it => it.id === item?.product_id)
                            })
                            )
                    }))
                    ?.map((sale) => sale.items
                        ?.filter(item => item?.product?.preparation === '1')
                        ?.map((item, idx) =>
                            <StyledTableRow
                                key={sale.id + '-' + idx}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {sale.id}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {item?.product?.label}
                                </StyledTableCell>
                                <StyledTableCell align="right" component="th" scope="row">
                                    {ProductStatesLabels[item?.state]}
                                </StyledTableCell>
                                <StyledTableCell align="right" component="th" scope="row">
                                    ?
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
            </TableBody>
        </Table>
    </div>
}