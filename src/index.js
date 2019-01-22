const express = require('express')
const app = express();
var path = require('path');
var public = path.join(__dirname, 'html');
const port = process.env.VIRTUAL_PORT || 3000;

// app.get('/', (req, res) => res.send('Hello Pixelkiller World!'))

app.use(express.static(public))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))