import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../../components/builder";
import {
  getBlocks, getPageFromSlug,
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

  const data = {
    page,
    blocks,
    article: {
      title: "タイトルタイトルタイトル"
    }
  }

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} data={data} />
    </>
  );
}
