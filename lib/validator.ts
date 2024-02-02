export const forPublish = (page) => {
  return !!(page?.properties?.Published?.checkbox)
  && !!(page?.properties?.Slug?.rich_text[0]?.plain_text)
  && !!(page.properties.Date.date?.start)
}
