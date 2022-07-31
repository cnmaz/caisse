export const formatCurrency = (val) => {
    if (val === undefined) { return val; }
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
}