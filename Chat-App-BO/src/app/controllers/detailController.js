const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');

class DetailController {
    //[GET] /detail/email
    show(req, res, next) {
        User.findOne({ email: req.params.email })
        .then(user => {
            res.render('detail/show', {user: mongooseToObject(user)});
        })
        .catch(next)
        
    }

    create(req, res, next){
        res.send("Course Create");
    }
}

module.exports = new DetailController();