import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData, PostSlug, PostId } from '../mdxtypes'; // Importando os tipos

// Diretório dos posts
const postsDirectory = path.join(process.cwd(), '/src/content/posts');

// Função para pegar dados dos posts, ordenados
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData: PostData[] = fileNames.map((fileName) => {
    const id = fileName.replace(/\.mdx$/, ''); // Remove a extensão .mdx para obter o id
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents); // Faz o parse do conteúdo com gray-matter

    return {
      id,
      ...matterResult.data,
      content: matterResult.content, // O conteúdo será processado em outra função
    } as PostData; // Assegura que o retorno está conforme a interface PostData
  });

  // Filtra posts com draft: false
  const filteredPosts = allPostsData.filter((post) => post.draft === false);

  // Ordena os posts pela data
  const sortedPosts = filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));

  // console.log(sortedPosts);
  return sortedPosts;
}

// getSortedPostsData();

// Função para pegar todos os slugs
export function getAllPostSlugs(): PostSlug[] {
  const posts = getSortedPostsData();
  const postslugs: PostSlug[] = posts.map((post) => ({
    params: {
      slug: post.slug, // slug para o roteamento dinâmico
    },
  }));

  // console.log(postslugs);
  return postslugs;
}

// getAllPostSlugs();

// Função para pegar todos os ids
export function getAllPostIds(): PostId[] {
  const posts = getSortedPostsData();
  const postsids: PostId[] = posts.map((post) => ({
    params: {
      id: post.id,
    },
  }));

  // console.log(postsids);
  return postsids;
}

// getAllPostIds();

// Função para pegar todas as tags únicas com suas frequências
export function getUniqueTags() {
  const posts = getSortedPostsData();

  // Extrair todas as tags de todos os posts e achatar o array
  const allTags: string[] = posts.flatMap((post) => post.tags);

  // Criar um objeto para contar as frequências das tags
  const tagFrequency: Record<string, number> = {};

  allTags.forEach((tag) => {
    tagFrequency[tag] = (tagFrequency[tag] || 0) + 1; // Incrementa a contagem da tag
  });

  // Transformar o objeto de frequência em um array de tuplas [tag, frequência]
  const uniqueTagsWithFrequency = Object.entries(tagFrequency).map(([tag, frequency]) => ({
    tag,
    frequency,
  }));

  // console.log(uniqueTagsWithFrequency);
  return uniqueTagsWithFrequency;
}

// getUniqueTags();


// Função para pegar os dados de um post específico
export async function getPostData(slug: string): Promise<PostData> {
  const posts = getSortedPostsData();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    throw new Error(`Post com slug ${slug} não encontrado`);
  }

  // Retorna os dados do post e o conteúdo MDX
  const content: PostData = {
    id: post.id,
    title: post.title,
    date: post.date,
    mod: post.mod,
    slug: post.slug,
    featured: post.featured,
    draft: post.draft,
    tags: post.tags,
    description: post.description,
    content: post.content, // Passa o conteúdo bruto (MDX) para ser serializado posteriormente
  };

  // console.log(content);
  return content;
}
