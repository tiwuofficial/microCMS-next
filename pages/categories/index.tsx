import Head from 'next/head'
import Link from 'next/link';
import styles from './index.module.css'

type Category = {
  id: string;
  name: string;
}

type Props = {
  categoryList: Category[];
};

export default function Categories(props: Props): JSX.Element {
  const { categoryList } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>Categories</title>
      </Head>

      <h1>Categories</h1>

      <ul className={styles.list}>
        {categoryList.map(category => (
          <li key={category.id} className={styles.item}>
            <Link href={`/categories/${category.id}`}>
              <a className={styles.link}>
                <p>{category.name}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const getStaticProps = async (): Promise<{
  props: Props
}> => {
  const res = await fetch(`${process.env.MICROCMS_ENDPOINT}category`, {
    headers: {
      'X-API-KEY': process.env.MICROCMS_API_KEY
    },
  });
  const data = await res.json();
  return {
    props: {
      categoryList: data.contents,
    },
  };
};