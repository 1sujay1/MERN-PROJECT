const express = require('express');
const cors = require('cors');
const path = require('path');
// const { v4: uuidv4 } = require('uuid');

const app = express();

if (process.env.NODE_ENV != 'production') require('dotenv').config();

const stripe = require('stripe')('sk_test_51KGptrSJWXiAb9UtQmppq82tMBvW7KaGuvSRdldtX34kV0y6U44RNPmVFL052jJQba0gophD1G8OqRBEXQBTcWm000jsDIKsRF')

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
}

// app.get('/', (req, res) => {
//     res.send("Hello")
// })
const YOUR_DOMAIN = process.env.YOUR_DOMAIN;

app.post('/payment', function (req, res) {

    const { token } = req.body;
    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
        email: token.email,
        source: token.id,
        name: token.card.name,
        address: {
            line1: 'Bannerughatta Bangalore Karnataka',
            postal_code: '560083',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
        }
    })
        .then((customer) => {
            return stripe.paymentIntents.create({
                amount: 7000,    // Charing Rs 25 
                description: 'Web Development Product',
                currency: 'usd',
                customer: customer.id,
                payment_method_types: ['card'],
            });
        })
        .then((charge) => {
            res.send("Success") // If no error occurs 
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        });
})
app.listen(port, error => {
    if (error) throw error;
    console.log('Server running on port' + port)
})