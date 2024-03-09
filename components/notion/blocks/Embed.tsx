import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
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
  const [gistContent, setGistContent] = useState<{element: any, stylesheet: string}>()
  const [gistElementEntry, setGistElementEntry] = useState<any>()
  const fetchGist = fetchUrl.bind(null, urlTarget)
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    fetchGist().then( data => {
      setGistContent({
        element: parse(data.div),
        stylesheet: data.stylesheet
      })
    })
  }, [])

  //const codeSpace: Array<string> | null = gistContent?.div?.match(/<table.*>[\s\S]*?<\/table>/g)

  return (
    <>
      <link rel="stylesheet" type="text/css" href={gistContent?.stylesheet} />
      <div className="gist" ref={ref => {
        if (ref) {
          const gistFile = ref?.querySelectorAll('.gist-file');
          const gistData = ref?.querySelectorAll('.gist-data .js-check-bidi');
          console.log(gistData)
          const gistMeta = ref?.querySelectorAll('.gist-meta');
          gistData.forEach(el => el.classList.add('blob-wrapper'))
          gistFile.length && ref?.replaceChildren(...gistData)
        }
      }}>
        {gistContent?.element}
      </div>
    </>
  )
}