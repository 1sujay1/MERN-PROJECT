import React from 'react';

import './cart-icon.style.scss';

import { ReactComponent as ShoppingIcon } from './../../assets/images/shopping-bag.svg';
import { toggleCartHidden } from '../../redux/cart/cart.actions';
import { connect } from 'react-redux';
import { selectCartItemsCount } from '../../redux/cart/cart.selectors';
import { createStructuredSelector } from 'reselect';


const CartIcon = ({ toggleCartHidden, itemCount }) => {
    return (
        <div className="cart-icon" onClick={toggleCartHidden}>
            <ShoppingIcon className="shopping-icon" />
            <span className='item-count'>{itemCount}</span>
        </div>
    )
}
const mapDispatchToProps = dispatch => ({
    toggleCartHidden: () => dispatch(toggleCartHidden())
})
const mapStateToProps = createStructuredSelector({
    itemCount: selectCartItemsCount
})
export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);