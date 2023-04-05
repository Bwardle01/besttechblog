const router = require('express').Router();
const { Post, User, Comment } = require('../../models/');
const withAuth = require('../../utils/auth');

// Gets all posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: ['id', 'post_body', 'title', 'created_at'], 
      // show newest posts first
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_body', 'post_id', 'user_id', 'created_at'], 
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        },
      ]
    });
    // const posts = postData.map((post) => post.get({ plain: true }));
    res.json(postData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Gets one post by id 
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'post_body', 'title', 'created_at'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_body', 'user_id', 'post_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.json(postData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//creates new post
router.post('/', withAuth, async (req, res) => {
  const body = req.body;

  try {
    const newPost = await Post.create({ ...body, user_id: req.session.userId });
    res.json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//updates a post by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    const [affectedRows] = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//Deletes a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const [affectedRows] = Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
