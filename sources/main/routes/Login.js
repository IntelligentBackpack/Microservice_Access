const express = require('express');
const queryAsk = require('../queries');
const router = express.Router();
router.use(express.json());

router.get('/istituto', async function(req, res) {
    res.send(await queryAsk.queryIstituto())
});

router.get('/ruolo', async function(req, res) {
    res.send(await queryAsk.queryRuolo())
});

module.exports = router