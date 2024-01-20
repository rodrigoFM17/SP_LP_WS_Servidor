const express = require('express')
require('dotenv').config()

const PORT = process.env.PORT

const app = express()

const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    

    next();
}

app.use(express.json())
app.use(corsMiddleware)

// usuarios
const usuariosRouter = require('./src/routes/usuarios.route')

app.use('/usuarios', usuariosRouter)

//citas

const citasRouter = require('./src/routes/citas.route')

app.use('/citas', citasRouter)

//tratamientos

const tratamientosRouter = require('./src/routes/tratamientos.route')

app.use('/tratamientos', tratamientosRouter)


app.listen(PORT, () =>{
    console.log('corriendo en el puerto ' + PORT)
})
