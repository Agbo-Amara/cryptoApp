// Load in the http module
const https = require('https');
const argv = require('yargs').argv;
const color = require('colors-cli/safe');

const cryptoSymbol = argv.cryptoSymbol || 'BTC,ETH,XRP,LTC';
const currency = argv.currency || 'USD,EUR,GBP,NGN';
const options = {
    host: 'min-api.cryptocompare.com',
    path: `/data/pricemulti?fsyms=${ cryptoSymbol }&tsyms=${ currency }`
};
const errorColor = color.red.bold;
const appColor = color.yellow.bold;
const starColor = color.cyan;

console.log('Welcome to the cryptoApp !!! \n');

https.get(options, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (data) => {
        body += data;
    });
    res.on('end', () => {
        try {
            const rate = JSON.parse(body);
            //console.log(rate);
            const symbols = cryptoSymbol.split(',');
            console.log('Current cryptocurrency exchange rates\n');
            if (rate.Message) return console.log(errorColor(`${rate.Response}:${rate.Message}`));
            symbols.map(symbol => {
                    console.log(appColor(`${symbol}`));
                    console.log(rate[`${ symbol }`]);
                    console.log(starColor('***************************************************************'));    
            });
        }
        catch(err) {
            console.log(errorColor(`Error parsing JSON from CoinAPI:${err}`));
        }
    });
}).on('error', (err) => {
    console.log(errorColor(`Request failed, ${err.message}`));
});