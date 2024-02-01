interface Array<T> {
  filterForPublish: () => {}
}
Array.prototype.filterForPublish = function () {
  return this
    .filter(page => page?.properties?.Published?.checkbox)
    .filter(page => !!(page?.properties?.Slug?.rich_text[0]?.plain_text))
}
