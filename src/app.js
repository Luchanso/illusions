const User = require('./user')

const pg = require('pg')
const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server) // , { wsEngine: 'uws' }

app.set('port', process.env.PORT || 8080)

app.use(express.static(__dirname + '/../public'))

io.on('connection', (socket) => {
  let user

  // socket.on('id', newId)
})

// Not work with id59967447
function newId(id) {
  user = new User(id)
  user.getRowData()
    .then(() => {
      user.parseData()
    })
    .then(() => {
      console.log(user.followers, user.friends, user.registration)
    })
    .catch(err => {
      console.error(err)
    })
}

server.listen(app.get('port'), function () {
  console.log(`Example app listening on port ${app.get('port')}!`)
})


newId(1)
