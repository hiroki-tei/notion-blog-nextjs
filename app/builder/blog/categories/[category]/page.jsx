import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../../../components/builder";

import {
  listLabelsFromCategory, pagesIntoURI, ARTICLE_CATEGORIES
} from '../../../../../lib/notion';

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

<<<<<<< HEAD
  const articleItemLimit = 3
  const labelWithPages = await Promise.all(
    labels.flatMap(async (lbl) => {
      let pages = await pagesIntoURI(lbl.articles, articleItemLimit)
      pages = pages
        .filter(page => {
          const slug = page?.properties?.Slug?.rich_text[0]?.plain_text
          return !!slug
        })
        .map(page => {
          return {
            uri: `/builder/blog/${page.properties.Slug.rich_text[0].plain_text}`,
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
=======
  const labelWithPages = await Promise.all(labelsWithPageIDs.flatMap(async (lbl) => {
    const pages = await pagesIntoURI(lbl.articles, 5)
    return {
      name: lbl.name,
      icon: lbl.icon,
      articles: pages
    }
  }))
>>>>>>> master

  const data = {
    category: props.params?.category,
    label: labelWithPages
  }
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + "builder/" + "blog/" + "categories/" +(props?.params?.page?.join("/") || ""),
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