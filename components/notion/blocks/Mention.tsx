import { useState, useEffect } from 'react';
import { getPageAction } from '../../../app/actions/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import LinkPreview from '../../LinkPreview';

export const Mention = ({
  type,
  pageID
}) => {
  switch (type) {
    // when page mention, show URL attched to mentioned page as link preview
    case 'page':
      const [page, setPage] = useState<PageObjectResponse>()
      useEffect(() => {
        getPageAction(pageID)
          .then(response => setPage(response))
      }, [])
      return <LinkPreview url={page?.properties?.URL?.['url'] ?? undefined} />

    case 'user':
    default:
      console.warn('unsupported')
      return <></>
  }
}
