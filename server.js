const express = require('express')
const app = express()
app.use(express.json());

app.post('/', function(req, res) {
    console.log(req.body)
    const data = {
        info: "CRETA 2022",
        bno: req.body.bodyno,
        vin: Math.floor(100000 + Math.random() * 900000)
    }
    res.send({ info: data })
})

app.listen(3000, () => {
    console.log('LISTENING AT PORT 3000')
})