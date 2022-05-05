import { Alert, Button, CircularProgress, Table, TableBody, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useQuery } from 'react-query';
import { CartStatesLabels, CartType } from "../hooks/useCart";
import { func } from 'prop-types';

export default function History({ cart, setActiveTab }) {
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

    const open = (row) => () => {
        if (!products) return;
        const newCart = {
            ...row,
            state: parseInt(row.state),
            items: row.products
                ?.map(pid => products
                    ?.map(product => ({ ...product, price: parseFloat(product.price) }))
                    ?.find(it => it.id === pid)
                )
        }
        cart?.ouvrirVente(newCart);
        setActiveTab("produits")
    }

    return <Table size="small" aria-label="Detail ticket" className="detail-table">
        <TableHead>
            <StyledTableRow>
                <StyledTableCell variant="head">Heure</StyledTableCell>
                <StyledTableCell variant="head">Nb. Produits</StyledTableCell>
                <StyledTableCell variant="head">Total</StyledTableCell>
                <StyledTableCell variant="head">Statut</StyledTableCell>
                <StyledTableCell variant="head">Actions</StyledTableCell>
            </StyledTableRow>
        </TableHead>
        <TableBody>
            {sales?.map((row) => (
                <StyledTableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <StyledTableCell component="th" scope="row">
                        {new Date(parseInt(row.updated) * 1000)?.toLocaleDateString('fr',)} {new Date(parseInt(row.updated) * 1000)?.toLocaleTimeString('fr',)}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {row.products.length}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {formatCurrency(row.products
                            ?.map(pid => products
                                ?.find(it => it.id === pid)
                            )
                            ?.map(p => p.price)
                            ?.reduce((acc, it) => acc + parseFloat(it), 0)
                        )}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {CartStatesLabels[row.state]}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        <Button onClick={open(row)}>Reprendre</Button>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
        </TableBody>
    </Table>;
}
History.propTypes = { cart: CartType, setActiveTab: func }
History.defaultProps = { cart: undefined, setActiveTab: () => { } }