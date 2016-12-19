/**
 * GamesController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    destroy: function (req, res) {
        var id = req.param('id');

        if (!id) {
            return res.badRequest('No id passed.');
        }

        Games.update(id, {isEnabled: false}).exec(function (err, game) {
            if (err) {
                return res.serverError(err);
            }

            return res.jsonx(game);
        });
    },

    create: function (req, res) {
        if (!req.body) {
            return res.badRequest('No body data passed.');
        }

        Games.create(req.body).exec(function (err, game) {
            if (err) {
                return res.serverError(err);
            }

            return res.jsonx(game);
        });
    },

    update: function (req, res) {
        if (!req.body) {
            return res.badRequest('No body data passed.');
        }

        var id = req.param('id');

        if (!id) {
            return res.badRequest('No id passed.');
        }

        Games.update(id, req.body).exec(function (err, game) {
            if (err) {
                return res.serverError(err);
            }

            return res.jsonx(game);
        });
    },

    find: function (req, res) {

        Games.find({}).exec(function(err, games) {
            res.view('public/index', {games: games});
        })

    },

    ':name': function (req, res) {

        var id = req.params.name;

        if (!id) {
            return res.badRequest('No id passed.');
        }

        Games.findOne({ "game" : id }).exec(function(err, game) {

            if (err) {
                return res.serverError(err);
            }

            if(!game){

                return res.forbidden('No valid id passed.');

            }

            res.view('public/game/', {game: game});
        })

    },

};

