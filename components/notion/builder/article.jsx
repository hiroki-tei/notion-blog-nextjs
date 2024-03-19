'use client';
import { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Text from '@components/text';
import { Block } from '@components/notion/builder/renderer';
import styles from '@styles/builder/post.module.css';

export function Article({page, blocks}) {
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
          {blocks?.map((block) => (
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
