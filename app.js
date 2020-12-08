const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 3000

var cors = require('cors')
require('dotenv').config({ path: __dirname + '/.env' })

app.use(cors())
app.use(bodyParser.json());
const database = require("./models/index")
const matchScore = require("./models/team");
database.connect()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/teams", async (req, res) => {
    database.connect()
    let response = await matchScore.find({}).exec()
    res.send(response)
})

app.post("/matchResult", async (req, res) => {
    database.connect()
    if (req.body.hasOwnProperty('winner')) {
        let winner = req.body.winner
        let loser = req.body.loser
        let updateWinner = await matchScore.findOne({ team_name: winner })
        updateWinner.wins = updateWinner.wins + 1
        updateWinner.score = updateWinner.score + 3
        updateWinner.save()
        let updateLoser = await matchScore.findOne({ team_name: loser })
        updateLoser.losses = updateWinner.losses + 1
        updateLoser.save()
    } else {
        let ties = req.body.ties
        try {
            let updateTies = await matchScore.updateMany({ team_name: { $in: ties } },
                {
                    $inc: { score: 1, ties: 1 }
                }
            );
        } catch (e) {
            console.log(e)
        }

    }
    let result = await matchScore.find({}).exec()
    res.send(result)
})

app.post("/addNewTeam", async (req, res) => {
    let newUser = req.body
    newUser.wins = 0
    newUser.losses = 0
    newUser.ties = 0
    newUser.score = 0
    database.connect()
    await matchScore.insertMany([newUser]);
    let result = await matchScore.find({}).exec()
    res.send(result)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})