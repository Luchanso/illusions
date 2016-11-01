// const id = 210700286
// const verified = true
var score = 0

function centeringPage() {
  const app = $('#centering-anchor')
  const marginTop = window.innerHeight / 2 - app.height()

  app.css('margin-top', marginTop)
}

function addEvents() {
  $('#btn-agragate').click(agragate)
}

function agragate() {
  showCounter()
  const id = preapreId($('#enter-id').val())

  var socket = io.connect('/', {transports: ['websocket']})
  socket.emit('getRegistrationDate', id)
  socket.on('getRegistrationDate', userRegistrationDate)
}

function getVkData(id) {
  VK.api('users.get', {
    user_ids: [id],
    fields: 'city,verified'
  }, (data) => {

  })
}

function userRegistrationDate(date) {
  const min = Date.now() - (new Date("2006-09-23T20:26:12+03:00")).getTime()

  let timespan = Date.now() - new Date(date).getTime()

  score += 100 * (timespan / min)
}

function preapreId(str) {
  return +str
}

function showCounter() {
  $('.counter').css('visibility', 'inherit')
}

centeringPage()
addEvents()
