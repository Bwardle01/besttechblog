const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');


//users can make many posts
User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'

});

//user can have many comments
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// post belongs to one user
Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

//Posts have many comments
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

//A comment only belongs to one user
Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

// comment belongs to one post
Comment.belongsTo(Post, {
  foreignKey: 'post_id',

})

module.exports = {
  User,
  Comment,
  Post
};