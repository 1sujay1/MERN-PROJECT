const express = require('express');
const cors = require('cors');
const path = require('path');
// const { v4: uuidv4 } = require('uuid');
const compression = require('compression')

const app = express();

if (process.env.NODE_ENV != 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const port = process.env.PORT || 5000;

app.use(compression())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// console.log("__dirname", path.resolve(__dirname, 'client/build', 'index.html'));

if (process.env.NODE_ENV === 'production') {
    // console.log("Its production now");
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

    const { token, price } = req.body;
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
                payment_method_types: ['card'],
                amount: price,    // Charing Rs 25 
                // description: customer.id,
                currency: 'inr',
                customer: customer.id,
                payment_method: token.card.id,
                confirmation_method: 'automatic',
                confirm: true
            });
        })
        .then(async (charge) => {
            // console.log("charge1", charge);
            const paymentIntent = await stripe.paymentIntents.confirm(
                charge.id,
                { return_url: 'https://ecom-expert.herokuapp.com/' }
            );
            res.json({ "status": true, paymentIntent }) // If no error occurs 
            // console.log("paymentIntent", paymentIntent);
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        });
})
app.listen(port, error => {
    if (error) throw error;
    console.log('Server running on port' + port)
})

/**
 * card: {id: 'card_1KJN7GSJWXiAb9UtjQmHwIet', object: 'card', address_city: 'Bangalore', address_country: 'India', address_line1: 'Bangalore', …}
client_ip: "27.59.96.250"
created: 1642533194
email: "testfasd@example11.com"
id: "tok_1KJN7GSJWXiAb9UtMUYyTk7c"
livemode: false
object: "token"
type: "card"
used: false
 */