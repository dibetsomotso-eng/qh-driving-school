'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with dashes'),
  excerpt: z.string().min(1, 'Excerpt is required').max(200, 'Excerpt must be 200 characters or less'),
  content: z.string().min(1, 'Content is required'),
});

type PostFormValues = z.infer<typeof postSchema>;

function EditPostForm() {
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const title = form.watch('title');
  useEffect(() => {
    if (title && !form.getValues('slug')) {
        form.setValue('slug', generateSlug(title), { shouldValidate: true });
    }
  }, [title, form]);


  const postRef = useMemoFirebase(() => {
    if (!firestore || !postId) return null;
    return doc(firestore, 'blogPosts', postId);
  }, [firestore, postId]);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (postRef) {
        try {
          const docSnap = await getDoc(postRef);
          if (docSnap.exists()) {
            form.reset(docSnap.data() as PostFormValues);
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch post data.' });
        }
      }
      setIsFetching(false);
    };
    
    if (postId) {
      fetchPost();
    } else {
        setIsFetching(false);
    }
  }, [postRef, postId, form, toast]);


  const onSubmit = async (data: PostFormValues) => {
    if (!firestore) return;
    setIsLoading(true);

    const postData = {
      ...data,
      imageUrl: PlaceHolderImages.find(img => img.id === 'blog-1')?.imageUrl || '',
      imageHint: 'driving view',
      publishedAt: new Date().toISOString(),
    };

    try {
      if (postId && postRef) {
        await setDoc(postRef, postData, { merge: true });
        toast({ title: 'Success', description: 'Post updated successfully.' });
      } else {
        await addDoc(collection(firestore, 'blogPosts'), postData);
        toast({ title: 'Success', description: 'Post created successfully.' });
      }
      router.push('/admin');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save post.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="My Awesome Blog Post" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="my-awesome-blog-post" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Excerpt / Short Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="A short summary of the post..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Content (Markdown)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Write your post content here using Markdown..." {...field} rows={15}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                    <CardContent>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {postId ? 'Update Post' : 'Publish Post'}
                        </Button>
                         <Button variant="outline" className="w-full mt-2" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Content Preview</CardTitle></CardHeader>
                    <CardContent>
                        <article className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{form.watch('content')}</ReactMarkdown>
                        </article>
                    </CardContent>
                </Card>
            </div>
        </div>
      </form>
    </Form>
  );
}

// A Suspense boundary is needed because useSearchParams is a client-side hook.
export default function EditPostPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <EditPostForm />
        </Suspense>
    );
}