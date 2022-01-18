import React from "react";
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

const StripeCheckoutButton = ({ price }) => {
    const priceForStripe = price * 100;
    const publishableKey = 'pk_test_51KGptrSJWXiAb9UttKlO3b7K5eh1lwlapq9hdBLQVfRGVo42JoZNgmeXyJxCXBGNCONg3Hg8XDHEzovLuqEDvXdg00JV1oDMEg'

    const onToken = token => {
        // console.log(token);

        axios({
            url: 'http://localhost:5000/payment',
            method: 'post',
            data: {
                token
            }
        }).then(res => {
            // console.log("res", res);
            alert("Payment successfull")
        }).catch(err => {
            console.log("Error", err);
            console.log("Parsed Error", JSON.parse(err));
            alert("Please make sure to use provided credit card")
        })

    }

    return (
        <StripeCheckout
            label="Pay Now"
            name="Ecomm Clothing"
            billingAddress
            shippingAddress
            image="https://www.learningsea.in/favicon.ico"
            description={`Your total is $${price}`}
            amount={priceForStripe}
            panelLabel="Pay now"
            token={onToken}
            stripeKey={publishableKey}
            allowRememberMe
        />
    )
}
export default StripeCheckoutButton;

//fake credit card for stripe
// 4242 4242 4242 4242  1/20 123