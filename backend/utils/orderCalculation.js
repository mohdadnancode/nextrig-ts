export const calculateOrderAmounts = (items, paymentMethod) => {
    const COD_FEE = 15;
    const SHIPPING_THRESHOLD = 5000;
    const SHIPPING_FEE = 199;

    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const shippingCharge = itemsTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    const codFee = paymentMethod === "cod" ? COD_FEE : 0;

    const totalAmount = itemsTotal + shippingCharge + codFee;

    return {
        itemsTotal,
        shippingCharge,
        codFee,
        totalAmount,
    };
};