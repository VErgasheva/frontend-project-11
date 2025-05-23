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
  if (path === 'form.error' || path === 'form.valid' || path === 'form.success') {
    if (state.form.success) {
      elements.input.classList.remove('is-invalid')
      elements.infoText.textContent = state.form.success
      elements.infoText.classList.remove('d-none', 'text-danger')
      elements.infoText.classList.add('text-success')
      elements.infoText.classList.remove('d-none')
    }
    else if (!state.form.valid && state.form.error) {
      elements.input.classList.add('is-invalid')
      elements.infoText.textContent = state.form.error
      elements.infoText.classList.remove('d-none', 'text-success')
      elements.infoText.classList.add('text-danger')
      elements.infoText.classList.remove('d-none')
    }
    else {
      elements.input.classList.remove('is-invalid')
      elements.infoText.classList.add('d-none')
      elements.infoText.textContent = ''
      elements.infoText.classList.remove('text-success', 'text-danger')
    }
  }
})
