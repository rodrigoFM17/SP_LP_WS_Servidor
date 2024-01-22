const db = require('../config/db.config')
const crypto  = require('node:crypto')


const getDateByDay = async (req, res) =>{

    try{

        const year = req.params.anio
        const month = req.params.mes
        const day = req.params.dia

        const fullDate = `${year}-${month}-${day}`

        const connection = await db.createConnection()

        const [rows] = await connection.query('select * from citas where fecha = ? ', [fullDate])
        connection.end()
    
        res.status(200).json({
            message: 'citas obtenidas correctamente',
            citas: rows
        })


    } catch (error){

        console.log(error)
        res.status(500).json({
            message: 'hubo un error al obtener las citas',
            error: error.message
        })
    }
}   

const getDateById = async (req, res) => {

}

const createDate = async (req, res) => {

    try{

        const { fecha, hora, usuarioId } = req.body

        const newDate = {
            id: crypto.randomUUID(),
            fecha,
            hora,
            usuarioId
        }

        const connection = await db.createConnection()

        await connection.execute('insert into citas values (?, ?, ?, ?) ', [newDate.id, newDate.fecha, newDate.hora, newDate.usuarioId])
        connection.end()

        res.status(201).json({
            message: 'la cita se agendo exitosamente',
            cita: newDate,
        })

    } catch(error) {
        console.log(error)

        res.status(500).json({
            message: 'hubo un error al crear la cita',
            error: error.message
        })
    }

}

module.exports = {
    getDateByDay,
    getDateById,
    createDate
}