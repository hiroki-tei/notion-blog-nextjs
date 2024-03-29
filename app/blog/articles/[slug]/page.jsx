import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@components/builder";
import { Refetch } from "@lib/components/support/cache";

import {
  getDatabase, getBlocks, getPageFromSlug, getPage
} from "@lib/notion";
import { forPublish } from "@lib/validator";

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export const dynamicParams = false
export const revalidate = 1800

export async function generateStaticParams() {
  const database = await getDatabase();

  return database
    .filter(forPublish)
    .map((page) => {
      const slug = page.properties.Slug?.rich_text[0].plain_text;
      return { slug };
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
        urlPath: "/" + "blog/" + "articles/" +(props?.params?.page?.join("/") || ""),
      },
    })
    // Convert the result to a promise
    .toPromise();

  const labelPagesPromises = page.properties.Label.relation.map(rel => rel.id)
    .map((pid) =>  getPage(pid))
  const labelPages = await Promise.all(labelPagesPromises)


  const data = {
    page,
    blocks,
    article: {
      title: page.properties.Page.title[0].text.content
    },
    tags: page.properties.Tags.multi_select.map(tag => tag.name),
    category: page.properties.Category.rollup.array.map(cat => cat.multi_select.map(each => each.name)).flat(),
    labels: labelPages.map(page => {
      return {
        uri: `/blog/labels/${page.properties["名前"].title[0].plain_text}`,
        name: page.properties["名前"].title[0].plain_text
      }
    })

  }

  return (
    <>
      <Refetch blocks={blocks} />
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}