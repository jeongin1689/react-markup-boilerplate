import pageIds from '../generated/pages.json'

const pageMetadata = {
  '@button': ['버튼', 'component'],
  '01_01_home': ['홈', 'page'],
}

function inferKind(id) {
  if (id.startsWith('@')) return 'component'
  return 'page'
}

export const pages = pageIds.map((id) => {
  const [title = id, kind = inferKind(id)] = pageMetadata[id] ?? []
  return { id, title, kind, outputPath: `views/${id}.html` }
})
