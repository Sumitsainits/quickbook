

// var options = {
//     method: 'POST',
//     url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer?grant_type=authorization_code&code=AB11600166971FdxNCV4lPWKwp9aZ6undqWp5BjrpbiI2GJ6HJ&redirect_uri=http://localhost:5000/callback',
    
//     headers:
//     {
//         "Authorization": 'Basic QUJ0UFZRMGw3c1lyU2lrNGlwSHlUYmNCRm5mQnM3dWY0d1lKWk9vYnFZdTZsWmZ5dzk6SEpyR1pFZmJFZndXU0VrcE1pUFVJSjVqOXZNNzQ3SExYVWhKSWpKMQ==',
//         'Accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'
//     }
// }

// request(options, function (error, response, body) {
//     if (error) throw new Error(error);
//     console.log(response);
//     console.log(body);
// });

// Create token
// var auth = (new Buffer('ABtPVQ0l7sYrSik4ipHyTbcBFnfBs7uf4wYJZOobqYu6lZfyw9:HJrGZEfbEfwWSEkpMiPUIJ5j9vM747HLXUhJIjJ1').toString('base64'));

// var postBody = {
//   url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/x-www-form-urlencoded',
//     Authorization: 'Basic ' + auth,
//   },
//   form: {
//     grant_type: 'authorization_code',
//     code: 'AB11600175604hU4r4teO16kG7gJoObPBPO5KtUSogDpUoRN6p',
//     redirect_uri: 'https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl'  //Make sure this path matches entry in application dashboard
//   }
// };

// request.post(postBody, function (e, r, data) {
//   var accessToken = JSON.parse(r.body);
//   console.log(accessToken);
// })



// console.log(buffer.from("ABtPVQ0l7sYrSik4ipHyTbcBFnfBs7uf4wYJZOobqYu6lZfyw9:HJrGZEfbEfwWSEkpMiPUIJ5j9vM747HLXUhJIjJ1").toString('base64'));