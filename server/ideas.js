const express = require('express');
const ideasRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId
} = require('./db');


  ideasRouter.param('ideaId', (req, res, next, id) => {
  const idea = getFromDatabaseById('ideas', id);
  if (idea) {
    req.idea = idea; 
    req.ideaId = id;
    next();
  } else {
    res.status(404).send('Minion not found');
  }
});


const validateIdeaRequest = (req, res, next) => {
    const { name, description, weeklyRevenue, numWeeks } = req.body;

    const hasStrings = name && description;
    const hasNumbers = typeof weeklyRevenue === 'number' && typeof numWeeks === 'number';

    const isPut = req.method === 'PUT';
    const hasId = isPut ? !!req.body.id : true;

    if (hasStrings && hasNumbers && hasId) {
        next();
    } else {
        const err = new Error('Bad Request: Missing or invalid fields');
        err.status = 400;
        next(err);
    }
};

ideasRouter.get('/', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');
    if (ideas){
        res.status(200).send(ideas);
    } else {
        const err = new Error('Not found');
        err.status = 404;
        next(err);
    }
});

ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = addToDatabase('ideas', req.body);
    if (newIdea){
        res.status(201).send(newIdea);
    } else {
        const err = new Error('Unexpected error');
        err.status = 500;
        next(err);
    }
});


ideasRouter.get('/:ideaId', (req, res, next) => {
        res.status(200).send(req.idea);  
});

ideasRouter.put('/:ideaId', (req, res, next) => {
    const updatedIdea = updateInstanceInDatabase('ideas', req.body);
    if (updatedIdea) {
        res.status(200).send(updatedIdea);
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
     }
});

ideasRouter.delete('/:ideaId', (req, res, next) => {
    const deletedIdea = deleteFromDatabasebyId('ideas', req.ideaId);
    if (deletedIdea){
        res.status(204).send();
    }  else {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
     }
});

const errorhandling = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({error: err.message});
    } else {
        res.status(500).send();
    }
}

ideasRouter.use(errorhandling);

module.exports = ideasRouter;