
const migrate = require('./migrations')
const http = require('http')
const express = require("express")
const dotenv = require("dotenv")
const cors = require('cors')
const AppDAO = require('./dao')
const DisputeRepository = require('./DisputeRepository')
const Web3 = require("web3");
const app = express()
dotenv.config()
const listener = require("./blockchain")
const appDAO = new AppDAO(process.env.DB_PATH)
const disputeRepository = new DisputeRepository(appDAO)

if (process.env.MIGRATE === 'true') {
    console.log('start migration process')
    migrate(disputeRepository)
}

const corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const provider = new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545")
const web3 = new Web3(provider)

app.use(cors(corsOptions))
app.get('/disputes', async (req, res) => {
    let disputes = await disputeRepository.getAll()
    res.status(200)
    res.send(disputes)
})

const server = http.createServer(app)
server.listen(process.env.PORT, async () => {
    console.log(process.env.CONTRACT_PATH)
    await listener(web3, disputeRepository)
    console.log(`Server started on port ${server.address().port}`)
})
