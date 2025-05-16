import * as yup from 'yup';

const getValidationSchema = (feeds) => (
  yup.object().shape({
    url: yup
      .string()
      .required('Введите адрес')
      .url('Некорректный адрес')
      .notOneOf(feeds.map((f) => f.url), 'RSS уже добавлен'),
  })
);

export default (elements, state) => {
  const { form, input } = elements;

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
      state.form.error = err.errors ? err.errors[0] : 'Ошибка валидации';

      input.classList.add('is-invalid');
      elements.infoText.textContent = state.form.error;
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
      input.classList.add('is-invalid');
      elements.infoText.textContent = err.errors ? err.errors[0] : '';
      elements.infoText.classList.remove('d-none');
    }
  });
};
