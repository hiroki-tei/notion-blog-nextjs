import styles from '@styles/builder/post.module.css';

type VideoType = 'external' | 'file'
type VideoData = {
  [key in VideoType]: {url: string}
} &  {
  type: VideoType
}
type Props = {
  data: VideoData
}

export const Video = (props: Props) => {
  console.log(props)
  switch (props.data.type) {
    case 'external': {
      return (<iframe className={styles.iframe}
              src={props.data.external?.url}
              title=""
              data-ratio="1.78343949044586"/>)

    }
    case 'file': {
      return <video controls width="640" src={props.data.file?.url} />
    }
  }
}