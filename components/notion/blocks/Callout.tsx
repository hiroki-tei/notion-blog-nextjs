import React, { useState, useEffect } from 'react';
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@components/builder";

export const Callout = ({ text }) => {
  const [content, setContent] = useState({})
  useEffect(() => {
    builder
      // Get the page content from Builder with the specified options
      .get("callout", {
        userAttributes: {
          // Use the page path specified in the URL to fetch the content
          urlPath: "/blog"
        },
      })
      .toPromise()
      .then((content) => setContent(content))
  })
  const data = {
    text
  }
  return <RenderBuilderContent content={content} data={data} model='section' />
}