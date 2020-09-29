var QuickBooks = require('node-quickbooks');

var qbo = new QuickBooks('ABtPVQ0l7sYrSik4ipHyTbcBFnfBs7uf4wYJZOobqYu6lZfyw9',
    'HJrGZEfbEfwWSEkpMiPUIJ5j9vM747HLXUhJIjJ1',
    'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..AHo9MMaa8xJ2WHZOIAD4lA.6uhDo-Zw8Imc1ZcrXWPnwCsFMTKwhLTmDy3Cm63uJfme0gjpsMy0r2vAG-dQT6RRDtkwIlhgtkjrxO9eQE9L53KqoGDVE105miWu47lDJoIB4_UuMUET4fN2XlcVB6_QZNxOVdOhl-4nS5xyB8UkI8f59o5xGoxz4g_hCA6oqrqcG4r4LcpdVxma8phZFWc8Oo-CaZcx4Ed82JNlY5LhDAW4LXlsz9lFhQVrZUu1m55KjDXUxKFj5EQ4YXLrJgldQyCN0WhO03MEf6K1KQj04vNTTAuKc7znaOZWx1MKwIBNOGF9g123Y5lFERHD-agBTd0iJ8TtdlzsKDjg_CWowXBvb4mm36rmpwesev-pK7HpIzMfI5bsF8tXMoFBEkOg8vftZIl7h-7k5oeTaEOidY-dpik4QucJZXZeZAS0Bh_AzLMv-7EG---OCnw122YnsRwWgm5Nq1TxvKwBp2ix0G0edB5DalDfmffc8WI-n2vvIFLEyKcQT0nes0umQ5t9WEU-vVfUe6ghCh2hB5iChZ4JqTcOH8w0yAd8T_4a3UTPAxqDN75jyuIUFpSYjlMgrRDgjqbVzA1j6u2qG9aMY5T9IXLpDBhGcSAtvdbaSDrbSv6gAv7sNJXhNAhrv8fwZkCVp1qUyFfPoQBM40xoXp58AuWRavuEaaRXBNlHHaL-oUfuavtxGuOxh7pxbtyFBj8WaO5mCBJr2JF-Au_Y2LDirmXmX8sVcGYDITl5V2Y.bcZDhojhHIKWi62Wc3ie2w',
    false, // no token secret for oAuth 2.0
    '193514846508104',
    false, // use the sandbox?
    true, // enable debugging?
    null, // set minorversion, or null for the latest version
    '2.0', //oAuth version
    'AB11610094063sV9sx9xSFXWyN8emkgwMEvLXxR6mHd5lBtCKx');


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