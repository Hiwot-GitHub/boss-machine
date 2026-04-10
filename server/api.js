const express = require('express');
const apiRouter = express.Router();

const minionsRouter = require('./minions');

console.log('API is mounting Minions router');
apiRouter.use('/minions', minionsRouter);



module.exports = apiRouter;
