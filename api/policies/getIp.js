module.exports = function (req, res, next) {

    var ip = req.connection.remoteAddress;

    User.find({ip: ip}).exec(function(err, user) {
        if(user.length == 0){

            User.create({ip: ip}).exec(function(err, user){

                if (err) {
                    return res.serverError(err);
                }

                next();

            })

        }else{

            console.log(user);
            next()

        }
    })

};