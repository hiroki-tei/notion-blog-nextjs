import React, { useState, useEffect, useRef, useMemo, memo, createElement } from 'react';
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

  const alternate = (arr1, arr2) => {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
      result.push(arr1[i], arr2[i]);
    }
    return result;
  }

  const buildFileNameElement = (nodes: NodeListOf<Element>) => {
    return Array.from(nodes).map((node) => {
      // second element contains file name
      const fileName = node.children[1].textContent
      const newDiv = document.createElement('div')
      newDiv.attributeStyleMap.set('line-height', '0.5')
      const fileNameNode = document.createTextNode(fileName);
      newDiv.appendChild(fileNameNode)
      return newDiv
    })
  }

  return (
    <>
      <link rel="stylesheet" type="text/css" href={gistContent?.stylesheet} />
      <div className="gist" ref={ref => {
        if (ref) {
          const gistFile = ref?.querySelectorAll('.gist-file');
          const gistData = ref?.querySelectorAll('.gist-data .js-check-bidi');
          gistData.forEach(gist => {
            gist.setAttribute('style', 'line-height: 0.3;')
          })

          const gistMeta = ref?.querySelectorAll('.gist-meta');
          const fileNameElem = buildFileNameElement(gistMeta);
          gistData.forEach(el => el.classList.add('blob-wrapper'))
          gistFile.length && ref?.replaceChildren(...alternate(gistData, fileNameElem))
        }
      }}>
        {gistContent?.element}
      </div>
    </>
  )
}