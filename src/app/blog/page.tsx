"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/insforge';
import { type BlogPost } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPage() {
  const { data: posts, isLoading } = useCollection<BlogPost>('/api/blog-posts');

  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Driving Tips &amp; News</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay updated with our latest articles, driving tips, and success stories from our students.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden shadow-lg">
                <Skeleton className="w-full h-48" />
                <CardHeader className="p-6">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
            {!isLoading && posts?.map((post) => {
              const postSlug = post.slug || post.title.toLowerCase().replace(/ /g, '-');
              return (
                <Card key={post.id || postSlug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                        data-ai-hint={post.imageHint}
                      />
                    )}
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <CardTitle className="text-xl font-bold mb-2">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button variant="outline" asChild>
                      <Link href={`/blog/${postSlug}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          {!isLoading && (!posts || posts.length === 0) && (
            <div className="text-center col-span-full">
              <p className="text-muted-foreground">No blog posts found. Check back later!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
