import { Fragment, useState } from 'react';
import Link from 'next/link';

import Text from '../../text';
import styles from '../../../styles/builder/post.module.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export function Block({block}) {
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
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
    case 'code':
      const notionLang = value.language
      return (
        <SyntaxHighlighter language={notionLang} style={monokaiSublime}>
          {value.rich_text[0].plain_text}
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
      const href = value.url;
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={styles.bookmark}>
          {href}
        </a>
      );
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
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
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