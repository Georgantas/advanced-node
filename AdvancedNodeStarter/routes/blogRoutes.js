const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
// const { clearHash } = require('../services/cache');
const cleanCache = require('../middlewares/cleanCache');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  // Note: Three ways to execute a query in mongoose:
  // query.exec()
  // query.then()
  // await query;
  app.get('/api/blogs', requireLogin, async (req, res) => {
    // const redis = require('redis');
    // const redisUrl = 'redis://127.0.0.1:6379';
    // const client = redis.createClient(redisUrl);
    // const util = require('util');

    // client.get = util.promisify(client.get);

    // // Do we have any cached data in redis related to this query
    // const cachedBlogs = await client.get(req.user.id)

    // // If yes, then respond to the request right away and return
    // if(cachedBlogs) {
    //   return res.send(JSON.parse(cachedBlogs));
    // }

    // // If no, we need to respond to request and update our cache to store the data
    // const blogs = await Blog.find({ _user: req.user.id });
    // res.send(blogs);
    // client.set(req.user.id, JSON.stringify(blogs));
    const blogs = await Blog.find({ _user: req.user.id }).cache({ hashKey: req.user.id, expireTime: 10 });

    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    const blog = new Blog({
      imageUrl,
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }

    // I prefer this way instead of using the cleanCache middleware:
    // clearHash(req.user.id);
  });
};
