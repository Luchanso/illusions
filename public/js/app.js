// const id = 210700286
// const verified = true

function centeringPage() {
  const app = $('#app')
  const marginTop = window.innerHeight / 2 - app.height() / 2

  app.css('margin-top', marginTop)
}

function addEvents() {
  $('#btn-agragate').click(agragate)
}

function agragate() {
  const id = preapreId($('#enter-id').val())

  var socket = io.connect('/', {transports: ['websocket']})
  socket.emit('id', id)
}

function preapreId(str) {
  return +str
}

centeringPage()
addEvents()
