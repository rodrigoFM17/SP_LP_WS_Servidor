const express = require('express')
require('dotenv').config()
const {WebSocketServer, WebSocket } = require('ws')

const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
}


const app = express()
app.use(corsMiddleware)

app.use(express.json())

// usuarios
const usuariosRouter = require('./src/routes/usuarios.route')

app.use('/usuarios', usuariosRouter)

//citas

const citasRouter = require('./src/routes/citas.route')

app.use('/citas', citasRouter)

//tratamientos

const tratamientosRouter = require('./src/routes/tratamientos.route')
app.use('/tratamientos', tratamientosRouter)

const PORT = process.env.PORT

app.listen(PORT, () =>{
    console.log('corriendo en el puerto ' + PORT)
})

//websocket

const wss = new WebSocketServer({port: 4000})

    wss.on('connection', ws => {
        console.log('cliente conectado')

        ws.on('close', () => {
            console.log('cliente desconectado')
        })

        ws.on('message', data => {

            const date = JSON.parse(data)
            console.log('cita recibido: %s', date)

            date.fecha && date.hora && date.usuarioId && date.tratamientoId ? 
            
            wss.clients.forEach(client => {
                if (ws != client && client.readyState === WebSocket.OPEN) {
    
                    client.send(JSON.stringify({
                        message: 'se ha agendado una nueva cita',
                        cita: date
                    }));
                }
            })
            : 
            ws.send('formato de cita invalido')

        })
        

    })

