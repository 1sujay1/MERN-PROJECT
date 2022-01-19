const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression')
// const formidable = require('formidable')
require('dotenv').config();

const app = express();

// if (process.env.NODE_ENV != 'production') require('dotenv').config();

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


const PaytmChecksum = require('./PaytmChecksum')
// uuidv4();
const https = require('https');

app.post('/callback', (req, res) => {
    if (!req.body) return res.json({ status: false })
    /* import checksum generation utility */
    // console.log("req.body.CHECKSUMHASH", req.body.CHECKSUMHASH);
    let paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;
    var isVerifySignature = PaytmChecksum.verifySignature(req.body, process.env.MERCHANT_KEY, paytmChecksum);
    if (isVerifySignature) {
        console.log("Checksum Matched");

        /**
        * import checksum generation utility
        * You can get this utility from https://developer.paytm.com/docs/checksum/
        */

        /* initialize an object */
        var paytmParams = {};

        /* body parameters */
        paytmParams.body = {

            /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
            "mid": req.body.MID,

            /* Enter your order id which needs to be check status for */
            "orderId": req.body.ORDERID,
        };

        /**
        * Generate checksum by parameters we have in body
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        */
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.MERCHANT_KEY).then(function (checksum) {
            /* head parameters */
            paytmParams.head = {

                /* put generated checksum value here */
                "signature": checksum
            };

            /* prepare JSON string for request */
            var post_data = JSON.stringify(paytmParams);

            var options = {

                /* for Staging */
                hostname: 'securegw-stage.paytm.in',

                /* for Production */
                // hostname: 'securegw.paytm.in',

                port: 443,
                path: '/v3/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            // Set up the request
            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function () {
                    // console.log('Response: ', response);
                    const parsedRes = JSON.parse(response);
                    if (parsedRes.body.resultInfo.resultStatus === 'TXN_SUCCESS') {
                        // return res.json({ status: true, data: parsedRes })
                        return res.send(`<div>
                        <h1>Your payment is Successfull</h1>
                        <button onclick="window.location.replace('/')">Home</button>
                        </div>
                        `)
                    }
                    return res.send(`<div>
                    <h1>Payment Failed: ${parsedRes.body.resultInfo.resultMsg}</h1>
                    <button onclick="window.location.replace('/')">Home</button>
                    </div>
                    `)
                    // return res.json({ status: false, message: [parsedRes.body.resultInfo.resultMsg] })
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });


    } else {
        console.log("Checksum Mismatched");
        // res.json({ status: false, message: ['Something went wrong'] })
        return res.send(`<div>
                    <h1>Payment Failed</h1>
                    <button onclick="window.location.replace('/')">Home</button>
                    </div>
                    `)
    }

})
app.post('/pay', (req, res) => {
    /* import checksum generation utility */
    // var PaytmChecksum = require("./PaytmChecksum");
    const { amount, email } = req.body;
    var paytmParams = {};

    /* initialize an array */
    paytmParams["MID"] = process.env.MID;
    paytmParams["WEBSITE"] = process.env.WEBSITE;
    paytmParams["CHANNEL_ID"] = process.env.CHANNEL_ID;
    paytmParams["INDUSTRY_TYPE_ID"] = process.env.INDUSTRY_TYPE_ID;
    paytmParams["ORDER_ID"] = uuidv4();
    paytmParams["CUST_ID"] = uuidv4();
    paytmParams["TXN_AMOUNT"] = amount.toString();
    paytmParams["CALLBACK_URL"] = "http://localhost:3000/callback";
    paytmParams["EMAIL"] = email;
    paytmParams["MOBILE_NO"] = "9008539579";

    /**
    * Generate checksum by parameters we have
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, process.env.MERCHANT_KEY);
    paytmChecksum.then(function (checksum) {
        // console.log("generateSignature Returns: " + checksum);
        let totalParams = {
            ...paytmParams,
            'CHECKSUMHASH': checksum
        }
        res.json(totalParams)
    }).catch(function (error) {
        console.log(error);
    });
})


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