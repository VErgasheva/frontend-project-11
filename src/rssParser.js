export default function parseRss(xmlString) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    const error = new Error('Parse error')
    error.isParsingError = true
    throw error
  }

  const feedTitle = doc.querySelector('channel > title')?.textContent ?? ''
  const feedDescription = doc.querySelector('channel > description')?.textContent ?? ''

  const items = Array.from(doc.querySelectorAll('channel > item'))
  const posts = items.map(item => ({
    title: item.querySelector('title')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
  }))

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  }
}
