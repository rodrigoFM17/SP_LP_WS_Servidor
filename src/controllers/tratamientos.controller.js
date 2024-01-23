const db = require('../config/db.config')
const crypto = require('node:crypto')

const index = async (req, res) => {

    try {

        const connection = await db.createConnection()

        const [rows] = await connection.execute('select * from tratamientos')
        await connection.end()

        res.status(200).json({
            message: 'tratamientos obtenidos correctamente',
            tratamientos: rows
        })

    } catch ( error) {

        console.log(error)

        res.status(500).json({
            message: 'hubo un error al obtener los tratamientos',
            error: error.message
        })

    }

}

const getTreatmentById = async (req, res) => {

    try{

        const {id} = req.body

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: 'hubo un error al obtener el tratamiento',
            error: error.message
        })
    }
}

const createTreatment = async (req, res) => {

    try{

        const {nombre, precio, duracion} = req.body 

        const newTreatment = {
            id: crypto.randomUUID(),
            nombre,
            precio,
            duracion,
        }

        const connection = await db.createConnection()

        await connection.execute('insert into tratamientos values (?, ?, ?, ?)', [newTreatment.id, newTreatment.nombre, newTreatment.precio, newTreatment.duracion])
        await connection.end()

        res.status(201).json({
            message: 'tratamiento creado correctamente',
            tratamiento: newTreatment
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            message: 'hubo un error al crear el tratamiento',
            error: error.message
        })
    }
}


module.exports = {
    index,
    getTreatmentById,
    createTreatment
}