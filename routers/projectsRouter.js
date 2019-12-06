const express = require("express")
const projectModel = require("../data/helpers/projectModel")
const actionModel = require("../data/helpers/actionModel")

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

router.get('/:id/actions', (req, res) => {
    projectModel.getProjectActions(req.params.id)
    .then(actions => {
        res.status(200).json(actions)
    })
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

router.post("/:id/actions", (req, res) => {
    projectModel.get(req.params.id)
    .then(project => {
        if ('description' in req.body && 'notes' in req.body) {
            actionModel.insert({project_id: req.params.id, description: req.body.description, notes: req.body.notes, completed: false})
            .then(action => {
                res.status(201).json(action)
            })
            .catch(error => {
                res.status(500).json({error: error})
            })
        }
        else {
            res.status(400).json({errorMessage: "Please provide a description and notes for the action"})
        }
    })
    .catch(err => res.status(404).json({error: "The requested project does not exist"}))
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

router.put('/:id/actions/:actId', (req, res) => {
    if ('notes' in req.body && 'description' in req.body) {
        actionModel.update(req.params.actId, req.body)
        .then(action => {
            actionModel.get(req.params.actId)
            .then(newAction => {
                res.status(200).json(newAction)
            })
        })
        .catch(err => res.status(404).json({ message: err }))
    }
    else {
        res.status(400).json({ errorMessage: "Please provide notes and description for the action." })
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

router.delete('/:id/actions/:actId', (req, res) => {
    actionModel.get(req.params.actId)
    .then(action => {
        res.status(200).json(action)
        actionModel.remove(req.params.actId)
        .catch(err => res.status(500).json({message: "Error deleting the action with the specified ID."}))
    })
    .catch(err => res.status(404).json({message: "The action with the specifid ID does not exist."}))
})

module.exports = router