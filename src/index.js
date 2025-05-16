import './styles.scss';
import 'bootstrap';
import initView from './view.js';
import initLogic from './logic.js';
import initI18n, { i18next } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initI18n();

  document.getElementById('url_input').placeholder = i18next.t('form.placeholder');
  document.getElementById('add_button').textContent = i18next.t('form.add');
  document.getElementById('example_text').textContent = i18next.t('form.example');
  document.getElementById('feeds_title').textContent = i18next.t('feeds.title');
  document.getElementById('posts_title').textContent = i18next.t('posts.title');
  document.getElementById('modal_title').textContent = i18next.t('modal.title');
  document.getElementById('modal_link').textContent = i18next.t('modal.fullArticle');

  const modalClose = document.querySelector('#modal .btn-secondary');
  if (modalClose) modalClose.textContent = i18next.t('modal.close');

  const elements = {
    form: document.getElementById('main_form'),
    input: document.getElementById('url_input'),
    infoText: document.getElementById('info_text'),
  };

  const state = {
    feeds: [],
    form: {
      valid: true,
      error: null,
    },
  };

  initView(elements, state);
  initLogic(elements, state);
});