import i18next from 'i18next'

const resources = {
  ru: {
    translation: {
      'form.placeholder': 'Ссылка RSS',
      'form.add': 'Добавить',
      'form.example': 'Пример: https://lorem-rss.hexlet.app/feed',
      'form.success': 'RSS успешно загружен',
      'form.errors.required': 'Заполни это поле',
      'form.errors.url': 'Ссылка должна быть валидным URL',
      'form.errors.notOneOf': 'RSS уже существует',
      'form.errors.default': 'Ошибка валидации',
      'modal.title': 'Заголовок',
      'modal.fullArticle': 'Просмотр',
      'modal.close': 'Закрыть',
      'feeds.title': 'Фиды',
      'posts.title': 'Посты',
      'rss.invalid': 'Ресурс не содержит валидный RSS',
      'network': 'Ошибка сети',
    },
  },
}

const i18nInstance = i18next.createInstance()

export default () =>
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })

export { i18nInstance as i18next }