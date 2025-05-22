import onChange from 'on-change'
import { renderFeeds, renderPosts } from './ui.js'

export default (state, elements) => onChange(state, function (path, value) {
  if (path === 'feeds') {
    renderFeeds(state.feeds)
    elements.feedsBlock.classList.remove('d-none')
  }
  if (path === 'posts') {
    renderPosts(state.posts, state)
    elements.postsBlock.classList.remove('d-none')
  }
  if (path === 'form.error' || path === 'form.valid') {
    if (state.form.valid) {
      elements.input.classList.remove('is-invalid')
      elements.infoText.classList.add('d-none')
      elements.infoText.textContent = ''
    } else {
      elements.input.classList.add('is-invalid')
      elements.infoText.textContent = value
      elements.infoText.classList.remove('d-none')
      elements.infoText.classList.remove('text-success')
      elements.infoText.classList.add('text-danger')
    }
  }
})
