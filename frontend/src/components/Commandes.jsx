import { Alert, CircularProgress, Table, TableBody, TableHead, TableRow, Button, Container, Stack, Collapse } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useQuery } from 'react-query';
import './Commandes.scss';
import { CartStates, ProductStates, ProductStatesLabels } from "../hooks/useCart";
import useMediaQuery from '@mui/material/useMediaQuery';
import CommandeAPreparer from "./CommandeAPreparer";
import { TransitionGroup } from 'react-transition-group'

export default function Commandes() {
    const largeMode = useMediaQuery('(min-width:600px)');

    const { data: products, loading: loadingProducts, error: errorProducts } = useQuery(["products"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))

    const { data: sales, loading: loadingSales, error: errorSales, refetch
    } = useQuery(["sales"], () =>
        fetch('/api/sale').then(res =>
            res.json()
        ), { refetchInterval: 5000 })


    if (loadingSales || loadingProducts) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorSales || errorProducts) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les produits et/ou les ventes</Alert></div>
    }


    const reversed_sales = sales?.sort((a, b) => a.id === b.id ? 0 : (a.id < b.id ? -1 : 1))?.map((sale) => ({
        ...sale, items: sale.items
            ?.map(item => ({
                ...item, product: products
                    ?.map(product => ({ ...product, price: parseFloat(product.price) }))
                    ?.find(it => it.id === item?.product_id)
            })
            )
    }))
        ?.map(
            (sale) => ({
                ...sale,
                needsPreparation: sale?.items?.filter((item) => item?.product?.preparation === '1').length > 0,
                donePreparation: sale?.items?.filter((item) => item?.product?.preparation === '1' && parseInt(item?.state) !== ProductStates.Servi).length === 0,
                paid: parseInt(sale.state) === CartStates.Paye
            }));

    const oldSales = reversed_sales?.filter((sale) => sale?.needsPreparation && sale?.donePreparation)

    const filteredSales = [...oldSales?.slice(oldSales.length - 2) ?? [], ...reversed_sales?.filter((sale) => sale?.needsPreparation && !sale?.donePreparation) ?? []]



    return <div className="stats-container">
        <Container fixed={largeMode}>
            <Stack spacing={1}>
                <TransitionGroup>
                    {filteredSales
                        ?.map((sale) =>
                        (<Collapse key={sale?.id}>
                            <CommandeAPreparer
                                sale={{ ...sale, state: parseInt(sale?.state), items: sale?.items?.map((product) => ({ ...product, state: parseInt(product?.state) })) }}

                                refetch={refetch}
                            /></Collapse>)
                        )}
                </TransitionGroup>
            </Stack>
        </Container>
    </div>
}