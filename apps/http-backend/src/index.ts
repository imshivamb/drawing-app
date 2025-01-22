import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
app.use(bodyParser.json())


app.use('/auth', authRoutes)

app.use('/room', roomRoutes)

app.listen(3002)