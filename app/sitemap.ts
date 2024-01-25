import { MetadataRoute } from 'next';
import { ARTICLE_CATEGORIES, getDatabase } from '@lib/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const lastModified = new Date();

  const staticPaths = ARTICLE_CATEGORIES.map( category => {
    return {
      url: `${baseUrl}/blog/categories/${category.name}`,
      lastModified
    }
  })

  const database = await getDatabase()

  const articlePaths = database
      .filter(page => {
        // TODO: type check
        const p = page as PageObjectResponse
        return p.properties.Published?.type == 'checkbox'
          ? p.properties.Published.checkbox // bool
          : false
      })
      .filter(page => {
        // TODO: type check
        const p = page as PageObjectResponse
        return p.properties.Slug?.type == 'rich_text'
          ? p.properties.Slug?.rich_text[0]?.plain_text.length > 0// bool
          : false

      })
      .map(page => {
        // TODO: type check
        const p = page as PageObjectResponse
        return p.properties.Slug?.type == 'rich_text'
          ?
            {
              url: p.properties.Slug.rich_text[0].plain_text,
              lastModified
            }
          : null
      })

  return [...staticPaths, ...articlePaths]
}