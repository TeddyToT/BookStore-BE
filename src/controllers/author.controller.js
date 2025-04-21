const authorService = require('../services/author.service');

class AuthorController {
    getAllAuthor = async (req, res, next) => {
        try {
            return res.status(201).json(await authorService.getAllAuthors());
        } catch (error) {
            next(error);
        }
    }

    getAuthorById = async (req, res, next) => {
        try {
            return res.status(201).json(await authorService.getAuthorById(req.params));
        } catch (error) {
            next(error);
        }
    }

    getAuthorByName = async (req, res, next) => {
        try {
            return res.status(201).json(await authorService.getAuthorByName(req.params));
        } catch (error) {
            next(error);
        }
    }

    addAuthor = async (req, res, next) => {
        try {
            // console.log("REQ FILE:", req.file);
            // console.log("REQ BODY:", req.body);
            // console.log("TYPE OF REQ BODY:", typeof req.body);
            return res.status(201).json(await authorService.addAuthor(req.file,req.body));

        } catch (error) {
            next(error);
        }
    }

    updateAuthor = async (req, res, next) => {
        try {
            return res.status(201).json(await authorService.updateAuthor(req.params, req.body));
        } catch (error) {
            next(error);
        }
    }

    deleteAuthor = async (req, res, next) => {
        try {
            return res.status(201).json(await authorService.deleteAuthor(req.params));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthorController();
