const db = require('../config/db.config')

const index = async (req, res) => {

    try {

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