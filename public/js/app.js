// const id = 210700286
// const verified = true
var maxScore = 101
var score = 0

var scoreTable = {
  verified: maxScore,
  date: 100,
  city: 1,
}

function centeringPage() {
  const app = $('#centering-anchor')
  const marginTop = window.innerHeight / 2 - app.height()

  app.css('margin-top', marginTop)
}

function addEvents() {
  $('#btn-agragate').click(agragate)
}

function agragate() {
  score = 0

  showCounter()

  const id = preapreId($('#enter-id').val())

  var socket = io.connect('/', {transports: ['websocket']})
  socket.emit('getRegistrationDate', id)
  socket.on('getRegistrationDate', userRegistrationDate)

  getVkData(id)
}

function getVkData(id) {
  VK.api('users.get', {
    user_ids: [id],
    fields: 'city,verified'
  }, (data) => {
    data = data.response[0]

    if (data.city) {
      score += scoreTable.city
    }
    if (data.verified) {
      score += scoreTable.verified
    }

    updateScore()
  })
}

function userRegistrationDate(date) {
  const min = Date.now() - (new Date("2006-09-23T20:26:12+03:00")).getTime()

  let timespan = Date.now() - new Date(date).getTime()

  score += scoreTable.date * (timespan / min)

  updateScore()
}

function preapreId(str) {
  return +str
}

function showCounter() {
  $('.counter').css('opacity', '1')
}

function updateScore() {
  $('calculate').text(Math.round((1 - score/maxScore) * 100) + '%')
}

centeringPage()
addEvents()
