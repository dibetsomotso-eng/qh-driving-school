'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useMemoFirebase } from '@/firebase/provider';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { BlogPost } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const firestore = useFirestore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const postQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'blogPosts'),
      where('slug', '==', params.slug),
      limit(1)
    );
  }, [firestore, params.slug]);

  useEffect(() => {
    if (!postQuery) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(postQuery);
        if (snapshot.empty) {
          setError(true);
        } else {
          const doc = snapshot.docs[0];
          setPost({ ...doc.data() as BlogPost, id: doc.id });
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();

  }, [postQuery]);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
            <Skeleton className="h-12 w-32 mb-8" />
            <Skeleton className="h-[40vh] w-full mb-8" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[90%]" />
            </div>
        </div>
    );
  }

  if (error || !post) {
    notFound();
  }

  return (
    <>
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center text-center text-white">
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={post.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-neutral-200">
            Published on {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="outline" asChild className="mb-8">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <Card>
              <CardContent className="p-6 md:p-8">
                <article className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
