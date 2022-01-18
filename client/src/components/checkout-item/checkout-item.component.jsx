import React from "react";
import { connect } from "react-redux";
import { addItem, clearItemFromCart, removeItem } from "../../redux/cart/cart.actions";
import './checkout-item.style.scss';

const CheckoutItem = ({ cartItem, dispatch }) => {
    const { name, imageUrl, price, quantity } = cartItem
    return (
        <div className="checkout-item">
            <div className="image-container">
                <img src={imageUrl} alt="item" />
            </div>
            <span className="name">{name}</span>
            <div className="quantity">
                <div className="arrow" onClick={() => dispatch(removeItem(cartItem))}>&#10094;</div>
                <span className="value">{quantity}</span>
                <div className="arrow" onClick={() => dispatch(addItem(cartItem))}>&#10095;</div>
            </div>
            <span className="price">{price}</span>
            <span className="remove-button" onClick={() => dispatch(clearItemFromCart(cartItem))}>&#10005;</span>
        </div>
    )
}


export default connect()(CheckoutItem);