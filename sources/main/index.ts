import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 80;

app.get('/', async (req: Request, res: Response) => {
  	res.send('Access control microservice');
});

/*
	FUNZIONALITà RICHIESTE
	-login
	-registrare
	-cambiare tutte informazioni utente
*/

import loginRouter from './routes/Login';
app.use('/login', loginRouter)


app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});