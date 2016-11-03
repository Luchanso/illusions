// const id = 210700286
// const verified = true
var maxScore = 156
var score = 0

VK.init(function() {
  }, function() {
}, '5.59');

var scoreTable = {
  verified: maxScore,
  date: 100,
  city: 1,
  wall: 25,
  friends: 35,
  followers: 5,
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
  const id = preapreId($('#enter-id').val())

  score = 0

  showCounter()

  getUsers(id)
    .then(getVkData)
}

function getVkData(id) {
  getRegistrationDate(id)
  getWall(id)
  getFriends(id)
}

function getRegistrationDate(id) {
  var socket = io.connect('/', {transports: ['websocket']})
  socket.on('getRegistrationDate', userRegistrationDate)
  socket.on('getFollowers', getFollowers)
  socket.emit('getRegistrationDate', id)
}

function getFriends(id) {
  const minFriends = 200;

  VK.api('friends.get', {
    user_id: id,
    count: 1,
    fields: 'city'
  }, (data) => {
    console.log(data)
    data = data.response

    let ratio = (data.count / minFriends)

    score += ratio > 1 ? scoreTable.friends : ratio * scoreTable.friends
    updateScore()
  })
}

function getWall(id) {
  const wallPostMinCount = 50

  VK.api('wall.get', {
    owner_id: id,
    count: 1
  }, (data) => {
    console.log(data)
    data = data.response

    let ratio = data.count / wallPostMinCount
    score += ratio > 1 ? scoreTable.wall : ratio * scoreTable.wall

    updateScore()
  })
}

function getUsers(id) {
  return new Promise((res, rej) => {
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

      res(data.id)
    })
  })
}

function getFollowers(followers) {
  const minFollowers = 15

  let ratio = (followers / minFriends)

  score += ratio > 1 ? scoreTable.followers : ratio * scoreTable.followers
  updateScore()
}

function userRegistrationDate(date) {
  const min = Date.now() - (new Date("2006-09-23T20:26:12+03:00")).getTime()

  let timespan = Date.now() - new Date(date).getTime()

  score += scoreTable.date * (timespan / min)

  updateScore()
}

function preapreId(str) {
  if (str.indexOf('//vk.com/') !== -1) {
    str = str.split('//vk.com/')[1]
  } else {
    str = +str
  }

  if (Number.isNaN(str) && str === '') {
    return Materialize.toast('Некоректнная строка', 4000, 'red')
  } else if (str === 0) {
    return Materialize.toast('Пустая строка :c', 4000, 'red')
  }

  return str
}

function showCounter() {
  $('.counter').css('opacity', '1')
}

function updateScore() {
  let percent = Math.round((1 - score/maxScore) * 100)
  percent = percent < 0 ? 0 : percent

  $('calculate').text(percent + '%')
}

centeringPage()
addEvents()
