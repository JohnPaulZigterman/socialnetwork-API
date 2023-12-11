const { Thought, User } = require('../models');

const thoughtController = {

    getThoughts(req, res) {
        Thought.find()
        .sort({ createdAt: -1 })
        .then((thoughtData) => res.json(thoughtData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((thoughtData) => {
            if (!thoughtData) {
                return res.status(404).json({ message: "That user does not exist!" });
            }
            res.json(thoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then((thoughtData) => {
            return User.findOneAndUpdate(
                { userName: req.body.userName },
                { $push: { thoughts: thoughtData._id }},
                { new: true },
            );
        })
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'Thought created but this user does not exist!' });
            }

            res.json({ message: 'Thought successfully created!' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    updateThought(req, res) {
        Thought.findByIdAndUpdate(req.params.thoughtId, 
            { $set: req.body },
            { runValidators: true, new: true},
        )
        .then((thoughtData) => {
            if (!thoughtData) {
                return res.status(404).json({ message: "Thought does not exist!" });
            }
            res.json(thoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    
    deleteThought(req, res) {
        Thought.findByIdAndDelete(req.params.thoughtId)
        .then((thoughtData) => {
            if (!thoughtData) {
                res.status(404).json({ message: 'No Thought with that ID!' });
            }
            return User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId }},
                { new: true },
            );
        })
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'Thought has been deleted but no user with this ID!' });
            }
            res.json({ message: 'Thought deleted successfully!' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true },
        )
        .then((thoughtData) => {
            if (!thoughtData) {
                return res.status(404).json({ message: 'That Thought does not exist!' });
            }
            res.json(thoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $pull: { reactions: req.body }},
            { runValidators: true, new: true },
        )
        .then((thoughtData) => {
            if (!thoughtData) {
                return res.status(404).json({ message: 'That Thought does not exist!' });
            }
            res.json(thoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    
}

module.exports = thoughtController;
