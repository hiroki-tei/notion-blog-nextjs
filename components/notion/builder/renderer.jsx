import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';

import Text from '@components/text';
import LinkPreview from '@components/LinkPreview'
import styles from '@styles/builder/post.module.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { Callout } from '@components/notion/blocks/Callout';
import { Embed } from '@components/notion/blocks/Embed';
import { Video } from '@components/notion/blocks/Video';
import { getSingleBlockAction } from "@actions/notion";

export function Block({block}) {
  // https://developers.notion.com/reference/block
  const { type, id } = block;
  const value = block[type];
  const [sibling, setSibling] = useState()

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text title={value.rich_text} />
        </p>
      );
    case 'heading_1':
      return (
        <div ref={(node) => {setSibling(node?.previousElementSibling)}} className={styles.heading} >
          <h1>
            <Text title={value.rich_text} />
          </h1>
        </div>
      );
    case 'heading_2':
      return (
        <div ref={(node) => {setSibling(node?.previousElementSibling)}} className={provideSpaceBetweenHeading(sibling, styles)} >
          <h2>
            <Text title={value.rich_text} />
          </h2>
        </div>
      );
    case 'heading_3':
      return (
        <div ref={(node) => {setSibling(node?.previousElementSibling)}}>
          <h3>
            <Text title={value.rich_text} />
          </h3>
        </div>
      );
    case 'bulleted_list': {
      return <ul>{value.children.map((child) => <Block block={child}/>)}</ul>;
    }
    case 'numbered_list': {
      return <ol>{value.children.map((child) => <Block block={child}/>)}</ol>;
    }
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li key={block.id}>
          <Text title={value.rich_text} />
          {/* eslint-disable-next-line no-use-before-define */}
          {!!value.children && renderNestedList(block)}
        </li>
      );
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />
            {' '}
            <Text title={value.rich_text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <Text title={value.rich_text} />
          </summary>
          {block.children?.map((child) => (
            <Fragment key={child.id}><Block block={child} /></Fragment>
          ))}
        </details>
      );
    case 'child_page':
      return (
        <div className={styles.childPage}>
          <strong>{value?.title}</strong>
          {block.children.map((child) => <Block block={child} />)}
        </div>
      );
    case 'image': {
      const [refetchedBlock, setBlocks] = useState(null)
      useEffect(() => {
        if (isExpired(block)) {
          const blcks = getSingleBlockAction(block.id)
          .then(data => {
            setBlocks(data)
          })
        }
      }, [block.id])
      const blockToRender = refetchedBlock || block
      const value = blockToRender[type];
      const src = value?.type === 'external' ? value?.external?.url : value?.file?.url;
      const caption = value?.caption ? value?.caption[0]?.plain_text : '';
      return (
        <figure>
          <a href={src}>
            <img src={src} alt={caption} />
          </a>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return <blockquote key={id}>{value.rich_text[0]?.plain_text}</blockquote>;
    case 'code':
      const notionLang = value.language
      const code = value?.rich_text.reduce((acc, cur) => {
        acc += cur.plain_text
        return acc
      }, "")

      return (
        <SyntaxHighlighter language={notionLang} style={a11yDark} className={styles.code_block}>
          {code}
        </SyntaxHighlighter>
      );
    case 'file': {
      const srcFile = value.type === 'external' ? value.external.url : value.file.url;
      const splitSourceArray = srcFile.split('/');
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const captionFile = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          <div className={styles.file}>
            📎
            {' '}
            <Link href={srcFile} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {captionFile && <figcaption>{captionFile}</figcaption>}
        </figure>
      );
    }
    case 'bookmark': {
      return <LinkPreview url={block.bookmark.url} disp='card' />
    }
    case 'table': {
      return (
        <table className={styles.table}>
          <tbody>
            {block.children?.map((child, index) => {
              const RowElement = value.has_column_header && index === 0 ? 'th' : 'td';
              return (
                <tr key={child.id}>
                  {child.table_row?.cells?.map((cell, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <RowElement key={`${cell.plain_text}-${i}`}>
                      <Text title={cell} />
                    </RowElement>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    case 'column_list': {
      return (
        <div className={styles.row}>
          {block.children.map((childBlock) => <Block block={childBlock} />)}
        </div>
      );
    }
    case 'column': {
      return <div>{block.children.map((child) => <Block block={child} />)}</div>;
    }

    case 'video': {
      return <Video data={block.video} />
    }

    case 'link_preview': {
      return <LinkPreview url={block.link_preview.url} disp='card' />
    }

    case 'callout': {
      return <Callout text={block.callout.rich_text[0].plain_text} />
    }

    case 'embed': {
      return <Embed url={block.embed.url} />
    }

    default:
      console.warn(
        `❌ Unsupported block (${
          type === 'unsupported' ? 'unsupported by Notion API' : type
        })`
      )
      return null
  }
}

export function renderNestedList(blocks) {
  const { type } = blocks;
  const value = blocks[type];
  if (!value) return null;

  const isNumberedList = value.children[0].type === 'numbered_list_item';

  if (isNumberedList) {
    return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
  }
  return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
}

function provideSpaceBetweenHeading(sibling, styles) {
  return !(sibling?.tagName in ['h1', 'h2', 'h3']) ? styles.heading : ''
}

const isExpired = (block) => {
  if (block.type == 'image' && block.image.type == 'file') {
    const expiryTime = block.image.file.expiry_time
    if (Date.parse(expiryTime) < Date.now()) {
      return true
    }
  }
}