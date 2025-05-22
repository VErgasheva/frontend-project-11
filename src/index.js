import './styles.scss'
import 'bootstrap'
import initI18n, { i18next } from './i18n.js'
import initLogic from './logic.js'
import createWatcher from './watcher.js'

document.addEventListener('DOMContentLoaded', async () => {
  await initI18n()

  document.getElementById('url-input').placeholder = i18next.t('form.placeholder')
  document.querySelector('button[type="submit"]').textContent = i18next.t('form.add')
  document.getElementById('example_text').textContent = i18next.t('form.example')
  document.getElementById('feeds_title').textContent = i18next.t('feeds.title')
  document.getElementById('posts_title').textContent = i18next.t('posts.title')
  document.querySelector('#modal .full-article').textContent = i18next.t('modal.fullArticle')
  document.querySelector('#modal .btn-secondary').textContent = i18next.t('modal.close')

  const elements = {
    form: document.getElementById('main_form'),
    input: document.getElementById('url-input'),
    infoText: document.getElementById('info_text'),
    feedsBlock: document.querySelector('.feeds'),
    postsBlock: document.querySelector('.posts'),
  }

  const state = {
    feeds: [],
    posts: [],
    readPosts: new Set(),
    form: {
      valid: true,
      error: null,
    },
  }

  const watchedState = createWatcher(state, elements)
  initLogic(elements, watchedState)
})
