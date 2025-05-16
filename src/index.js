import  './styles.scss';
import  'bootstrap';
import initView from './view.js';
import initLogic from './logic.js';

document.addEventListener('DOMContentLoaded', () => {
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