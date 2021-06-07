const mongoose = require('mongoose');

const dbConnection = async()=>{
    try {
        console.log('init config db');

        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al abrir la base de datos')
    }
}

module.exports ={
    dbConnection
}