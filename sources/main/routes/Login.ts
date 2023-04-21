import { Router } from 'express';
const queryAsk = require('../queries');
const router = Router();

export default router;


router.get('/', async (req, res) => {
    res.send('Express + TypeScript Server from router with query ' + await queryAsk.query1());
  });

