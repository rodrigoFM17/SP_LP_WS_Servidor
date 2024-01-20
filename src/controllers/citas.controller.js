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

    try {

        const { id } = req.params

        const connection = await db.createConnection()

        const [row] = await connection.execute('select * from citas where id = ?', [id])
        connection.end()

        res.status(200).json({
            message: 'cita encontrado con exito',
            tratamiento: row[0]
        })


    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: 'error al intentar encontrar cita por id',
            error: error.message
        })
    }

}

const createDate = async (req, res) => {

    try{

        const { fecha, hora, usuarioId, tratamientoId } = req.body

        const newDate = {
            id: crypto.randomUUID(),    
            fecha,
            hora,
            usuarioId,
            tratamientoId
        }

        console.log(newDate)

        const connection = await db.createConnection()

        await connection.execute('insert into citas values (?, ?, ?, ?) ', [newDate.id, newDate.fecha, newDate.hora, newDate.usuarioId])
        
        await connection.execute('insert into "trata-citas" values (?, ?)', [newDate.id, newDate.tratamientoId])
        

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