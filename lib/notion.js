import { Client } from '@notionhq/client';
import { cache } from 'react';

export const revalidate = 3600; // revalidate the data at most every hour

const databaseId = process.env.NOTION_DATABASE_ID;
const tagLibraryDBId = process.env.NOTION_TAGLIBRARY_DATABASE_ID;

/**
 * Returns a random integer between the specified values, inclusive.
 * The value is no lower than `min`, and is less than or equal to `max`.
 *
 * @param {number} minimum - The smallest integer value that can be returned, inclusive.
 * @param {number} maximum - The largest integer value that can be returned, inclusive.
 * @returns {number} - A random integer between `min` and `max`, inclusive.
 */
function getRandomInt(minimum, maximum) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = cache(async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
});

export const getTagLibraryDatabase = cache(async () => {
  const response = await notion.databases.query({
    database_id: tagLibraryDBId,
  });
  return response.results;
});

export const getPage = cache(async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
});

export const getPageFromSlug = cache(async (slug) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  if (response?.results?.length) {
    return response?.results?.[0];
  }
  return {};
});

export const listPagesFromLabel = cache(async (label) => {
  const firstResponse = await notion.databases.query({
    database_id: tagLibraryDBId,
    filter: {
      property: '名前',
      rich_text: {
        contains: label,
      }
    }
  })
  if (firstResponse.results.length > 1) {
    throw Error("同じ名前のラベルが重複してNotionに登録されています");
  }
  const pagesOfLabel =
    firstResponse.results[0].properties['アウトプット記事'].relation.map(res=>res.id)
    .map((pid) =>  getPage(pid))
  const pages = await Promise.all(pagesOfLabel)
  //console.log(labelPages.map(l=>l.properties.Label))
  return pages
});


export const getBlocks = cache(async (blockID) => {
  const blockId = blockID.replaceAll('-', '');

  const { results } = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

  // Fetches all child blocks recursively
  // be mindful of rate limits if you have large amounts of nested blocks
  // See https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = results.map(async (block) => {
    if (block.has_children) {
      const children = await getBlocks(block.id);
      return { ...block, children };
    }
    return block;
  });

  return Promise.all(childBlocks).then((blocks) => blocks.reduce((acc, curr) => {
    if (curr.type === 'bulleted_list_item') {
      if (acc[acc.length - 1]?.type === 'bulleted_list') {
        acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
      } else {
        acc.push({
          id: getRandomInt(10 ** 99, 10 ** 100).toString(),
          type: 'bulleted_list',
          bulleted_list: { children: [curr] },
        });
      }
    } else if (curr.type === 'numbered_list_item') {
      if (acc[acc.length - 1]?.type === 'numbered_list') {
        acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
      } else {
        acc.push({
          id: getRandomInt(10 ** 99, 10 ** 100).toString(),
          type: 'numbered_list',
          numbered_list: { children: [curr] },
        });
      }
    } else {
      acc.push(curr);
    }
    return acc;
  }, []));
});
