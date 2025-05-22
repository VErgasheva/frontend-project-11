import * as yup from 'yup';
import { i18next } from './i18n.js';
import parseRss from './rssParser.js';

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

function startRssUpdates(state) {
  const checkFeeds = () => {
    if (state.feeds.length === 0) {
      setTimeout(checkFeeds, 5000);
      return;
    }
    const feedPromises = state.feeds.map((feed) =>
      fetch(getProxyUrl(feed.url))
        .then((response) => {
          if (!response.ok) throw new Error('network');
          return response.json();
        })
        .then((data) => {
          const { posts } = parseRss(data.contents);
          const existingLinks = state.posts
            .filter((p) => p.feedId === feed.id)
            .map((p) => p.link);

          const newPosts = posts
            .filter((post) => !existingLinks.includes(post.link))
            .map((post) => ({
              ...post,
              feedId: feed.id,
              id: `post-${Date.now()}-${Math.random()}`,
            }));

          if (newPosts.length > 0) {
            state.posts.push(...newPosts);
          }
        })
        .catch(() => {})
    );
    Promise.all(feedPromises)
      .finally(() => {
        setTimeout(checkFeeds, 5000);
      });
  };
  setTimeout(checkFeeds, 5000);
}

export default(elements, state) => {
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

  let rssLoaded = false;

  const validate = (url, feeds) => {
    const schema = getValidationSchema(feeds);
    return schema.validate({ url }, { abortEarly: false });
  };

  startRssUpdates(state);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = input.value.trim();

    try {
      await validate(url, state.feeds);

      state.form.valid = true;
      state.form.error = null;

      infoText.textContent = i18next.t('form.success');
      infoText.classList.remove('d-none', 'text-danger');
      infoText.classList.add('text-success');
      rssLoaded = true;
      input.setAttribute('readonly', true);

      fetch(getProxyUrl(url))
        .then((response) => {
          if (!response.ok) throw new Error('network');
          return response.json();
        })
        .then((data) => {
          let feed, posts;
          try {
            ({ feed, posts } = parseRss(data.contents));
          } catch (err) {
            if (err.isParsing) throw new Error('rss.invalid');
            throw err;
          }
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
              id: `post-${Date.now()}-${Math.random()}`
            });
          });

          form.reset();
          input.classList.remove('is-invalid');
          input.removeAttribute('readonly');
          input.focus();
        })
        .catch((err) => {
          let message;
          if (err.message === 'network') {
            message = i18next.t('network');
          } else if (err.message === 'rss.invalid') {
            message = i18next.t('rss.invalid');
          } else {
            message = i18next.t('form.errors.default');
          }
          state.form.valid = false;
          state.form.error = message;

          input.classList.add('is-invalid');
          infoText.textContent = message;
          infoText.classList.remove('d-none');
          infoText.classList.remove('text-success');
          infoText.classList.add('text-danger');

          input.removeAttribute('readonly');
        });
    } catch (err) {
      state.form.valid = false;
      const code = err.errors ? err.errors[0] : 'form.errors.default';
      const message = i18next.t(code);
      state.form.error = message;

      input.classList.add('is-invalid');
      infoText.textContent = message;
      infoText.classList.remove('d-none');
      infoText.classList.remove('text-success');
      infoText.classList.add('text-danger');
    }
  });

  input.addEventListener('input', async () => {
    const url = input.value.trim();
    try {
      await validate(url, state.feeds);
      state.form.valid = true;
      state.form.error = null;
      input.classList.remove('is-invalid');
      if (!rssLoaded) {
        infoText.classList.add('d-none');
      } else {
        infoText.textContent = i18next.t('form.success');
        infoText.classList.remove('d-none', 'text-danger');
        infoText.classList.add('text-success');
      }
    } catch (err) {
      state.form.valid = false;
      const code = err.errors ? err.errors[0] : 'form.errors.default';
      const message = i18next.t(code);
      state.form.error = message;
      input.classList.add('is-invalid');
      infoText.textContent = message;
      infoText.classList.remove('d-none');
      infoText.classList.remove('text-success');
      infoText.classList.add('text-danger');
    }
  });
};