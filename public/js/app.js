var socket = io.connect('/', {transports: ['websocket']});

const id = 210700286
const verified = true

socket.emit('id', id)
