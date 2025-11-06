// Main logic for Mini Social Platform
// Demo: posts are only in-memory (not persistent)
const postsList = document.getElementById('posts-list');
const form = document.getElementById('new-post-form');
const textarea = document.getElementById('post-content');
let posts = [];

function renderPosts() {
  postsList.innerHTML = posts.map(post => `<div class="post-card">${post}</div>`).join('');
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (textarea.value.trim()) {
    posts.unshift(textarea.value.trim());
    textarea.value = '';
    renderPosts();
  }
});

renderPosts();
