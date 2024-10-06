// Define a estrutura dos dados dos posts
export type PostData = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  slug: string;
  draft: boolean;
  tags: string[];
  content: string; // Conteúdo bruto (MDX)
}

export type PostSlug = {
  params: {
    slug: string;
  };
}

export type PostId = {
  params: {
    id: string;
  };
}
