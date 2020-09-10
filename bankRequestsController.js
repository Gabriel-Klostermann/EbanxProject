var accounts = {};

//TODO: REMOVE FUNCTIONS FROM MODULE.EXPORTS THAT ARE NOT ACCESSED FROM EXTERNAL SOURCES

module.exports = {
    depositAmount: function (accountId, balance) {
        accounts[accountId] += balance
        console.log('DEPOSITED ' + balance)
    },
    createNewAccount: function (accountId, balance) {        
        accounts[accountId] = balance
        console.log('CREATED NEW ACCOUNT WITH ID ' + accountId)
    },
    doesAccountExist: function (accountId) {   
        for (var key in accounts) {
            console.log('KEY' + key)
            if (key === accountId) {
                return true
            }
        }
        return false
    },
    getBalance: function (accountId) {
        let response = {}
        if (module.exports.doesAccountExist(accountId)) {
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
        if (eventData.type === 'deposit' && module.exports.doesAccountExist(eventData.destination)) {
            module.exports.depositAmount(eventData.destination, eventData.amount)
            response.status = 201
            response.json = {"destination": {"id":eventData.destination, "balance": accounts[eventData.destination].toString()}}
            return response
        } else if (eventData.type === 'deposit' && !module.exports.doesAccountExist(eventData.destination)){
            module.exports.createNewAccount(eventData.destination, eventData.amount)
            response.status = 201
            response.json = {"destination": {"id":eventData.destination, "balance": eventData.amount}}
            return response
        }
    }
}