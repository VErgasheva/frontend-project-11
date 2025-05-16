export function renderFeeds(feeds) {
  const feedsList = document.getElementById('feeds_list');
  feedsList.innerHTML = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<h5>${feed.title}</h5><p>${feed.description}</p>`;
    feedsList.appendChild(li);
  });

  document.getElementById('main_container').classList.remove('d-none');
}

export function renderPosts(posts) {
  const postsList = document.getElementById('posts_list');
  postsList.innerHTML = '';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start';
    const link = document.createElement('a');
    link.href = post.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = post.title;
    link.dataset.id = post.id;
 
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('modal_title').textContent = post.title;
      document.getElementById('modal_body').textContent = post.description;
      document.getElementById('modal_link').href = post.link;
      const modal = new window.bootstrap.Modal(document.getElementById('modal'));
      modal.show();
    });

    li.appendChild(link);
    postsList.appendChild(li);
  });
}

export function showInfo(message, infoText) {
  infoText.textContent = message;
  infoText.classList.remove('d-none', 'text-danger');
  infoText.classList.add('text-success');
}

export function showError(message, infoText) {
  infoText.textContent = message;
  infoText.classList.remove('d-none', 'text-success');
  infoText.classList.add('text-danger');
}