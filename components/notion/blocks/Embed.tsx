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
      console.log(data)
      setGistContent(data)
    })
  }, [])

  return (
    <div>{gistContent.div}</div>
  )

}