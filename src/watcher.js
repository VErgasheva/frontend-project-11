import onChange from 'on-change';
import { renderFeeds, renderPosts, showInfo, showError } from './ui.js';

export default (state, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'feeds':
      renderFeeds(state.feeds);
      elements.feedsBlock.classList.remove('d-none');
      break;

    case 'posts':
      renderPosts(state.posts, state);
      elements.postsBlock.classList.remove('d-none');
      break;

    case 'form.error':
    case 'form.valid':
      if (state.form.valid) {
        elements.input.classList.remove('is-invalid');
        elements.infoText.classList.add('d-none');
        elements.infoText.textContent = '';
      } else {
        elements.input.classList.add('is-invalid');
        elements.infoText.textContent = state.form.error || value;
        elements.infoText.classList.remove('d-none');
        elements.infoText.classList.remove('text-success');
        elements.infoText.classList.add('text-danger');
      }
      break;

    default:
      break;
  }
});
