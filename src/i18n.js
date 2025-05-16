import i18next from 'i18next';

const resources = {
  ru: {
    translation: {
      'form.placeholder': 'Ссылка RSS',
      'form.add': 'Добавить',
      'form.example': 'Пример: https://ru.hexlet.io/lessons.rss',
      'form.success': 'RSS успешно добавлен',
      'form.errors.required': 'Введите адрес',
      'form.errors.url': 'Некорректный адрес',
      'form.errors.notOneOf': 'RSS уже добавлен',
      'form.errors.default': 'Ошибка валидации',
      'modal.title': 'Заголовок',
      'modal.fullArticle': 'Читать полностью',
      'modal.close': 'Закрыть',
      'feeds.title': 'Фиды',
      'posts.title': 'Посты',
    },
  },
  en: {
    translation: {
      'form.placeholder': 'RSS link',
      'form.add': 'Add',
      'form.example': 'Example: https://ru.hexlet.io/lessons.rss',
      'form.success': 'RSS successfully added',
      'form.errors.required': 'Enter address',
      'form.errors.url': 'Invalid URL',
      'form.errors.notOneOf': 'RSS already added',
      'form.errors.default': 'Validation error',
      'modal.title': 'Modal title',
      'modal.fullArticle': 'Full Article',
      'modal.close': 'Close',
      'feeds.title': 'Feeds',
      'posts.title': 'Posts',
    },
  },
};

const i18nInstance = i18next.createInstance();

export default () =>
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

export { i18nInstance as i18next };