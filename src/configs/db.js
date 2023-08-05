const mongoose = require('mongoose'); //Defines mongoose

mongoose.connect(process.env.MONGOOOSE_URL, { 
    useUnifiedTopology: true,
    useNewUrlParser: true 
})
.then(db => console.log('Conectado a Mongoose'))
.catch(err => console.error(err))