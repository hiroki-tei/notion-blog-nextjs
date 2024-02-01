import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@components/builder";

import {
  getDatabase, ARTICLE_CATEGORIES
} from '@lib/notion';

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export default async function Page(props) {
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + "blog/" + "top"
      },
    })
    // Convert the result to a promise
    .toPromise();

  const data = {
    categories: ARTICLE_CATEGORIES
  }

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}