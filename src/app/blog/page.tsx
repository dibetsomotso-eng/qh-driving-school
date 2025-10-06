import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { blogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Driving Tips & News</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay updated with our latest articles, driving tips, and success stories from our students.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const postImage = PlaceHolderImages.find((img) => img.id === post.imageId);
              return (
                <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    {postImage && (
                      <Image
                        src={postImage.imageUrl}
                        alt={postImage.description}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                        data-ai-hint={postImage.imageHint}
                      />
                    )}
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                    <CardTitle className="text-xl font-bold mb-2">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button variant="outline" asChild>
                      {/* In a full app, this would link to /blog/{post.slug} */}
                      <Link href="#">Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
