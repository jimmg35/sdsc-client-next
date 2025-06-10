import { getNewsBySlug } from '@/lib/news';
import remarkHTML from 'remark-html';
import { ChevronLeft } from 'lucide-react';
import { remark } from 'remark';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = Promise<{
  slug: string;
}>;

export default async function PostPage(props: { params: Props }) {
  const { slug } = await props.params;
  const post = getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  const markdownToHTML = async (markdownString: string) => {
    const result = await remark().use(remarkHTML).process(markdownString);
    return result.toString();
  };

  const mdHtmlContent = await markdownToHTML(post.content);

  return (
    <section className="relative min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex justify-between pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="max-w-3xl">
            <article>
              <header className="pb-8">
                <div className="mb-6">
                  <Link
                    className="text-sm font-medium text-teal-500 transition-colors hover:text-teal-600 flex items-center"
                    href="/news"
                  >
                    <ChevronLeft size={16} className="inline-block mr-2" />
                    Back To Blog
                  </Link>
                </div>
                <h1 className="mb-5 text-5xl font-bold">{post.title}</h1>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    {post.author} ·{' '}
                    <span className="text-gray-700">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </header>
              <div className="prose max-w-none text-gray-700 prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-gray-900 prose-a:font-medium prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-gray-900 prose-strong:font-medium prose-strong:text-gray-900 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-gray-900 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:border prose-pre:border-gray-700 prose-pre:bg-gray-900 prose-blockquote:xl:-ml-4">
                <article dangerouslySetInnerHTML={{ __html: mdHtmlContent }} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
//  <h1>{post.title}</h1>
//     <article
//       className="prose"
//       dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
//         />

// {post.thumbnail && (
//   <Image
//     src={post.thumbnail}
//     alt={post.title}
//     width={800}
//     height={400}
//     style={{ marginBottom: "20px" }}
//   />
// )}
