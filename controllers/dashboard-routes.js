const router = require('express').Router();
const { Post, Comment, User } = require('../models/');
const withAuth = require('../utils/auth');


//renders all of the user's post to the dashboard layout and all-posts-admin.handlebars
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.userId
      },
      attributes: [ 'id', 'post_body', 'title', 'created_at'],
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
        }
      ]
    });
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('all-posts-admin', {
      layout: 'dashboard',
      posts,
    });
  } catch (err) {
    res.redirect('login');
  }
});

//rendering new posts using the dashboard layout and the new-post.handlebars
router.get('/new', withAuth, (req, res) => {
  res.render('new-post', {
    layout: 'dashboard',
  });
});

//edit posts by ID using dashboard layout and rendering to the edit-post.handlebars
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id', 'title', 'post_body', 'created_at'
      ],
      include: [
        {
          model: User,
          attributes: ['username']  
        },
        {
          model: Comment,
          attributes: ['id', 'comment_body', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    });

    if (postData) {
      const post = postData.get({ plain: true });
      res.render('edit-post', {
        layout: 'dashboard',
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;
