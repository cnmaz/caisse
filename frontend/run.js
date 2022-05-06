const express = require('express')
const app = express()
const port = 3000
const proxy = require('./src/setupProxy')

app.use(express.static('build'))
proxy(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})