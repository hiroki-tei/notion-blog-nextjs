import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers';


export const Refetch = (props) => {
  const imageExpiredFound = props.blocks.some((block) => {
    if (block.type == 'image' && block.image.type == 'file') {
      const expiryTime = block.image.file.expiry_time
      if (Date.parse(expiryTime) < Date.now()) {
        return true
      }
    }
  })
  if (!imageExpiredFound) {
    return null
  }
  const pathname = headers().get('x-pathname') || "";
  switch (true) {
    case /\/blog\/articles\/.*$/.test(pathname): {
      revalidatePath("/blog/articles/[slug]", "page")
    }
    default: {
    }
  }
  return null
}

