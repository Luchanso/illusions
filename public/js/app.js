// const id = 210700286
// const verified = true
let maxScore = 180
let score = 0

let firstDate = new Date("2006-09-23T20:26:12+03:00")

VK.init(function() {
  }, function() {
}, '5.59');

var scoreTable = {
  verified: maxScore,
  date: 100,
  city: 1,
  wall: 25,
  friends: 35,
  followers: 4,
  firstPhoto: 25,
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
  hideCounter()
  const id = preapreId($('#enter-id').val())

  if (!id) return

  getUser(id)
    .then(id => {
      showCounter()
      score = 0

      getVkData(id)
    })
    .catch(err => {
      Materialize.toast('Пользователь не найден 😟', 4000, 'red')
    })
}

function getVkData(id) {
  getRegistrationDate(id)
  getWall(id)
  getFriends(id)
  getFirstPhotoDate(id)
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
    data = data.response

    let ratio = data.count / wallPostMinCount
    score += ratio > 1 ? scoreTable.wall : ratio * scoreTable.wall

    updateScore()
  })
}

function getUser(id) {
  return new Promise((res, rej) => {
    VK.api('users.get', {
      user_ids: [id],
      fields: 'city,verified'
    }, (data) => {
      if (data.response) {
        data = data.response[0]
      } else {
        rej()
      }

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
  const minFollowers = 25

  let ratio = (followers / minFollowers)

  score += ratio > 1 ? scoreTable.followers : ratio * scoreTable.followers
  updateScore()
}

function getFirstPhotoDate(id) {
  let result = []

  getPhoto('wall', id)
    .then(date => {
      result.push(date)
      return getPhoto('saved', id)
    })
    .then(date => {
      result.push(date)
      return getPhoto('profile', id)
    })
    .then(date => {
      result.push(date)

      result.sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0
      })

      return result[0]
    })
    .then(date => {
      date *= 1000

      const min = Date.now() - (firstDate).getTime()
      const timespan = Date.now() - new Date(date).getTime()

      score += scoreTable.firstPhoto * (timespan / min)
      updateScore()
    })
}

function getPhoto(type, id) {
  return new Promise((res, rej) => {
    VK.api('photos.get', {
      owner_id: id,
      album_id: type,
      rev: 0,
      count: 1
    }, (data) => {
      res(data.response.items[0].date)
    })
  })
}

function userRegistrationDate(date) {
  const min = Date.now() - (firstDate).getTime()
  const timespan = Date.now() - new Date(date).getTime()

  score += scoreTable.date * (timespan / min)
  updateScore()
}

function preapreId(str) {
  if (str.indexOf('//vk.com/') !== -1) {
    str = str.split('//vk.com/')[1]
  } else {
    str = +str
  }

  if (Number.isNaN(str) || str === '') {
    Materialize.toast('Некоректнная строка', 4000, 'red')
    return null
  } else if (str === 0) {
    Materialize.toast('Пустая строка :c', 4000, 'red')
    return null
  }

  return str
}

function showCounter() {
  $('.counter').css('opacity', '1')
}

function hideCounter() {
  $('.counter').css('opacity', '0')
}

function updateScore() {
  let percent = Math.round((1 - score/maxScore) * 100)
  percent = percent < 0 ? 0 : percent

  $('calculate').text(percent + '%')
}

centeringPage()
addEvents()
