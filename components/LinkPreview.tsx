import React, { useState, useEffect } from 'react';
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "./builder";
import { fetchOgp } from '../app/actions/fetch-ogp';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

const LinkPreview = ({ url }) => {
  const [ogp, setOgp] = useState<OGP>()
  const [content, setContent] = useState({})

  const fetchOgpReady = fetchOgp.bind(null, url)

  useEffect(() => {
    fetchOgpReady().then((res) => setOgp(res))
  }, [])
  useEffect(() => {
    builder
      // Get the page content from Builder with the specified options
      .get("link-preview", {
        userAttributes: {
          // Use the page path specified in the URL to fetch the content
          urlPath: "/builder/blog"
        },
      })
      .toPromise()
      .then((content) => setContent(content))
  }, [])


  const data = {
    ogp
  }

  return (
    <>
      <RenderBuilderContent content={content} data={data} />
    </>
  )
}

export default LinkPreview

type OGP = {
  url: URL
  images: Array<URL>
  videos: Array<URL>
  title: string
  siteName: string
  description: string
  mediaType: string
}
