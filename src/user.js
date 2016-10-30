const request = require('request')
const parser = require('xml-parser')

class User {
  constructor(id) {
    this.id = id
    this.data = {}
    this.followers = 0
    this.friends = 0
    this.registration = (new Date()).toString()
  }

  getRowData() {
    let self = this

    return new Promise((resolve, reject) => {
      request(`http://vk.com/foaf.php?id=${this.id}`, (err, res, body) => {
        if (err) reject(err)

        self.data = parser(body).root.children[0].children
        resolve(self.data)
      })
    })
  }

  parseData() {
    for (let row of this.data) {
      if (row.name === 'ya:created') {
        this.registration = row.attributes['dc:date']
      } else if (row.name === 'ya:subscribersCount') {
        this.followers = row.content * 1
      } else if (row.name === 'ya:friendsCount') {
        this.friends = row.content * 1
      }
    }
  }
}

module.exports = User
