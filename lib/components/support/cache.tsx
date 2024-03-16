import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers';


export const Refetch = () => {
  const pathname = headers().get('x-pathname') || "";
  switch (true) {
    case /\/blog\/articles\/.*$/.test(pathname): {
      revalidatePath("/blog/articles/[slug]", "page")
    }
    default: {
    }
  }
  return (
      <></>
  )
}

