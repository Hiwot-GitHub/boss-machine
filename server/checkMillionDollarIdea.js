const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue }= req.body;
    const totalYield = Number(numWeeks) * Number(weeklyRevenue);
    if (!numWeeks || !weeklyRevenue || isNaN(totalYield) || totalYield < 1000000){
       res.status(400).send();
    } else {
      next();
    }
};

module.exports = checkMillionDollarIdea;
