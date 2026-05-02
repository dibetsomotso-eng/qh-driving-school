'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  quote: string;
  license?: string;
  date: string;
  source: string;
  avatar?: string;
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalRating?: number; totalReviews?: number }>({});

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        if (data.reviews) {
          setReviews(data.reviews);
          setStats({
            totalRating: data.totalRating,
            totalReviews: data.totalReviews,
          });
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-[350px] border-none shadow-lg">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Skeleton key={j} className="h-4 w-4 rounded-full" />)}
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <div className="w-full">
      {stats.totalRating && (
        <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl font-bold tracking-tighter">{stats.totalRating.toFixed(1)}</span>
            <div className="flex flex-col">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(stats.totalRating || 0) ? 'fill-current' : 'text-muted'}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Average Rating
              </p>
            </div>
          </div>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Based on {stats.totalReviews} Google Reviews
            <span className="h-1 w-1 rounded-full bg-primary" />
          </p>
        </div>
      )}

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto px-4"
      >
        <CarouselContent className="-ml-4">
          {reviews.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className="h-full flex flex-col border-none shadow-xl bg-gradient-to-br from-card to-background/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-500" />
                  <CardContent className="p-8 flex-grow flex flex-col justify-between relative">
                    <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/5 group-hover:text-primary/10 transition-colors duration-500" />
                    
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
                      
                      <blockquote className="text-lg font-medium leading-relaxed mb-8 italic text-foreground/90 line-clamp-5">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="flex items-center mt-auto border-t pt-6 border-primary/5">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background group-hover:ring-primary/30 transition-all duration-500">
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex justify-center gap-4 mt-8">
          <CarouselPrevious className="static translate-y-0 h-10 w-10 bg-background shadow-lg hover:bg-primary hover:text-white border-none" />
          <CarouselNext className="static translate-y-0 h-10 w-10 bg-background shadow-lg hover:bg-primary hover:text-white border-none" />
        </div>
      </Carousel>
    </div>
  );
}
