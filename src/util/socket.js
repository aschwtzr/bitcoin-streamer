import moment from 'moment';

export var websocket

export function initSocket (receiverCallback) { 
  websocket = new WebSocket('wss://ws.blockchain.info/inv');

  websocket.onopen = function() { 
    console.debug('open');
    start()
  };
    
   websocket.onerror = function(event) { 
    console.debug('error');
  };

  websocket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.op === 'utx'){
      const txHash = data.x.hash;
      const txOutputs = data.x.out;
      const txTotalOutputValue = txOutputs.reduce((prev, curr) => {
        if (!curr.spent) {
          return prev + curr.value
        } else return prev
      }, 0)
      const bitcoinValue = txTotalOutputValue / 100000000;
      const timestamp = moment.unix(data.x.time).format('MMM DD YYYY, HH:mm:ss')
      // console.log(bitcoinValue)
      receiverCallback({ id:txHash, value: bitcoinValue, timestamp });

    } else {
      console.debug('NON UTX DATA', data)
    }
  };                       
};

export function start() {
  websocket.send('{"op": "unconfirmed_sub"}');
}

export function stop() {
  websocket.send('{"op": "unconfirmed_unsub"}');
}

export function ping() {
  websocket.send('{"op": "ping"}');
}
