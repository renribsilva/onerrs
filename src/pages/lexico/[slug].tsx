import Head from "next/head";
import { getPosts } from "../../lib/getDBData"; // Importa a função para obter os posts
import { NotionPage } from "../../notiontypes";
import { GetStaticPaths, GetStaticProps } from "next";
import styles from "../../styles/lexico.module.css";
import Datetime from "../../components/datetime";

// Função para gerar as rotas dinâmicas
export const getStaticPaths: GetStaticPaths = async () => {
  const database = await getPosts();
  
  // Verifica se a consulta retornou resultados
  if (!database || !database.results) {
    return { paths: [], fallback: false }; // Retorna 404 se não houver resultados
  }

  const paths = database.results.map((post: NotionPage) => ({
    params: { 
      slug: post.properties.Page.title[0].plain_text
        .replace(/\s+/g, '') // Remove espaços
        .replace(/-/g, '') // Remove hífens
        .toLowerCase() // Converte para minúsculas
    },
  }));

  return {
    paths,
    fallback: false, // Retorna 404 para slugs não encontrados
  };
};

// Função para obter os dados do post baseado no slug
export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params!; // Obtém o slug dos parâmetros
  const database = await getPosts();
  
  // Verifica se a consulta retornou resultados
  if (!database || !database.results) {
    return { notFound: true }; // Retorna 404 se não houver resultados
  }

  // Encontre o post correspondente ao slug
  const post = database.results.find((post: NotionPage) => {
    const postSlug = post.properties.Page.title[0].plain_text
      .replace(/\s+/g, '') // Remove espaços
      .replace(/-/g, '') // Remove hífens
      .toLowerCase(); // Converte para minúsculas
    return postSlug === slug; // Compare o slug formatado com o slug obtido da URL
  });

  // Se o post não for encontrado, retorna 404
  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post, // Retorna o post encontrado
    },
  };
};

// Tipando as props do componente Post
interface PostProps {
  post: NotionPage; // O post correspondente
}

const Post = ({ post }: PostProps) => {
  return (
    <>
      <Head>
        <title>Léxico | Petricor</title>
      </Head>
      <section className={styles.lexicoslug}>
        <div>
          <h1>{post.properties.Page.title[0].plain_text.replace(/-/g, '·')}</h1>
          <div>
            <Datetime date={post.created_time}></Datetime>
          </div>
        </div>
        <div>
          {post.properties.Slug.rich_text.map((item) => {
              return (
                item.plain_text
              )})
          }
        </div>
      </section>
    </>
  );
};


export default Post;
