'use strict'

const express = require('express');
const cors = require('cors');
const OAuthClient = require('intuit-oauth');
const bodyParser = require('body-parser');
const fs = require('fs');
const QuickBooks = require('node-quickbooks');

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
var account, bill, vendor, customer, invoice, payment, product;

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
        scope: [OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId],
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

                qbo.createBill({
                    "Line": [
                      {
                        "DetailType": "AccountBasedExpenseLineDetail", 
                        "Amount": 200.0, 
                        "Id": "1", 
                        "AccountBasedExpenseLineDetail": {
                          "AccountRef": {
                            "value": "7"
                          }
                        }
                      }
                    ], 
                    "VendorRef": {
                      "value": "56"
                    }
                  }, function(err,bill){
                      if(err){
                        console.log(err)
                        return
                      } 
                      console.log(bill)
                  })
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

// the below block is used to disconnecting app from quickbooks
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

app.get('/getAccounts', (req, res) => {
    qbo.findAccounts({ fetchAll: true },
        function (e, allaccounts) {
            console.log(allaccounts);
            account = allaccounts.QueryResponse.Account;
            if (req.query.id) {
                let temp = account.filter(arr => {
                    return arr.Id == req.query.id //77
                })
                temp.length == 0 ? res.send({ error: "Account with id not found" }) : res.send({ data: temp });
                return
            }
            res.send(account)
        })
})

// bills



app.get('/getBills', (req, res) => {
    qbo.findBills({ fetchAll: true },
        function (e, allbills) {
            console.log(allbills);
            bill = allbills.QueryResponse.Bill;
            if (req.query.id) {
                let temp = bill.filter(arr => {
                    return arr.Id == req.query.id //77
                })
                temp.length == 0 ? res.send({ error: "Bill with id not found" }) : res.send({ data: temp });
                return
            }
            res.send(bill)
        })
})

// vendors

// qbo.createVendor(object, callback)

app.get('/allVendors', (req, res) => {
    qbo.findVendors({ fetchAll: true },
        function (e, allVendors) {
            console.log(allVendors)
            vendor = allVendors.QueryResponse.Vendor;
            if (req.query.id) {
                let temp = vendor.filter(arr => {
                    return arr.Id == req.query.id //77
                })
                temp.length == 0 ? res.send({ error: "Vendor with id not found" }) : res.send({ data: temp });
                return
            }
            res.send(vendor)
        })
})

// customers

// qbo.createCustomer(object, callback);

// qbo.updateCustomer(object, callback)

app.get('/allCustomers', (req, res) => {
    qbo.findCustomers({
        fetchAll: true
    }, function (e, allCustomers) {
        console.log(allCustomers)
        customer = allCustomers.QueryResponse.Customer;
        if (req.query.id) {
            let temp = customer.filter(arr => {
                return arr.Id == req.query.id //77
            })
            temp.length == 0 ? res.send({ error: "Customer with id not found" }) : res.send({ data: temp });
            return
        }
        res.send(customer)
    })
});

// payment 

// qbo.createPayment(object, callback)

app.get('/allPayments', (req, res) => {
    qbo.findPayments({
        fetchAll: true
    }, function (e, allPayments) {
        console.log(allPayments);
        payment = allPayments.QueryResponse.Payment;
        if (req.query.id) {
            let temp = payment.filter(arr => {
                return arr.Id == req.query.id //77
            })
            temp.length == 0 ? res.send({ error: "Payment with id not found" }) : res.send({ data: temp });
            return
        }
        res.send(payment)
    })
});

// product couldn't found any method releated to products but instead found item instead

// app.get('/allProducts', (req, res) => {
//     qbo.findItems({
//         fetchAll: true
//     }, function (e, allProducts) {
//         console.log(allProducts);
//         product = allProducts.QueryResponse.Item;
//         if (req.query.id) {
//             let temp = product.filter(arr => {
//                 return arr.Id == req.query.id //77
//             })
//             temp.length == 0 ? res.send({ error: "Product with id not found" }) : res.send({ data: temp });
//             return
//         }
//         res.send(product)
//     })
// });

//  invoice

// qbo.createInvoice(object, callback)
// qbo.sendInvoicePdf(id, sendTo, callback);   sendTo - (optinal otherwise it will be sent to email)

app.get('/allInvoice', (req, res) => {
    qbo.findInvoices({
        fetchAll: true
    }, function (e, allInvoice) {
        console.log(allInvoice);
        invoice = allInvoice.QueryResponse.Invoice;
        if (req.query.id) {
            let temp = invoice.filter(arr => {
                return arr.Id == req.query.id //77
            })
            temp.length == 0 ? res.send({ error: "Invoice with id not found" }) : res.send({ data: temp });
            return
        }
        res.send(invoice)
    })
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})