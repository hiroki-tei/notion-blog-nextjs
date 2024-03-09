import React, { useState, useEffect } from 'react';
import { fetchUrl } from '@actions/fetch'
import parse from 'html-react-parser';

export const Embed = ({ url }) => {
  switch (true) {
    case url.match(/https:\/\/gist\.github\.com\/.*/) != null:
      return (
        <Gist url={url} />
      )
    default:
      console.error('Invalid URL in Embed.tsx')
      return null
  }
}

const Gist = ({ url }) => {
  const id = url.match(/(\.com\/)(.*?)([^#]+)/)?.pop() ?? null
  const file = url.split('#').pop()
  const fileQS = file.match(/file*/)
    ? `&file=${file.replace('file-', '').replace('-', '.')}`
    : ''
  const urlTarget = `https://gist.github.com/${id}.json${fileQS}`
  const [gistContent, setGistContent] = useState<any>()
  const fetchGist = fetchUrl.bind(null, urlTarget)
  useEffect(() => {
    fetchGist().then( data => {
      setGistContent(data)
    })
  }, [])

  const codeSpace: Array<string> | null = gistContent?.div?.match(/<table.*>[\s\S]*?<\/table>/g)

  return (
    <>
      <link rel="stylesheet" type="text/css" href={gistContent?.stylesheet} />
        <div className='gist'>
        {codeSpace?.map( cSpace => {
          return (
            <div className="js-check-bidi js-blob-code-container blob-code-content blob-wrapper">
              {parse(cSpace ?? '')}
            </div>
          )
        })}
        </div>
    </>
  )
}