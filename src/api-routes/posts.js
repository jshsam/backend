const express = require('express');
const router = express.Router();

const postsLogic = require('../services/posts-logic.js');

router.get('/posts?:tag/:sortBy?/:direction?',postsLogic);

module.exports = router;