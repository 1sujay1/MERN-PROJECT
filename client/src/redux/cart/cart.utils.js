export const addItemToCart = (cartItems, cartItemToAdd) => {
    const findExists = cartItems.find(item => item.id === cartItemToAdd.id);
    if (findExists) {
        return cartItems.map(item => (
            item.id === cartItemToAdd.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    }
    return [...cartItems, { ...cartItemToAdd, quantity: 1 }]
}

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
    const findItem = cartItems.find(item => item.id === cartItemToRemove.id);

    return (findItem.quantity === 1)
        ? cartItems.filter(item => item.id !== cartItemToRemove.id)
        : cartItems.map(item => {
            return item.id === cartItemToRemove.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
        })

}
export const clearItemFromCart = (cartItems, cartItemToClear) => cartItems.filter(item => item.id !== cartItemToClear.id)