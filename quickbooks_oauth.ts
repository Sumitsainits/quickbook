'use strict'

const express = require('express');
const cors = require('cors');
const OAuthClient = require('intuit-oauth');
const bodyParser = require('body-parser');
const fs = require('fs');
const QuickBooks = require('node-quickbooks');
//var buffer = require('buffer/').Buffer;
// var request = require("request");


const PORT = 5000;

var app = express()
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.json({
    type: ['application/json', 'text/plain']
}));

var oauthClient = null;
var callbackParams = null;
var qbo = null;

const readFile = (req, response) => {
    fs.readFile('./index.html', (err, html) => {
        if (err) console.log(err);
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    })
};

app.get('/', (req, response) => {
    readFile(req, response);
})

app.post('/authClient', (req, res) => {
    oauthClient = new OAuthClient({
        clientId: req.body.ClientId,
        clientSecret: req.body.ClientSecret,
        environment: 'sandbox',
        redirectUri: req.body.CallbackURI
    });

    var authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: 'testState'
    });

    res.send({ authUri });
})


app.get('/callback/', (req, res) => {
    callbackParams = req.query;
    oauthClient.createToken(req.url)
        .then(function (authResponse) {
            const tokenList = authResponse.getJson();
            qbo = new QuickBooks(oauthClient.clientId,
                oauthClient.clientSecret,
                tokenList.access_token, /* oAuth access token */
                false, /* no token secret for oAuth 2.0 */
                req.query.realmId,
                true, /* use a sandbox account */
                true, /* turn debugging on */
                null, /* minor version */
                '2.0', /* oauth version */
                tokenList.refresh_token /* refresh token */);
        })
        .catch(function (e) {
            console.error("The error message is :" + e.originalMessage);
            console.error(e.intuit_tid);
        });
});


app.get('/refreshToken', (req, res) => {
    console.log(oauthClient.token.getToken().refresh_token);

    oauthClient
        .refreshUsingToken(oauthClient.token.getToken().refresh_token) //check for oauthClient to be not null
        .then(function (authResponse) {
            console.log('Tokens refreshed : ' + JSON.stringify(authResponse.getJson()));
        })
        .catch(function (e) {
            console.error('The error message is :' + e.originalMessage);
            console.error(e.intuit_tid);
        });

});

// the bleow block is used to disconnecting app from quickbooks
// although it is revoking the connection(have to connect app again with quickbooks) but always returning error in promise

app.get('/revokeToken', (req, res) => {
    oauthClient.revoke({ token: oauthClient.token.getToken().access_token })  //check for oauthClient to be not null
        .then(function (authResponse) {
            console.log('Tokens revoked : ' + JSON.stringify(authResponse.json()));
        })
        .catch(function (e) {
            console.error("The error message is :" + e.originalMessage);
            console.error(e.intuit_tid);
        });
});

// quickbooks integration steps




// accounts

// app.get('/getAccounts', (req, res) => {
//     qbo.findAccounts({
//         AccountType: req.query.type, // Banking,Expenses,sales,
//         desc: 'MetaData.LastUpdatedTime',
//         limit: 5,
//         offset: 5
//     }, function (err, accounts) {
//         if (err) console.log(err)
//         var arr = [];
//         console.log
//         accounts.QueryResponse.Account.forEach(function (account) {
//             console.log(account.Name)
//             arr = [...arr, account]
//         })

//         res.send({ data: arr })
//     })
// });

app.get('/getAccounts', (req, res) => {
    qbo.findAccounts({ fetchAll: true },
        function (e, allaccounts) {
            console.log(allaccounts);
            res.send(allaccounts)
        })
})

// bills

app.post('/createBill', (req, res) => {
    qbo.createBill(req.body, callback => {
        console.log(callback);
    })
})

app.get('/getBills', (req, res) => {
    qbo.findBills({ fetchAll: true },
        function (e, allbills) {
            console.log(allbills);
            res.send(allbills)
        })
})

// vendors

app.get('/getVendorbyid', (req, res) => {
    qbo.getVendor(req.query.id, callback => {
        console.log(callback);
    })
})


app.get('/allVendors', (req, res) => {
    qbo.findVendors({ fetchAll: true },
        function (e, allVendors) {
            console.log(allVendors)
            res.send(allVendors)
        })
})

// customers

app.get('/allCustomers', (req, res) => {
    qbo.findCustomers({
        fetchAll: true
    }, function (e, customers) {
        console.log(customers)
        res.send(customers)
    })
});

// payment 

app.get('/allPayments', (req, res) => {
    qbo.findCustomers({
        fetchAll: true
    }, function (e, payments) {
        console.log(payments)
        res.send(payments)
    })
});

// product

app.get('/allProducts', (req, res) => {
    qbo.findCustomers({
        fetchAll: true
    }, function (e, products) {
        console.log(products)
        res.send(products)
    })
});

//  invoice

app.get('/allInvoice', (req, res) => {
    qbo.findCustomers({
        fetchAll: true
    }, function (e, invoice) {
        console.log(invoice);
        res.send(invoice)
    })
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})