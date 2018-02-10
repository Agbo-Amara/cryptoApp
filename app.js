// Load in the https module
const https = require('https');

// Load in the yargs module
const argv = require('yargs').argv;

// Load in the colors-cli module
const color = require('colors-cli/safe');

// Accept arguments from yargs or use the default values
const cryptoSymbols = argv.cryptoSymbols || 'BTC,ETH,XRP,LTC';
const currencies = argv.currencies || 'USD,EUR,GBP,NGN';

// Set the options object
const options = {
    host: 'min-api.cryptocompare.com',
    path: `/data/pricemulti?fsyms=${ cryptoSymbols }&tsyms=${ currencies }`
};

// Set color for error messages
const errorColor = color.red.bold;

// Set color for the welcome message and cryptoSymbols
const appColor = color.yellow.bold;

// Set color for our fancy line
const lineColor = color.cyan;

console.log(appColor('Welcome to the cryptoApp !!! \n'));

// Make the GET request to the API
https.get(options, (res) => {
    let body = '';

    // set the encoding of the response object to utf-8
    res.setEncoding('utf8');

    res.on('data', (data) => {
        body += data;
    });
    res.on('end', () => {
        try {
            // Convert the response to JSON
            const output = JSON.parse(body);

            // Convert crytoSymbols from a string to an array
            const symbols = cryptoSymbols.split(',');

            console.log('Current cryptocurrency exchange rates\n');

            // Return error message if there is an error with the crytocurrencies or currencies
            if (output.Message) return console.log(errorColor(`${output.Response}:${output.Message}`));
            
            // Print each cryptocurrencies exchange value from the output
            symbols.map(symbol => {
                    console.log(appColor(`${symbol}`));
                    console.log(output[`${ symbol }`]);
                    console.log(lineColor('***************************************************************'));    
            });
        }
        catch(err) {
            console.log(errorColor(`Error parsing JSON from CoinAPI:${err}`));
        }
    });
}).on('error', (err) => {
    console.log(errorColor(`Request failed, ${err.message}`));
});