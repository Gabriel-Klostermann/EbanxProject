const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

var bankRequestsCtrl = require('./bankRequestsController');

app.get('/balance', function (req, res) {
    let responseData = bankRequestsCtrl.getBalance(req.query.account_id)
    res.status(responseData.status).send(responseData.balance)
})

app.post('/event', function (req, res) {
    let responseData = bankRequestsCtrl.processEvent(req.body)
    res.status(responseData.status).send(responseData.json)
})

app.post('/reset', function (req, res) {
    bankRequestsCtrl.resetAccounts()
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
