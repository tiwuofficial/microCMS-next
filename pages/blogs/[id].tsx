import Head from 'next/head'
import Image from 'next/image'
import styles from './[id].module.css'

type Image = {
  url: string,
  height: number,
  width: number
}

type Category = {
  id: string;
  name: string;
}

type Blog = {
  id: string;
  title: string;
  img: Image;
  categoryList: Category[];
  body: string;
}

type Props = {
  blog: Blog;
};

export default function Blog(props: Props): JSX.Element {
  const { blog } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>{blog.title}</title>
      </Head>

      <h1>{blog.title}</h1>

      <Image 
        src={blog.img.url}
        width={blog.img.width}
        height={blog.img.height}
      />

      <div>
        {blog.categoryList.map(category => (
          <span key={category.id}>{category.name}</span>
        ))}
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: `${blog.body}`,
        }}
      />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticPaths() {
  const res = await fetch(`${process.env.MICROCMS_ENDPOINT}blog`, {
    headers: {
      'X-API-KEY': process.env.MICROCMS_API_KEY
    },
  });
  const data = await res.json();
  const paths = data.contents.map(blog => `/blogs/${blog.id}`);
  return {
    paths,
    fallback: false,
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getStaticProps = async ({ params }): Promise<{
  props: Props
}> => {
  const res = await fetch(`${process.env.MICROCMS_ENDPOINT}blog/${params.id}`, {
    headers: {
      'X-API-KEY': process.env.MICROCMS_API_KEY
    },
  });
  const data = await res.json();
  return {
    props: {
      blog: data,
    },
  };
};