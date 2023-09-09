import { Accordion, AccordionDetails, AccordionSummary, Alert, Badge, Button, CircularProgress, FormControlLabel, Switch, Table, TableBody, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { CartStates, CartStatesLabels, CartType } from "../hooks/useCart";
import { func } from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import './Tabs.scss'
import { formatCurrency } from "../utils";

export default function Tabs({ cart, setActiveTab }) {
    const largeMode = useMediaQuery('(min-width:600px)');

    const { data: products, loading: loadingProducts, error: errorProducts } = useQuery(["products"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))

    const { data: sales, loading: loadingSales, error: errorSales
    } = useQuery(["sales"], () =>
        fetch('/api/sale?tabs=true').then(res =>
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

    const open = (row) => () => {
        if (!products) return;
        const newCart = {
            ...row,
            state: parseInt(row.state),
            items: row.items
                ?.map(item => ({
                    ...item,
                    item: products
                        ?.map(product => ({ ...product, price: parseFloat(product.price) }))
                        ?.find(it => it.id === item?.product_id),
                    state: item?.state
                })
                )
        }
        cart?.ouvrirVente(newCart);
        if (row.state === CartStates.Paye) {
            setActiveTab("ticket")
        } else {
            setActiveTab("produits")
        }
    }

    return <div>
        {days?.map(day => {
            const daySales = sales?.filter(sale => dayOfSale(sale) === day);
            return (<Accordion defaultExpanded={day === new Date().toLocaleDateString()}>
                <AccordionSummary>Ardoises du {day}</AccordionSummary>
                <AccordionDetails>
                    <Table size="small" aria-label="Historique des ventes" className="history-table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell variant="head">Nom</StyledTableCell>
                                <StyledTableCell variant="head">Nb. {largeMode ? "Produits" : "Pr."}</StyledTableCell>
                                <StyledTableCell variant="head">Total</StyledTableCell>
                                <StyledTableCell variant="head">{largeMode ? "Mode Paiement" : "Mode P."}</StyledTableCell>
                                <StyledTableCell variant="head">Statut</StyledTableCell>
                                <StyledTableCell variant="head">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {daySales
                                ?.map(row => ({ ...row, state: parseInt(row.state) }))
                                ?.map((row) => (
                                    <StyledTableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StyledTableCell component="th" scope="row">
                                            {row?.name}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {row.items.length}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {formatCurrency(row.items
                                                ?.map(item => products
                                                    ?.find(it => it.id === item?.product_id)
                                                )
                                                ?.map(p => p?.price)
                                                ?.reduce((acc, it) => acc + parseFloat(it), 0)
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {row.mode}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {CartStatesLabels[row.state]}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            <Button onClick={open(row)}>{row.state === CartStates.Paye ? 'Consulter' : 'Reprendre'}</Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>)
        }
        )}
    </div>;
}
Tabs.propTypes = { cart: CartType, setActiveTab: func }
Tabs.defaultProps = { cart: undefined, setActiveTab: () => { } }