const router = require('express').Router();
const { Comment, Post, User } = require('../../models/');
const withAuth = require('../../utils/auth');



//Getting all the comments
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({});
    res.json(commentData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Creates new comments
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.userId,
    });
    res.json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
