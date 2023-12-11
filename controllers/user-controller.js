const { User, Thought } = require('../models');
const userController = {

    getUsers(req, res) {
        User.find()
        .select('-__v')
        .then((userData) => res.json(userData))
        .catch((err) => {
            console.log(err);
             res.status(500).json(err);
        });
    },

    getOneUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'That user does not exist!' });
            }

            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    createUser(req, res) {
        User.create(req.body)
        .then((userData) => res.json(userData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    updateUser(req, res) {
        User.findByIdAndUpdate(req.params.userId, 
            {
                $set: req.body
            },
            {
                runValidators: true,
                new: true,
            }
        )
        .then((userData) => {
            if(!userData) {
                return res.status(404).json({ message: 'That user does not exist!' });
            }

            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteUser(req, res) {
        User.findByIdAndDelete(req.params.userId)
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'That user does not exist!' });
            }
            return Thought.deleteMany({ _id: { $in: userData.thoughts }});
        })
        .then(() => {
            res.json({ message: 'User and their Thoughts deleted.' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        )
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'That user does not exist!' });
            }

            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'That user does not exist!' });
            }

            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
};

module.exports = userController;