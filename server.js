const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

let users = {};
let posts = [];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// User login/register
app.post('/api/login', (req, res) => {
    const { username } = req.body;
    if (!users[username]) users[username] = { subscriptions: [] };
    res.json({ message: 'Logged in', username });
});

// Create post
app.post('/api/posts', (req, res) => {
    const { author, title, content, tags, isPrivate } = req.body;
    const post = {
        id: Date.now(),
        author,
        title,
        content,
        tags,
        comments: [],
        private: isPrivate,
        visibleTo: []
    };
    posts.push(post);
    res.json(post);
});

// Get posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Subscribe
app.post('/api/subscribe', (req, res) => {
    const { follower, followee } = req.body;
    if (users[follower] && users[followee]) {
        users[follower].subscriptions.push(followee);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid user(s)' });
    }
});

// Add comment
app.post('/api/comment', (req, res) => {
    const { postId, user, text } = req.body;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({ user, text });
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});