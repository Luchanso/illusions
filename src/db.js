

process.env.DATABASE_URL = 'postgres://postgres:qwerty@localhost:5432/test'


pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) return error(err)
  console.log('Connected to postgres! Getting schemas...')
})

function error(err) {
  console.error(err)
}
