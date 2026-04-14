const express = require('express');
const minionsRouter = express.Router();
const {  createMeeting,
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  deleteAllFromDatabase } = require('./db');

  const validatingRequest = (req, res, next) => {
    const minion = req.body;
    if (minion.name && minion.title && minion.salary && typeof minion.salary === 'number'){
        next();
    } else{
        const err = new Error('Bad Request');
        err.status = 400;
        next(err);
    }
}

  const validateWorkRequest = (req, res, next) => {
    const { title, description, hours, minionId } = req.body;

    
    const hasStrings = title && description && minionId;
    const hasNumbers = typeof hours === 'number' ;

    const isPut = req.method === 'PUT';
    const hasId = isPut ? !!req.body.id : true;

    if (hasStrings && hasNumbers && hasId) {
        next();
    } else {
        const err = new Error('Bad Request: Missing or invalid fields');
        err.status = 400;
        next(err);
    }
  }


  minionsRouter.get('/', (req, res, next) => {
    console.log('Fetching all minions...');
    const minions = getAllFromDatabase('minions');
    if (minions){
         res.status(200).send(minions);
    } else{
        const err = new Error('Resource not found');
        err.status = 404;
        next(err);
    }
   
  });

  minionsRouter.post('/', validatingRequest, (req, res, next) => {
    const newMinion = addToDatabase('minions', req.body);
    if (newMinion){
        res.status(201).send(newMinion);
    } else {
         const err = new Error('Enternal Error');
         err.status = 500;
         next(err);
    }
    
  });


    minionsRouter.use('/:minionId', (req, res, next) => {
     const minionId = req.params.minionId;
     req.minionId = minionId;
     next();
  });


  minionsRouter.get('/:minionId', (req, res, next) => {
    const minion = getFromDatabaseById('minions', req.minionId);
    if(minion){
        res.status(200).send(minion);
    } else{
       const err = new Error('Resource not found');
       err.status = 404;
       next(err);
    }
  });


  minionsRouter.put('/:minionId', validatingRequest, (req, res, next) => {
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    if (updatedMinion){
        res.status(200).send(updatedMinion);
    } else {
          const err = new Error('Resource not found');
          err.status = 404;
          next(err);
    }
  });


  minionsRouter.delete('/:minionId', (req, res, next) => {
    const result = deleteFromDatabasebyId('minions', req.minionId);
    if(result){
        res.status(204).send();
    }else{
        const err = new Error('Resource not found');
        err.status = 404;
        next(err);
    }
  });

  minionsRouter.get('/:minionId/work', (req, res, next) => {
    const allworks = getAllFromDatabase('work');
    const works = allworks.filter(work => {
        return work.minionId === req.minionId ;
    });
    
    if(works){
        res.status(200).send(works);
    } else{
        const err = new Error('Not Found');
        err.status = 400;
        next(err);
    }
  });

  minionsRouter.use('/:minionId/work', (req, res, next) => {
     req.body.minionId = req.minionId;
     next();
  })

  minionsRouter.post('/:minionId/work', validateWorkRequest, (req, res, next) => {
    const newWork = addToDatabase('work', req.body);
    if (newWork){
        res.status(201).send(newWork);
    } else {
         const err = new Error('Enternal Error');
         err.status = 500;
         next(err);
    }
  });

  minionsRouter.use('/:minionId/work/:workId', (req, res, next) => {
    const workId = req.params.workId;
    req.workId = workId;
    next();
  });

  minionsRouter.put('/:minionId/work/:workId',validateWorkRequest, (req, res, next) => {
    req.body.id = req.workId;
    const updatedWork = updateInstanceInDatabase('work', req.body);
     if (updatedWork){
        res.status(200).send(updatedWork);
    } else {
          const err = new Error('Resource not found');
          err.status = 404;
          next(err);
    }
  });

  minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
    const deletedWork = deleteFromDatabasebyId('work', req.workId);
    if (deletedWork){
        res.status(204).send();
    } else {
          const err = new Error('Resource not found');
          err.status = 404;
          next(err);
    }
  })



const errorHandling = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({ error: err.message });
    } else{
        res.status(500).send();
    } 

}

minionsRouter.use(errorHandling);

module.exports = minionsRouter;
