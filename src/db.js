process.env.DATABASE_URL = 'postgres://postgres:qwerty@localhost:5432/test'


const insert =
`
  INSERT INTO public.users (
    id, first_name, last_name, city, friends_count, followers_count, date_first_photo, count_posts, verified
  )
  VALUES (
    $1::bigint, $2::text, $3::text, $4::text, $5::bigint, $6::bigint, $7::date, $8::bigint, $9::boolean
  );
`

pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) return error(err)
  console.log('Connected to postgres! Getting schemas...')

  client.query(insert, [
    Math.round(Math.random() * 1000),
      '\"\'123',
      'asdf',
      'Piter',
      1,
      0,
      '2016-01-01',
      1,
      true
    ])
    .then(console.log)
    .then(res => {
      return client.query('SELECT * FROM users')
    })
    .then((res) => {
      console.log(res.rows)
    })
    .catch(error)
})

function error(err) {
  console.error(err)
}
