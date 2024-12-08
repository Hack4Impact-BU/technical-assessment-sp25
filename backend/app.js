import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()
const app = express()

app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000

const mongoUrl = process.env.MONGODB_CONNECT_URL
const mongo = new MongoClient(mongoUrl, {})

mongo.connect().then(() => {
    console.log("Connected to MongoDB")
})

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
  
app.get('/songs', (req, res) => {
    console.log("GETTING SONGS")
    let songs = [];
    for (let i = 0; i < 3; i++) {
        // 8500000
        // 8061175
        const num = getRandomInt(8061177, 8054000)
            fetch(`https://api.genius.com/songs/${num}`, {
                method: "GET",
                "headers": {
                    "Authorization": `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`
                }
            }
        )
            .then((data) => data.json())
            .then((data) => {
                // console.log(data)
                // songs.push({'artist': data["artist_names"], "link": data["apple_music_player_url"], "cover_image": data["header_image_url"]})
                console.log(num)
                console.log(data.response)
            })
        
    }
    res.json({
        songData: songs,
    })
})

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})