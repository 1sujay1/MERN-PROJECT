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

    // useEffect(() => {
    //     fetch('http://localhost:5000/test')
    // }, [])
    function isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    function isObj(val) {
        return typeof val === 'object'
    }

    function stringifyValue(val) {
        if (isObj(val) && !isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    function buildForm({ action, params }) {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    function post(details) {
        const form = buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    const getData = (data) => {
        return fetch('/pay', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .catch(err => console.log(err))
    }

    const makePayment = () => {
        getData({ amount: total.toString(), email: "master@gmail.com" })
            .then(res => {
                var information = {
                    action: 'https://securegw-stage.paytm.in/order/process',
                    params: res
                }
                // console.log("res", res);
                post(information);
            })

    }
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
            <div className="paytm">
                <CustomButton onClick={makePayment}>PAY USING PAYTM</CustomButton>
            </div>

        </div>
    )
}
const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems,
    total: selectCartTotal
})
export default withRouter(connect(mapStateToProps)(Checkout));