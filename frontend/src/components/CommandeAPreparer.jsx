import { React, useState } from 'react'
import { CartStates, CartType, Product, CartStatesLabels, ProductStatesLabels, ProductStates } from '../hooks/useCart'
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, CardHeader, Chip, IconButton } from '@mui/material'
import CreditScore from '@mui/icons-material/CreditScore';
import CreditCardOff from '@mui/icons-material/CreditCardOff';
import Check from '@mui/icons-material/Check';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import Pause from '@mui/icons-material/Pause';
import PushPin from '@mui/icons-material/PushPin';
import { arrayOf } from 'prop-types'

import './CommandeAPreparer.scss'

export const ProductStatesIcon = {
    0: <Pause />,
    1: <HourglassEmpty />,
    2: <Check />
}

export const ProductStatesColor = {
    0: "warning",
    1: "primary",
    2: "success"
}

export default function CommandeAPreparer({ sale, refetch }) {
    const [keepOpen, setOpen] = useState(false)

    const updateProductState = (sale, id, newState) => {
        const newSale = {
            ...sale, items: sale?.items?.map(item => ({ ...item, ...(item?.id === id && { state: newState }) }))
        }
        if (!newSale?.id) return;
        fetch(`/api/sale/${newSale.id}`, {
            method: 'PATCH',
            body: JSON.stringify(newSale),
            headers:
                { "Content-Type": 'application/json' }
        }).then(() => {
            refetch();
        })
    }

    const saleIcon = <>{sale?.paid ? <CreditScore /> : <CreditCardOff />}</>
    const itemIcon = (item) => {
        if (item?.product?.preparation === "1") {
            return ProductStatesIcon[item?.state]
        } else {
            return <><Check /></>
        }
    }

    const toggleProductState = (item) => () => updateProductState(sale, item.id, (item?.state + 1) % 3)

    return <Accordion variant="outlined" style={{ ...(!(sale?.paid || sale?.onTab) ? { opacity: 0.3 } : {}) }} expanded={!sale?.donePreparation || keepOpen}>
        <AccordionSummary>
            Commande {sale?.mode} {sale?.id} {saleIcon}
            {sale?.donePreparation && <IconButton size="small" onClick={() => setOpen(val => !val)}><PushPin /></IconButton>}
            {sale?.name}
        </AccordionSummary>
        <AccordionDetails>
            {sale?.items.map((item) => {
                return <Chip
                    key={item?.id}
                    variant={item?.product?.preparation === "1" && (sale?.paid || sale?.onTab) ? "" : "outlined"}
                    color={item?.product?.preparation === "1" ? ProductStatesColor[item?.state] : 'primary'}
                    label={item?.product?.label}
                    icon={itemIcon(item)}
                    clickable={(sale?.paid || sale?.onTab) && item?.product?.preparation === "1"}
                    onClick={item?.product?.preparation === "1" && (sale?.paid || sale?.onTab) ? toggleProductState(item) : () => { }}
                ></Chip>
            }
            )}
            {/* <hr />
            {JSON.stringify(sale)} */}
        </AccordionDetails>
    </Accordion >
}
CommandeAPreparer.defaultProps = { sale: undefined, products: [] }