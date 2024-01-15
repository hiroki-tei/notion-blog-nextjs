'use server'
import { getPage } from "@lib/notion"

export async function getPageAction(pageID: string) {
  const data = await getPage(pageID)
  return data
}