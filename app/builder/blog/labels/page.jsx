import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../../components/builder";

import {
  getDatabase, getBlocks, getPageFromSlug, getPage
} from '../../../../lib/notion';

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export default async function Page(props) {
  const database = await getDatabase();
  /* eslint-disable implicit-arrow-linebreak, comma-dangle, function-paren-newline */
  const posts = database.filter((post) =>
    post.properties.Slug?.rich_text.length > 0 && post.properties.Published?.checkbox === true
  );
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + "builder/" + "blog/" + "labels/" +(props?.params?.page?.join("/") || ""),
      },
    })
    // Convert the result to a promise
    .toPromise();

  const data = {
  }

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}