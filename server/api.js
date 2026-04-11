const express = require('express');
const apiRouter = express.Router();

const minionsRouter = require('./minions');
const ideasRouter = require('./ideas');


apiRouter.use('/minions', minionsRouter);
apiRouter.use('/ideas', ideasRouter);



module.exports = apiRouter;
