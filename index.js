const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require ('dotenv')

const app = express()
dotenv.config()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('./public'))

const database = require('./database')

database.connect((err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(`connected as id : ${database.threadId}`)
})

app.get('/', (req, res) => {
    res.status(200).send('<h1>My Api<h1>')
})

const { 
    userRouter, 
    categoryRouter, 
    productRouter, 
    productCategoryRouter, 
    profileRouter 
} = require('./routers')
app.use('/api', userRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)
app.use('/api', productCategoryRouter)
app.use('/api', profileRouter)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server is running at port : ${PORT}`))