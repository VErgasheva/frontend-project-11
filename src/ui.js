import { i18next } from './i18n.js'

export function renderFeeds(feeds) {
  const feedsList = document.getElementById('feeds_list')
  if (!feedsList) return
  feedsList.innerHTML = ''
  feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.className = 'list-group-item'
    li.innerHTML = `<h5>${feed.title}</h5><p>${feed.description}</p>`
    feedsList.appendChild(li)
  })
}

export function renderPosts(posts, state) {
  const postsList = document.getElementById('posts_list')
  if (!postsList) return
  postsList.innerHTML = ''
  posts.forEach((post) => {
    const li = document.createElement('li')
    li.className = 'list-group-item d-flex justify-content-between align-items-start'
    const link = document.createElement('a')
    link.href = post.link
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = post.title
    link.dataset.id = post.id
    link.className = state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold'

    const previewBtn = document.createElement('button')
    previewBtn.type = 'button'
    previewBtn.className = 'btn btn-outline-primary btn-sm ms-2 preview-btn'
    previewBtn.textContent = i18next.t('modal.fullArticle')
    previewBtn.dataset.id = post.id

    previewBtn.addEventListener('click', (e) => {
      e.preventDefault()
      state.readPosts.add(post.id)
      renderPosts(posts, state)

      const modalEl = document.getElementById('modal')
      modalEl.querySelector('.modal-title').textContent = post.title
      modalEl.querySelector('.modal-body').textContent = post.description
      const fullArticleLink = modalEl.querySelector('.full-article')
      if (fullArticleLink) {
        fullArticleLink.href = post.link
      }

      let ModalConstructor = window.bootstrap?.Modal
      if (!ModalConstructor && window.Modal) {
        ModalConstructor = window.Modal
      }
      if (ModalConstructor) {
        const modal = ModalConstructor.getOrCreateInstance
          ? ModalConstructor.getOrCreateInstance(modalEl)
          : new ModalConstructor(modalEl)
        modal.show()
      } else {
        modalEl.classList.add('show')
        modalEl.style.display = 'block'
        modalEl.removeAttribute('aria-hidden')
        modalEl.setAttribute('aria-modal', 'true')
        const closeBtns = modalEl.querySelectorAll('[data-bs-dismiss="modal"]')
        closeBtns.forEach((btn) => {
          btn.onclick = () => {
            modalEl.classList.remove('show')
            modalEl.style.display = 'none'
            modalEl.setAttribute('aria-hidden', 'true')
            modalEl.removeAttribute('aria-modal')
          }
        })
      }
    })

    link.addEventListener('click', () => {
      state.readPosts.add(post.id)
      renderPosts(posts, state)
    })

    li.appendChild(link)
    li.appendChild(previewBtn)
    postsList.appendChild(li)
  })
}
export function showInfo(message, infoText) {
  infoText.textContent = message
  infoText.classList.remove('d-none', 'text-danger')
  infoText.classList.add('text-success')
  infoText.classList.remove('d-none')
}

export function showError(message, infoText) {
  infoText.textContent = message
  infoText.classList.remove('d-none', 'text-success')
  infoText.classList.add('text-danger')
  infoText.classList.remove('d-none')
}
