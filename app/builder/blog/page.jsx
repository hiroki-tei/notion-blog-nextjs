import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../components/builder";
import {
  getBlocks, getPageFromSlug, getPage
} from '../../../lib/notion';

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

export default async function Page(props) {
  const page = await getPageFromSlug("qgis-python-add-layer-into-only-specified-group")
  const blocks = await getBlocks(page?.id);
  const content = await builder
    // Get the page content from Builder with the specified options
    .get("page", {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: "/" + "builder/" + (props?.params?.page?.join("/") || ""),
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
      title: "タイトルタイトルタイトル"
    },
    tags: page.properties.Tags.multi_select.map(tag => tag.name),
    category: page.properties.Category.rollup.array.map(cat => cat.multi_select.map(each => each.name)).flat(),
    labels: labelPages.map(page => page.properties["名前"].title[0].plain_text)
  }

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}
