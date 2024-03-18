'use client';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Text from '@components/text';
import { Block } from '@components/notion/builder/renderer';
import styles from '@styles/builder/post.module.css';
import { getBlockAction } from "@actions/notion";

export function Article({page, blocks}) {
  const [refetchedBlocks, setBlocks] = useState(null)
  useEffect(() => {
    if (isExpired(blocks)) {
      const blcks = getBlockAction(page.id)
      .then(data => {
        setBlocks(data)
      })
    }
  }, [])

  const blocksToRender = refetchedBlocks || blocks

  return (
    <div>
      <Head>
        <title>{page?.properties?.Title?.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className={styles.container}>
        <h1 className={styles.name}>
          <Text title={page?.properties?.Title?.title} />
        </h1>
        <section>
          {blocksToRender?.map((block) => (
            <Fragment key={block.id}><Block block={block} /></Fragment>
          ))}
          <Link href="/blog/top" className={styles.back}>
            ← Go home
          </Link>
        </section>
      </article>
    </div>
  )
}

const isExpired = (blocks) => {
  return blocks.some((block) => {
    if (block.type == 'image' && block.image.type == 'file') {
      const expiryTime = block.image.file.expiry_time
      if (Date.parse(expiryTime) < Date.now()) {
        return true
      }
    }
  })
}