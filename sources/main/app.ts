import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const bodyParser = require('body-parser');

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());

app.get('/', async (req: Request, res: Response) => {
  	res.send('Access control microservice');
});

import loginRouter from './routes/Login';
app.use('/login', loginRouter)
import registerRouter from './routes/Register';
app.use('/register', registerRouter)
import removeRouter from './routes/Remove';
app.use('/remove', removeRouter)
import utilsRouter from './routes/Utils';
app.use('/utility', utilsRouter)


export = app;