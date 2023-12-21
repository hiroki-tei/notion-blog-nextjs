import React, {useEffect, useState} from 'react';
import { RenderBuilderContent } from "./builder";
import { builder } from "@builder.io/sdk";
import { fetchOgp } from '../app/actions/fetch-ogp';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

type Props = {
  url: string
}

export function LinkPreview ({
  url
}: Props): React.FC {
  const [ogp, setOgp] = useState({})
  const [content, setContent] = useState({})

  const fetchOgpReady = fetchOgp.bind(null, url)
  useEffect(() => {
    fetchOgpReady().then(response => {
      !ogp && setOgp(response)
    })
    //builder.get("link-preview", {
    //  userAttributes: {
    //    urlPath: "/" + "builder/" + "blog/"
    //  }
    //}).then(data => {
    //  !content && setContent(data)
    //})
  }, [ogp])
  const data = {}
  return (
    <RenderBuilderContent model="link-preview" content={content} />
  )
}