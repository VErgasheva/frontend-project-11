import i18next from 'i18next';

export default (elements, state) => {
  const { input, infoText } = elements;

  const renderForm = () => {
    if (state.form.valid) {
      input.classList.remove('is-invalid');
      infoText.classList.add('d-none');
      infoText.textContent = '';
    } else {
      input.classList.add('is-invalid'); 
      infoText.textContent = i18next.t(state.form.error || 'form.errors.default');
      infoText.classList.remove('d-none');
    }
  }; 
  if (!state.posts) state.posts = [];
  if (!state.readPosts) state.readPosts = new Set();

  state.renderForm = renderForm;
};