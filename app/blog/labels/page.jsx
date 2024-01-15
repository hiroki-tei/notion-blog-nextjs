import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../../components/builder";

import {
  listPagesFromLabel
} from '../../../../lib/notion';

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export default async function Page(props) {
  const label = decodeURIComponent("Geo")
  const pages = await listPagesFromLabel(label);
  const data = {
    page:
      pages
        .filter(page => page?.properties?.Slug?.rich_text?.length > 0)
        .map(page=> {
          const slug = page.properties.Slug.rich_text[0].plain_text
            return {
              slug,
              title: page.properties.Page.title[0].plain_text,
              url: `/builder/blog/${slug}`,
              date: page.properties.Date.date.start // yyyy-mm-dd
            }
        }),
    label
  }
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

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}