const express = require('express')
const app = express()
const queryAsk = require('./queries')

var port = process.env.PORT || 80

//default page
app.get('/', (req, res) => res.send("homepage"));

//routes
const loginRouter = require('./routes/Login')
app.use('/login', loginRouter)

app.listen (port, () => console.log("server is running on port " + port))