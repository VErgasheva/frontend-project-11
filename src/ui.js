export function renderFeeds(feeds) {
  const feedsList = document.getElementById('feeds_list');
  if (!feedsList) return;
  feedsList.innerHTML = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<h5>${feed.title}</h5><p>${feed.description}</p>`;
    feedsList.appendChild(li);
  });
  document.getElementById('main_container')?.classList.remove('d-none');
}

export function renderPosts(posts, state) {
  const postsList = document.getElementById('posts_list');
  if (!postsList) return;
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

    if (state.readPosts.has(post.id)) {
      link.className = 'fw-normal';
    } else {
      link.className = 'fw-bold';
    }

    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'btn btn-outline-primary btn-sm ms-2 preview-btn';
    previewBtn.textContent = 'Предпросмотр';
    previewBtn.dataset.id = post.id;

    previewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.readPosts.add(post.id);
      renderPosts(posts, state);
      const modalEl = document.getElementById('modal');
      modalEl.querySelector('.modal-title').textContent = post.title;
      modalEl.querySelector('.modal-body').textContent = post.description;
      const fullArticleLink = modalEl.querySelector('.full-article');
      if (fullArticleLink) fullArticleLink.href = post.link;

      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    });

    link.addEventListener('click', () => {
      state.readPosts.add(post.id);
      renderPosts(posts, state);
    });

    li.appendChild(link);
    li.appendChild(previewBtn);
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