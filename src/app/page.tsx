import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { services, testimonials, whyChooseUs } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
              We Teach You to Drive — Step by Step
            </h1>
            <p className="mt-4 text-lg md:text-xl text-neutral-200">
              Affordable lessons, professional instructors, guaranteed success.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/booking">Book Your Lesson</Link>
            </Button>
          </div>
        </section>

        {/* Services Preview */}
        <section id="services" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Services</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                From your learner's license to advanced driving codes, we provide a clear path to getting you on the road.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.slice(0, 4).map((service) => {
                const serviceImage = PlaceHolderImages.find((img) => img.id === service.imageId);
                return (
                  <Card key={service.slug} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Link href={`/services/${service.slug}`} className="block">
                      <CardHeader className="p-0">
                        {serviceImage && (
                           <Image
                            src={serviceImage.imageUrl}
                            alt={serviceImage.description}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover"
                            data-ai-hint={serviceImage.imageHint}
                          />
                        )}
                      </CardHeader>
                      <CardContent className="p-6">
                        <CardTitle className="text-xl font-bold mb-2">{service.title}</CardTitle>
                        <CardDescription>{service.shortDescription}</CardDescription>
                         <div className="text-primary font-semibold mt-4 flex items-center">
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
             <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Choose QH Driving School?</h2>
              <p className="mt-2 text-muted-foreground">Your success is our priority.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
              {whyChooseUs.map((feature) => (
                <div key={feature.title} className="p-6">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Students Say</h2>
              <p className="mt-2 text-muted-foreground">Real stories from our successful drivers.</p>
            </div>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <Card className="h-full flex flex-col">
                        <CardContent className="p-6 flex-grow flex flex-col justify-between">
                          <blockquote className="text-lg italic border-l-4 border-primary pl-4 mb-4">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="flex items-center mt-4">
                            <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.name}`} />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <p className="font-bold">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.license}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </main>
    </div>
  );
}
