const checkMillionDollarIdea = (req, res, next) => {
    const idea = req.body;
    if (idea.numWeeks * idea.weeklyRevenue >=  1000000){
       next();
    } else {
        const err = new Error('Bad Request');
        err.status = 400;
        next(err);
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
