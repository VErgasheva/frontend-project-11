import * as yup from 'yup';
import { i18next } from './i18n.js';
import parseRss from './rssParser.js';
import { renderFeeds, renderPosts, showInfo, showError } from './ui.js';

const getValidationSchema = (feeds) => (
  yup.object().shape({
    url: yup
      .string()
      .required('form.errors.required')
      .url('form.errors.url')
      .notOneOf(feeds.map((f) => f.url), 'form.errors.notOneOf'),
  })
);

const getProxyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

export default (elements, state) => {
  const { form, input, infoText } = elements;

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

      // Загрузка RSS
      showInfo(i18next.t('form.success'), infoText);
      input.setAttribute('readonly', true);

      fetch(getProxyUrl(url))
        .then((response) => {
          if (!response.ok) throw new Error('network');
          return response.json();
        })
        .then((data) => {
          const { feed, posts } = parseRss(data.contents);

          // Генерируем id
          const feedId = `feed-${Date.now()}-${Math.random()}`;
          const feedData = {
            id: feedId,
            url,
            title: feed.title,
            description: feed.description,
          };
          state.feeds.push(feedData);

          posts.forEach((post) => {
            state.posts.push({
              ...post,
              feedId,
              id: `post-${Date.now()}-${Math.random()}`,
            });
          });

          renderFeeds(state.feeds);
          renderPosts(state.posts);

          form.reset();
          input.classList.remove('is-invalid');
          input.removeAttribute('readonly');
          input.focus();
          infoText.classList.add('d-none');
        })
        .catch((err) => {
          let message;
          if (err.message === 'network') {
            message = 'Ошибка сети. Попробуйте ещё раз.';
          } else if (err.isParsing) {
            message = 'Ошибка чтения RSS. Проверьте ссылку.';
          } else {
            message = 'Неизвестная ошибка.';
          }
          showError(message, infoText);
          input.removeAttribute('readonly');
        });
    } catch (err) {
      state.form.valid = false;
      const code = err.errors ? err.errors[0] : 'form.errors.default';
      state.form.error = code;

      input.classList.add('is-invalid');
      infoText.textContent = i18next.t(code);
      infoText.classList.remove('d-none');
    }
  });
  input.addEventListener('input', async () => {
    const url = input.value.trim();
    try {
      await validate(url, state.feeds);
      input.classList.remove('is-invalid');
      infoText.classList.add('d-none');
    } catch (err) {
      const code = err.errors ? err.errors[0] : '';
      input.classList.add('is-invalid');
      infoText.textContent = i18next.t(code);
      infoText.classList.remove('d-none');
    }
  });
};