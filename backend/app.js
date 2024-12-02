const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const PORT = 4000

app.post('/chat', (req, res) => {
    const userMessage = req.body.userMessage

    res.json({
        message: 'testing message',
    })
})

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})