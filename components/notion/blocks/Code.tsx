import { useState, useEffect } from 'react'
import { codeToHtml } from 'shiki'
import parse from 'html-react-parser';


export const Code = ({language, codeText}) => {
  const [html, setHtml] = useState<string>()
  const notionLang = language
  console.log(notionLang, html)
  useEffect(() => {
    codeToHtml(codeText, {
      lang: notionLang,
      theme: 'vitesse-dark'
    }).then(html =>
      setHtml(html)
    )
  },[])
  return parse(html)
}