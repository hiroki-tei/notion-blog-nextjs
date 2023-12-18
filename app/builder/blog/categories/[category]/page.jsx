import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../../../components/builder";

import {
  listLabelsFromCategory, ARTICLE_CATEGORIES
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

  const data = {
    category: props.params?.category,
    labels
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