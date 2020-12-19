const eventNames = ['error', 'txStatus']
const callbacks  =  {
        'error': [],
        'txStatus': []
    }
const service = {
    subscribe: (eventName, callback) => {
        if (!eventNames.includes( eventName )) throw new Error ('Flow Data Service: trying to subscribe to unknown event type')
        if (!callbacks[eventName]) callbacks[eventName] = []
        callbacks[eventName].push(callback)
    },
    fireEvent: (eventName, params) => {
        if (!eventNames.includes( eventName )) throw new Error ('Flow Data Service: trying to fire an unknown event type')
        callbacks[eventName].forEach(callback => callback(...params))
    }  
}

export default service