import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import CheckoutItem from "../../components/checkout-item/checkout-item.component";
import StripeCheckoutButton from "../../components/stripe-button/stripe-button.component";
import { selectCartItems, selectCartTotal } from "../../redux/cart/cart.selectors";
import CustomButton from '../../components/custom-button/custom-button.component'
import './checkout.style.scss';
import { withRouter } from "../../utils/router.params";

const Checkout = ({ cartItems, total, navigate }) => {
    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <div className="header-block">
                    <span>Product</span>
                </div>
                <div className="header-block">
                    <span>Description</span>
                </div>
                <div className="header-block">
                    <span>Quatity</span>
                </div>
                <div className="header-block">
                    <span>Price</span>
                </div>
                <div className="header-block">
                    <span>Remove</span>
                </div>
            </div>
            {
                cartItems.map(item => <CheckoutItem key={item.id} cartItem={item} />)
            }
            <div className="total">
                <span>TOTAL ${total}</span>
            </div>
            <div className="test-warning">
                *Please use the following credit card for test payments
                <br />
                4242 4242 4242 4242 - Exp: 01/20 - CVV: 123
            </div>
            {
                total
                    ? <StripeCheckoutButton price={total} />
                    : <CustomButton onClick={() => navigate('/shop')} >Go to shop</CustomButton>

            }

        </div>
    )
}
const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems,
    total: selectCartTotal
})
export default withRouter(connect(mapStateToProps)(Checkout));