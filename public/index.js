
    let currentUser = null;
    let users = {};
    let posts = [];

    function login() {
    const username = document.getElementById('username').value.trim();
    if (!username) return;
    if (!users[username]) users[username] = { subscriptions: [] };
    currentUser = username;
    document.getElementById('welcome').innerText = `Добро пожаловать, ${currentUser}!`;
    document.getElementById('postSection').classList.remove('hidden');
    renderPosts();
}

    function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const isPrivate = document.getElementById('privatePost').checked;
    if (!title || !content) return;
    const post = {
    id: Date.now(),
    author: currentUser,
    title,
    content,
    tags,
    comments: [],
    private: isPrivate,
    visibleTo: []
};
    posts.push(post);
    renderPosts();
}

    function subscribe() {
    const userToFollow = document.getElementById('subscribeTo').value.trim();
    if (userToFollow && userToFollow !== currentUser && users[userToFollow]) {
    users[currentUser].subscriptions.push(userToFollow);
    renderPosts();
}
}

    function renderPosts() {
    const publicContainer = document.getElementById('publicPosts');
    const requestedContainer = document.getElementById('requestedPosts');
    const subscribedContainer = document.getElementById('subscribedPosts');
    const tagFilter = document.getElementById('tagFilter');

    publicContainer.innerHTML = '';
    requestedContainer.innerHTML = '';
    subscribedContainer.innerHTML = '';
    tagFilter.innerHTML = '';

    const allTags = new Set();

    posts.forEach(post => {
    post.tags.forEach(tag => allTags.add(tag));

    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
          <strong>${post.title}</strong> by ${post.author}
          <p>${post.content}</p>
          <div>${post.tags.map(t => `<span class="tag" onclick="filterByTag('${t}')">#${t}</span>`).join('')}</div>
          ${post.author === currentUser ? `<button onclick="editPost(${post.id})">Edit</button><button onclick="deletePost(${post.id})">Delete</button>` : ''}
          <div>
            <input placeholder="Add comment" id="comment-${post.id}" />
            <button onclick="addComment(${post.id})">Comment</button>
            <div>${post.comments.map(c => `<div class='comment'>${c.user}: ${c.text}</div>`).join('')}</div>
          </div>
        `;

    if (!post.private) {
    publicContainer.appendChild(postEl);
} else if (post.visibleTo.includes(currentUser) || post.author === currentUser) {
    requestedContainer.appendChild(postEl);
} else {
    const requestBtn = document.createElement('button');
    requestBtn.innerText = `Request access to "${post.title}"`;
    requestBtn.onclick = () => {
    post.visibleTo.push(currentUser);
    renderPosts();
};
    requestedContainer.appendChild(requestBtn);
}

    if (users[currentUser]?.subscriptions.includes(post.author)) {
    subscribedContainer.appendChild(postEl.cloneNode(true));
}
});

    allTags.forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.innerText = `#${tag}`;
    tagEl.onclick = () => filterByTag(tag);
    tagFilter.appendChild(tagEl);
});
}

    function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (post && post.author === currentUser) {
    const newContent = prompt('Edit post content:', post.content);
    if (newContent !== null) {
    post.content = newContent;
    renderPosts();
}
}
}

    function deletePost(id) {
    posts = posts.filter(p => p.id !== id || p.author !== currentUser);
    renderPosts();
}

    function addComment(postId) {
    const input = document.getElementById(`comment-${postId}`);
    const post = posts.find(p => p.id === postId);
    if (post && input.value) {
    post.comments.push({ user: currentUser, text: input.value });
    input.value = '';
    renderPosts();
}
}

    function filterByTag(tag) {
    document.getElementById('publicPosts').innerHTML = '';
    posts.filter(p => p.tags.includes(tag) && !p.private)
    .forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `<strong>${post.title}</strong> by ${post.author}<p>${post.content}</p>`;
    document.getElementById('publicPosts').appendChild(postEl);
});
}


