const express = require('express')
const app = express();
const port = process.env.VIRTUAL_PORT || 3000;

// app.get('/', (req, res) => res.send('Hello Pixelkiller World!'))

app.use(express.static('html'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))