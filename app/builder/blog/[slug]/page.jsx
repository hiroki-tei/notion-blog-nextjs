import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../../components/builder";

import {
  getDatabase, getBlocks, getPageFromSlug,
} from '../../../../lib/notion';

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export async function generateStaticParams() {
  const database = await getDatabase();
  return database?.map((page) => {
    const slug = page.properties.Slug?.formula?.string;
    return { id: page.id, slug };
  });
}

export default async function Page(props) {
  const page = await getPageFromSlug(props.params?.slug);
  const blocks = await getBlocks(page?.id);
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + "builder/" + "blog/" +(props?.params?.page?.join("/") || ""),
      },
    })
    // Convert the result to a promise
    .toPromise();

  const data = {
    page,
    blocks,
    article: {
      title: page.properties.Page.title[0].text.content
    }
  }

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}