import React from 'react';
import { RenderBuilderContent } from "./builder";
import { builder } from "@builder.io/sdk";
import { fetchOgp } from '../app/actions/fetch-ogp';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

type Props = {
  url: string
}

export default async function LinkPreview ({
  url
}: Props) {

  const fetchOgpReady = fetchOgp.bind(null, url)

  const ogp = await fetchOgpReady()
  console.log(ogp)

  const content = await builder.get("link-preview", {
    userAttributes: {
      urlPath: "/" + "builder/" + "blog/" + "langchain-prompttemplate-write-json-bug"
    },
    prerender: false
  }).toPromise()
  console.log(content)
  const data = ogp

  return (
    <>
      <RenderBuilderContent key="link-preview" content={content} data={data} />
    </>
  )

}