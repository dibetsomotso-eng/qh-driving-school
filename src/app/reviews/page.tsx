import React from 'react';
import Link from 'next/link';
import { getReviews } from '@/lib/reviews';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, Quote, CheckCircle2, ArrowLeft } from 'lucide-react';

export const revalidate = 21600; // 6 hours

export default async function ReviewsPage() {
  const { reviews, stats } = await getReviews();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header/Hero */}
      <section className="relative py-20 bg-primary/5 border-b overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-6">
              Student <span className="text-primary">Success Stories</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
              Hear from hundreds of students who successfully got their licenses with QH Driving School. Real stories, real success.
            </p>
            
            <div className="flex flex-wrap items-center gap-8 bg-background/50 backdrop-blur p-6 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold tracking-tighter">{stats.totalRating.toFixed(1)}</span>
                <div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(stats.totalRating) ? 'fill-current' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Google Rating</p>
                </div>
              </div>
              
              <div className="h-12 w-px bg-border hidden sm:block" />
              
              <div>
                <p className="text-3xl font-bold tracking-tight">{stats.totalReviews}+</p>
                <p className="text-sm font-medium text-muted-foreground">Verified Reviews</p>
              </div>
              
              <div className="flex-grow" />
              
              <Button asChild className="rounded-full px-8 h-12">
                <a 
                  href={process.env.GOOGLE_PLACE_ID 
                    ? `https://search.google.com/local/writereview?placeid=${process.env.GOOGLE_PLACE_ID}`
                    : "https://www.google.com/search?q=QH+Driving+School+Reviews"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leave a Review
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((testimonial, index) => (
                <Card key={index} className="flex flex-col border-none shadow-lg bg-gradient-to-br from-card to-background/50 hover:shadow-xl transition-all duration-300 group relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors duration-300" />
                  <CardContent className="p-8 flex-grow flex flex-col justify-between relative">
                    <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/5 group-hover:text-primary/10 transition-colors" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'text-muted'}`} />
                          ))}
                        </div>
                        {testimonial.source !== 'Google' && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </div>
                        )}
                      </div>
                      
                      <blockquote className="text-lg font-medium leading-relaxed mb-8 italic text-foreground/90">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="flex items-center mt-auto border-t pt-6 border-primary/5">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/5 ring-offset-2 ring-offset-background group-hover:ring-primary/20 transition-all">
                        <AvatarImage src={testimonial.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-bold text-sm tracking-tight">{testimonial.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">{testimonial.license || 'Verified Student'}</p>
                          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                            {testimonial.source}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No reviews found yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Join our community of successful drivers today. Professional lessons, patient instructors, and guaranteed results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg">
              <Link href="/booking">Book a Lesson Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
