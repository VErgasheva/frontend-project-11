import * as yup from 'yup';
import { i18next } from './i18n.js';

const getValidationSchema = (feeds) => (
  yup.object().shape({
    url: yup
      .string()
      .required('form.errors.required')
      .url('form.errors.url')
      .notOneOf(feeds.map((f) => f.url), 'form.errors.notOneOf'),
  })
);

export default (elements, state) => {
  const { form, input } = elements;

  yup.setLocale({
    mixed: {
      required: 'form.errors.required',
      notOneOf: 'form.errors.notOneOf',
    },
    string: {
      url: 'form.errors.url',
    },
  });

  const validate = (url, feeds) => {
    const schema = getValidationSchema(feeds);
    return schema.validate({ url }, { abortEarly: false });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = input.value.trim();

    try {
      await validate(url, state.feeds);

      state.form.valid = true;
      state.form.error = null;

      state.feeds.push({ url });

      form.reset();
      input.classList.remove('is-invalid');
      input.focus();
      elements.infoText.classList.add('d-none');
    } catch (err) {
      state.form.valid = false;
      const code = err.errors ? err.errors[0] : 'form.errors.default';
      state.form.error = code;

      input.classList.add('is-invalid');
      elements.infoText.textContent = i18next.t(code);
      elements.infoText.classList.remove('d-none');
    }
  });

  input.addEventListener('input', async () => {
    const url = input.value.trim();
    try {
      await validate(url, state.feeds);
      input.classList.remove('is-invalid');
      elements.infoText.classList.add('d-none');
    } catch (err) {
      const code = err.errors ? err.errors[0] : '';
      input.classList.add('is-invalid');
      elements.infoText.textContent = i18next.t(code);
      elements.infoText.classList.remove('d-none');
    }
  });
};