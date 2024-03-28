import React, { useState, useEffect } from 'react';
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "./builder";
import { fetchOgp } from '@actions/fetch';

type Props = {
  url: string
  disp: 'card' | 'inline'
}

const LinkPreview = ({ url, disp }: Props) => {
  // Parent components sometimes gives null url because it asyncronously fetches URL
  // So here we should consider waiting them fetching correct URL
  // In waiting time, here we assume they provide undefined so we skip rendering
  if (!url) {
    return null
  }
  const [ogp, setOgp] = useState<OGP>()
  const [content, setContent] = useState({})

  const fetchOgpReady = fetchOgp.bind(null, url)

  useEffect(() => {
    fetchOgpReady().then((res) => setOgp(res))
  }, [])
  useEffect(() => {
    builder
      // Get the page content from Builder with the specified options
      .get('link-preview', {
        query: {
          name: {
            $eq: getBuilderElement(disp)
          }
        },
        userAttributes: {
          // Use the page path specified in the URL to fetch the content
          urlPath: "/blog"
        },
      })
      .toPromise()
      .then((content) => setContent(content))
  }, [])

  const setOGPDefault = ( arg: OGP ) => {
    const noContent = ['/notfound.svg']
    const noTitle = 'No Title'
    const noDescription = 'No Description'
    return {
      images: arg?.images.length ? arg?.images : noContent,
      videos: arg?.videos.length ? arg?.videos : noContent,
      title: arg?.title || arg?.url || noTitle,
      description: arg?.description || noDescription,
    }
  }

  const data = {
    ogp: {
      url,
      ...setOGPDefault(ogp)
    }
  }

  return (
    <>
      <RenderBuilderContent content={content} data={data} model='section' />
    </>
  )
}

export default LinkPreview

type OGP = {
  url: URL
  images: Array<string>
  videos: Array<string>
  title: string
  siteName: string
  description?: string
  mediaType: string
} | undefined

const getBuilderElement = (disp) => {
  switch (disp) {
    case 'card':
      return 'link-preview'
    case 'inline':
      return 'link-preview-inline'
    default:
      return undefined
  }
}