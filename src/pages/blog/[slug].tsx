import { getAllPostSlugs, getPostData } from "../../lib/getCollection";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import MdxLayout from "../../layout/layout_mdx";
import Datetime from "../../components/datetime";
import type { PostData, PostSlug } from "../../mdxtypes";
import styles from "../../styles/pages.module.css";
import React from "react";

interface PostProps {
  postData: Omit<PostData, "content"> & {
    content: MDXRemoteSerializeResult; // Conteúdo serializado para MDXRemote
  };
}

export async function getStaticPaths() {
  const mdfiles: PostSlug[] = getAllPostSlugs(); // Utilize PostSlug como tipo
  return {
    paths: mdfiles.map((file) => ({
      params: { slug: file.params.slug },
    })),
    fallback: false, // Se `false`, qualquer rota não encontrada retorna 404
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const postData: PostData = await getPostData(params.slug);

  // Serializa o conteúdo MDX para uso com MDXRemote
  const mdxSource = await serialize(postData.content);
  
  return {
    props: {
      postData: {
        ...postData,
        content: mdxSource, // Conteúdo serializado
      },
    },
  };
}

export default function Post({ postData }: PostProps) {
  return (
    <MdxLayout>
      <h1 className={styles.txt_slug_title}>{postData.title}</h1>
      <div className={styles.txt_slug_date}>
        <span>
          <Datetime date={postData.date} />
        </span>
      </div>
      <div>
        <MDXRemote {...postData.content} />
      </div>
    </MdxLayout>
  );
}