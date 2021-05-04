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
};

export default function Index(props: Props) {
  const { blogList } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>microCMS Next.js Sample</title>
      </Head>

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

      <Link href="/blogs">more</Link>
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch(`${process.env.MICROCMS_ENDPOINT}blog?limit=3`, {
    headers: {
      'X-API-KEY': process.env.MICROCMS_API_KEY
    },
  });
  const data = await res.json();
  console.log(data);
  return {
    props: {
      blogList: data.contents,
    },
  };
};