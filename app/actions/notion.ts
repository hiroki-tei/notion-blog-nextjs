'use server'
import { getPage, getBlock, getBlocks } from "@lib/notion"

export async function getPageAction(pageID: string) {
  const data = await getPage(pageID)
  return data
}

export async function getBlockAction(blockID: string) {
  const data = await getBlocks(blockID)
  return data
}

export async function getSingleBlockAction(blockID: string) {
  const data = await getBlock(blockID)
  return data
}