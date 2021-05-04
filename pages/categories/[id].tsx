import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from './index.module.css'

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
}

type Props = {
  blogList: Blog[];
  category: Category;
};

export default function Category(props: Props): JSX.Element {
  const { blogList, category } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>{category.name}</title>
      </Head>

      <h1>{category.name}</h1>

      <ul className={styles.list}>
        {blogList.map(blog => (
          <li key={blog.id} className={styles.item}>
            <Link href={`/blogs/${blog.id}`}>
              <a className={styles.link}>
                <div className={styles.imgWrap}>
                  <Image 
                    src={blog.img.url}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <p>{blog.title}</p>
                {blog.categoryList.map(category => (
                  <span key={category.id}>{category.name}</span>
                ))}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticPaths() {
  const res = await fetch(`${process.env.MICROCMS_ENDPOINT}category`, {
    headers: {
      'X-API-KEY': process.env.MICROCMS_API_KEY
    },
  });
  const data = await res.json();
  const paths = data.contents.map(category => `/categories/${category.id}`);
  return {
    paths,
    fallback: false,
  };
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getStaticProps = async ({ params }): Promise<{
  props: Props
}> => {
  const res = await fetch(`${process.env.MICROCMS_ENDPOINT}blog?filters=categoryList[contains]${params.id}`, {
    headers: {
      'X-API-KEY': process.env.MICROCMS_API_KEY
    },
  });
  const data = await res.json();

  const resCategory = await fetch(`${process.env.MICROCMS_ENDPOINT}category/${params.id}`, {
    headers: {
      'X-API-KEY': process.env.MICROCMS_API_KEY
    },
  });
  const dataCategory = await resCategory.json();
  return {
    props: {
      blogList: data.contents,
      category: dataCategory
    },
  };
};