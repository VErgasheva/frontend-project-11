import * as yup from 'yup'
import { i18next } from './i18n.js'
import parseRss from './rssParser.js'

yup.setLocale({
  mixed: {
    required: 'form.errors.required',
    notOneOf: 'form.errors.notOneOf',
  },
  string: {
    url: 'form.errors.url',
  },
})

const getValidationSchema = feeds =>
  yup.object().shape({
    url: yup
      .string()
      .required('form.errors.required')
      .url('form.errors.url')
      .notOneOf(feeds.map(f => f.url), 'form.errors.notOneOf'),
  })

const getProxyUrl = url =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

function processFeedUpdate(feed, state) {
  return fetch(getProxyUrl(feed.url))
    .then(response => response.json())
    .then((data) => {
      const { posts } = parseRss(data.contents)
      const existingLinks = state.posts
        .filter(p => p.feedId === feed.id)
        .map(p => p.link)

      const newPosts = posts
        .filter(post => !existingLinks.includes(post.link))
        .map(post => ({
          ...post,
          feedId: feed.id,
          id: `post-${Date.now()}-${Math.random()}`,
        }))

      if (newPosts.length > 0) {
        state.posts.push(...newPosts)
      }
    })
    .catch((err) => {
      console.error('Ошибка обновления RSS-ленты:', err)
    })
}
function startRssUpdates(state) {
  const update = () => {
    if (state.feeds.length === 0) {
      setTimeout(update, 5000)
      return
    }
    const feedPromises = state.feeds.map(feed => processFeedUpdate(feed, state))
    Promise.all(feedPromises).finally(() => {
      setTimeout(update, 5000)
    })
  }
  setTimeout(update, 5000)
}

function validateForm(url, feeds) {
  const schema = getValidationSchema(feeds)
  return schema.validate({ url }, { abortEarly: false })
}

function loadRss(url, state) {
  return fetch(getProxyUrl(url))
    .then((response) => {
      if (!response.ok) throw new Error('network')
      return response.json()
    })
    .then((data) => {
      let feed, posts
      try {
        ({ feed, posts } = parseRss(data.contents))
      }
      catch (err) {
        if (err.isParsingError) throw new Error('rss.invalid')
        throw err
      }
      const feedId = `feed-${Date.now()}-${Math.random()}`
      const feedData = {
        id: feedId,
        url,
        title: feed.title,
        description: feed.description,
      }
      state.feeds.push(feedData)
      posts.forEach((post) => {
        state.posts.push({
          ...post,
          feedId,
          id: `post-${Date.now()}-${Math.random()}`,
        })
      })
    })
}

export default (elements, state) => {
  const { form, input } = elements

  startRssUpdates(state)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = input.value.trim()

    validateForm(url, state.feeds)
      .then(() => {
        state.form.valid = true
        state.form.error = null

        input.setAttribute('readonly', true)
        form.querySelector('button[type="submit"]').setAttribute('disabled', true)

        return loadRss(url, state)
      })
      .then(() => {
        form.reset()
        state.form.valid = true
        state.form.error = null
        state.form.success = i18next.t('form.success')
        input.removeAttribute('readonly')
        form.querySelector('button[type="submit"]').removeAttribute('disabled')
        input.value = ''
        input.focus()
      })
      .catch((err) => {
        let message
        if (err.message === 'network' || err instanceof TypeError) {
          message = i18next.t('network')
        }
        else if (err.message === 'rss.invalid') {
          message = i18next.t('rss.invalid')
        }
        else if (err.errors && err.errors[0]) {
          message = i18next.t(err.errors[0])
        }
        else {
          message = i18next.t('form.errors.default')
        }
        state.form.valid = false
        state.form.error = message
        state.form.success = null
        input.removeAttribute('readonly')
        form.querySelector('button[type="submit"]').removeAttribute('disabled')
      })
  })
}
