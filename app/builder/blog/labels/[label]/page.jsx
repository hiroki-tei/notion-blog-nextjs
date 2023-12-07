import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../../../components/builder";

import {
  getTagLibraryDatabase, listPagesFromLabel
} from '../../../../../lib/notion';

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export async function generateStaticParams() {
  const database = await getTagLibraryDatabase();

  return database?.map((page) => {
    const label = page.properties["名前"]?.formula?.string;
    return { id: page.id, label };
  });
}

export default async function Page(props) {
  const pages = await listPagesFromLabel(decodeURIComponent(props.params?.label));

  const data = {
    page: pages.map(page=> ({
      slug: page.properties.Slug.rich_text[0].plain_text,
      title: page.properties.Page.title[0].plain_text
    }))
  }
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + "builder/" + "blog/" + "labels/" + (props?.params?.page?.join("/") || ""),
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