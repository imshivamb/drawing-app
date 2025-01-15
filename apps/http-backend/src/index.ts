import express from 'express'
import { Request, Response } from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'


const app = express();

app.use(express.json())
app.use(bodyParser.json())


app.listen(3001)