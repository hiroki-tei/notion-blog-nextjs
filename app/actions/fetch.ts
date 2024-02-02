'use server'
import { getLinkPreview } from 'link-preview-js';


export async function fetchOgp(url: string) {
  const data = await getLinkPreview(url, {
    followRedirects: 'follow'
  })
  return data
}

export async function fetchUrl(url: string) {
  const data = await (await fetch(url)).json()
  return data
}