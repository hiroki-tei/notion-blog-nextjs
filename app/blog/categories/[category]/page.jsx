import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@components/builder";

import {
  listLabelsFromCategory, getPage, ARTICLE_CATEGORIES
} from '@lib/notion';
import { forPublish } from "@lib/validator";

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export async function generateStaticParams() {
  return ARTICLE_CATEGORIES.map(category => {
    return {
      category: category.name
    }
  })
}


export default async function Page(props) {
  /* eslint-disable implicit-arrow-linebreak, comma-dangle, function-paren-newline */
  const labels = await listLabelsFromCategory(props.params?.category);

  const articleItemLimit = 3
  const labelWithPages = await Promise.all(
    labels.flatMap(async (lbl) => {
      const pageResults = await Promise.all(
        lbl.articles
          .map(page => getPage(page))
      )
      const pages = pageResults
        .filter(forPublish)
        .slice(0, articleItemLimit)
        .map(page => {
          return {
            uri: `/blog/articles/${page.properties.Slug.rich_text[0].plain_text}`,
            title: page?.properties?.Page?.title[0]?.text?.content,
          }
        })

      return {
        name: lbl.name,
        icon: lbl.icon,
        articles: pages
      }
    })
  ).then((lbls) => {
    return lbls.filter(lbl => lbl.articles.length > 0)
  })

  const data = {
    category: props.params?.category,
    label: labelWithPages
  }
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + "blog/" + "categories/" +(props?.params?.page?.join("/") || ""),
      },
    })
    // Convert the result to a promise
    .toPromise();

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}