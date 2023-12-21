'use server'
import { getLinkPreview } from 'link-preview-js';


export async function fetchOgp(url: string) {
  const data = await getLinkPreview(url, {
    followRedirects: 'follow'
  })
  return data
}