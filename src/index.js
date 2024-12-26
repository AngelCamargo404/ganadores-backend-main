const mongoose = require('mongoose')
const server = require('./server/server.js')
const config = require('./config/config.js')

mongoose.connect(config.db, {
  ssl: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
 .then((response) => {
    console.log('Conectado a la base de datos.')
    server.listen(config.port, () => {
      console.log(`API REST corriendo en ${config.port}`)
    })
 })
  .catch((err) => {
   console.log(`Error al conectar a la base de datos: ${err}`)
 });