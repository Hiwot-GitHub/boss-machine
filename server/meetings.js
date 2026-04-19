const express = require('express');
const meetingsRouter = express.Router();

const {
    createMeeting, 
    getAllFromDatabase,
    deleteAllFromDatabase, 
    addToDatabase} = require('./db');

meetingsRouter.get('/', (req, res, next) => {
    const meetings = getAllFromDatabase('meetings');
    if (meetings){
        res.status(200).send(meetings);
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

meetingsRouter.post('/', (req, res, next) => {
    const newMeeting = createMeeting()
    addToDatabase('meetings', newMeeting)
    res.status(201).send(newMeeting);
       
});

meetingsRouter.delete('/', (req, res, next) => {
    const result = deleteAllFromDatabase('meetings');
    if (result) {
        res.status(204).send();
    }  else {
        const err = new Error('Resource Not Found');
        next(err);
    }
});

const errorHandling = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({error: err.message});
    } else {
        res.status(500).send()
    }
}

meetingsRouter.use(errorHandling);

module.exports = meetingsRouter;