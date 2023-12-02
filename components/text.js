import styles from '../styles/builder/post.module.css';

export default function Text({ title }) {
  if (!title) {
    return null;
  }
  return title.map((value) => {
    /*
    {
      type: 'mention',
      mention: {
        type: 'page',
        page: { id: '*'}
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default'
      },
      plain_text: 'QGISでプラグインを作る-Widgetの作成-',
      href: 'https://www.notion.so/*'
    }
    */
    if (value.type === 'mention') {
      /* eslint-disable no-param-reassign */
      value.text = value.plain_text;
    }
    const {
      annotations: {
        bold, code, color, italic, strikethrough, underline,
      },
      text,
    } = value;
    return (
      <span
        className={[
          bold ? styles.bold : '',
          code ? styles.code : '',
          italic ? styles.italic : '',
          strikethrough ? styles.strikethrough : '',
          underline ? styles.underline : '',
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
        key={text.content}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
}
