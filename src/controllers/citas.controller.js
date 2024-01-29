
const db = require('../config/db.config')
const crypto  = require('node:crypto')

let requestsHanged = []

const index = async (req, res) => {

    try{

        const connection = await db.createConnection()

        const [rows] = await connection.execute('select * from citas')
        await connection.end()

        res.status(200).json({
            message: 'citas obtenidos correctamente',
            citas: rows
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'hubo un error al obtener las citas',
            error: error.message
        })
    }
}

const getDateByDay = async (req, res) =>{

    try{

        const year = req.params.anio
        const month = req.params.mes
        const day = req.params.dia

        console.log('dia', day)

        const fullDate = `${year}-${month}-${day}`
        
        const connection = await db.createConnection()
        
        const [rows] = await connection.execute("SELECT u.nombre as nombreUsuario, fecha, hora, telefono, t.nombre as nombreTratamiento, c.id as citaId " +
        "FROM citas c inner join usuario u on c.usuarioId = u.id "+
        "inner join `trata-citas` tc on c.id = tc.citaId " +
        "inner join tratamientos t on tc.tratamientoId = t.id " +
        "where fecha = ? ", [fullDate])
        
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

const getDateByMonth = async (req, res) => {

    try{

        const {year, month} = req.params

        const inferiorLimit = `${year}-${month}-01`
        const superiorLimit = `${year}-${month}-31`
    
        const sqlQuery = 'SELECT u.nombre as nombreUsuario, fecha, hora, telefono, t.nombre as nombreTratamiento, c.id as citaId '
        + 'FROM citas c inner join usuario u on c.usuarioId = u.id ' 
        + 'inner join `trata-citas` tc on c.id = tc.citaId '
        + 'inner join tratamientos t on tc.tratamientoId = t.id '
        + 'where fecha >= ? && fecha <= ? '
    
        const connection = await db.createConnection()
    
        const [rows] = await connection.execute(sqlQuery, [inferiorLimit, superiorLimit])
        connection.end()
    
        res.status(200).json({
            message: 'citas por mes obtenidas',
            citas: rows
        })
    } catch (error){
        console.log(error)
        res.status(500).json({
            message: 'hubo un error al obtener las citas por mes',
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
            usuarioId
        }

        const connection = await db.createConnection()

        await connection.execute('insert into citas values (?, ?, ?, ?) ', [newDate.id, newDate.fecha, newDate.hora, newDate.usuarioId])
        await connection.execute('insert into `trata-citas` values (?, ?)', [newDate.id, tratamientoId])
        connection.end()

        
        if(requestsHanged.length > 0){
            requestsHanged.forEach( resquestHanged => {
                console.log('peticion respondida')
                resquestHanged.status(200).json({
                    message: 'se ha agendado una nueva cita',
                    cita: newDate
                })

            })
            
            requestsHanged = []
        }
        

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

const updateDate = async (req, res) => {
    requestsHanged.push(res)
    console.log('peticion colgada')
}

const getMissingTime = async (req, res) => {

    try{

        const {anio, mes, dia, usuarioId, hora} = req.params
        const date = `${anio}-${mes}-${dia}`
        const stringHora = `${hora}`
        console.log(date, stringHora)

        const connection = await db.createConnection()
        const [rows] = await connection.execute("SELECT timediff(hora, ?) missingTime FROM citas where usuarioId = ? && fecha = ? having missingTime <= '01:01:00' && missingTime >= '00:01:00' ", [stringHora, usuarioId, date])
        connection.end()

        if(rows.length > 0){
            res.status(200).json({
                message: 'se obtuvo el tiempo restante con exito',
                missingTime: rows[0].missingTime
            })
        } else {
            res.status(200).json({
                message: 'no hay una cita cercana',
                missingTime: null
            })
        }


    }catch(error){

        console.log(error)
        res.status(500).json({
            message: 'ocurrio un error al obtener el tiempo restante de la cita',
            error: error.message
        })
    }

    
}

module.exports = {
    getDateByDay,
    getDateByMonth,
    createDate,
    updateDate,
    index,
    getMissingTime
}