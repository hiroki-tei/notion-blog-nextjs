import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../../../components/builder";

import {
  listLabelsFromCategory, getPagesWithURI, ARTICLE_CATEGORIES
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
  const labelsWithPageIDs = await listLabelsFromCategory(props.params?.category);

  const labelWithPages = await Promise.all(labelsWithPageIDs.flatMap(async (lbl) => {
    const pages = await getPagesWithURI(lbl.articles)
    return {
      name: lbl.name,
      articles: pages
    }
  }))

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