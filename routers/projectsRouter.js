const express = require("express")
const projectModel = require("../data/helpers/projectModel")

const router = express.Router()

router.get("/", (req, res) => {
    projectModel.get()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => res.status(500).json({error: "The projects information could not be retreived"}))
})

router.get('/:id', (req, res) => {
    projectModel.get(req.params.id)
    .then(project => res.status(200).json(project))
    .catch(err => res.status(404).json({ message: err }))
})

router.post("/", (req, res) => {
    if ('name' in req.body && 'description' in req.body) {
        projectModel.insert(req.body)
        .then(data => {
            projectModel.get(data.id)
            .then(project => res.status(201).json(project))
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "There was an error while saving the project to the database."})
        })
    }
    else {
        res.status(400).json({ errorMessage: "Please provide name and description for the project." })
    }
})

router.put('/:id', (req, res) => {
    if ('name' in req.body && 'description' in req.body) {
        projectModel.update(req.params.id, req.body)
        .then(project => {
            projectModel.get(req.params.id)
            .then(newProject => {
                res.status(200).json(newProject)
            })
        })
        .catch(err => res.status(404).json({ message: err }))
    }
    else {
        res.status(400).json({ errorMessage: "Please provide name and description for the project." })
    }
})

router.delete('/:id', (req, res) => {
    projectModel.get(req.params.id)
    .then(project => {
        res.status(200).json(project)
        projectModel.remove(req.params.id)
        .catch(err => res.status(500).json({message: "Error deleting the project with the specified ID."}))
    })
    .catch(err => res.status(404).json({message: "The project with the specifid ID does not exist."}))
})

module.exports = router