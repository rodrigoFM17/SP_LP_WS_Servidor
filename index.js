const express = require('express')
require('dotenv').config()

const PORT = process.env.PORT

const app = express()

app.use(express.json())

// usuarios
const usuariosRouter = require('./src/routes/usuarios.route')

app.use('/usuarios', usuariosRouter)

//citas

const citasRouter = require('./src/routes/citas.route')

app.use('/citas', citasRouter)



app.listen(PORT, () =>{
    console.log('corriendo en el puerto ' + PORT)
})
