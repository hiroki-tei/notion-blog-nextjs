import { useState, useEffect } from 'react';
import { getPageAction } from '@actions/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import LinkPreview from '@components/LinkPreview';

type PageMention = {
  type: 'page'
  pageID: string
}
type LinkPreviewMention = {
  type: 'link_preview'
  url: string
}
type Props = PageMention | LinkPreviewMention

export const Mention = (props : Props)=> {
  switch (props.type) {
    // when page mention, show URL attched to mentioned page as link preview
    case 'page':
      const [page, setPage] = useState<PageObjectResponse>()
      useEffect(() => {
        getPageAction(props.pageID)
          .then(response => setPage(response))
      }, [])
      return <LinkPreview url={page?.properties?.URL?.['url'] ?? undefined} disp='card' />

    case 'link_preview':
      return <LinkPreview url={props.url} disp='card' />

    default:
      console.warn('unsupported')
      return <></>
  }
}


