var accounts = {};

depositAmount = function (accountId, amount) {
    accounts[accountId] += amount
    console.log('DEPOSITED ' + amount)
}
withdrawAmount = function (accountId, amount) {
    accounts[accountId] -= amount
    console.log('WITHDREW ' + amount)
}
createNewAccount = function (accountId, balance) {        
    accounts[accountId] = balance
    console.log('CREATED NEW ACCOUNT WITH ID ' + accountId)
}
doesAccountExist = function (accountId) {   
    for (var key in accounts) {        
        if (key === accountId) {
            return true
        }
    }
    return false
}

module.exports = {
    getBalance: function (accountId) {
        let response = {}
        if (doesAccountExist(accountId)) {
            response.status = 200
            response.balance = accounts[accountId].toString()
            return response
        } else {
            response.status = 404
            response.balance = '0'
            return response            
        }
    },
    processEvent: function (eventData) {
        let response = {}
        if (eventData.type === 'deposit' && doesAccountExist(eventData.destination)) {
            depositAmount(eventData.destination, eventData.amount)
            response.status = 201
            response.json = {"destination": {"id":eventData.destination, "balance": accounts[eventData.destination]}}
            return response
        } else if (eventData.type === 'deposit' && !doesAccountExist(eventData.destination)){
            createNewAccount(eventData.destination, eventData.amount)
            response.status = 201
            response.json = {"destination": {"id":eventData.destination, "balance": eventData.amount}}
            return response
        } else if (eventData.type === 'withdraw' && doesAccountExist(eventData.origin)) {
            withdrawAmount(eventData.origin, eventData.amount)
            response.status = 201
            response.json = {"origin": {"id":eventData.origin, "balance": accounts[eventData.origin]}}
            return response
        } else if (eventData.type === 'withdraw' && !doesAccountExist(eventData.origin)) {
            response.status = 404
            response.json = '0'
            return response
        } else if (eventData.type === 'transfer' && doesAccountExist(eventData.origin) && doesAccountExist(eventData.destination)) {
            withdrawAmount(eventData.origin, eventData.amount)
            depositAmount(eventData.destination, eventData.amount)
            response.status = 201
            response.json = {"origin": {"id":eventData.origin, "balance":accounts[eventData.origin]}, "destination": {"id": eventData.destination, "balance": accounts[eventData.destination]}}
            return response
        } else if (eventData.type === 'transfer' && (!doesAccountExist(eventData.origin) || !doesAccountExist(eventData.destination))) {
            response.status = 404
            response.json = '0'
            return response
        }
    },
    resetAccounts: function () {
        accounts = {}
    }
}