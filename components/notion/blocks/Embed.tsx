import React, { useState, useEffect } from 'react';
import { fetchUrl } from '@actions/fetch'
import parse from 'html-react-parser';

export const Embed = ({ url }) => {
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

  const codeBody = gistContent?.div?.match(/<table.*>[\s\S]*<\/table>/) ?? ''

  return (
    <>
      <link rel="stylesheet" type="text/css" href={gistContent?.stylesheet} />
      <div className='gist'>
        <div className="js-check-bidi js-blob-code-container blob-code-content blob-wrapper">
          {parse(codeBody?.[0] ?? '')}
        </div>
      </div>
    </>
  )
}
