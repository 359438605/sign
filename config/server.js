const express = require('express');
const app = express();

app.use(express.static('./src'));

const server = app.listen('12001', () => {
    const port = server.address().port;

    console.log(`CanvasSignature app listening at http://localhost:${port}`);
});

const appProd = express();
appProd.use(express.static('./dist'));
const serverProd = appProd.listen('12002');
