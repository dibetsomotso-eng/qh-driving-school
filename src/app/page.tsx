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
import { services, vehicleServices, testimonials, whyChooseUs } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import GoogleReviews from '@/components/GoogleReviews';

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
                From your learner&apos;s license to advanced driving codes, we provide a clear path to getting you on the road.
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

        {/* Vehicle Services Preview */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Vehicle Services</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Beyond driving lessons — we handle car registration, license disks, police clearances, VIN updates, and more.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vehicleServices.slice(0, 5).map((service) => {
                const Icon = service.icon;
                return (
                  <Link key={service.slug} href={`/services/${service.slug}`} className="group">
                    <Card className="text-center p-4 shadow hover:shadow-lg transition-shadow duration-300 h-full">
                      <CardContent className="flex flex-col items-center gap-3 p-2">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-center leading-tight">{service.title}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="outline">
                <Link href="/services/vehicle">View All Vehicle Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Choose QH Driving School?</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Your success is our priority. We stand out by offering a supportive, professional, and effective learning environment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {whyChooseUs.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">What Our Students Say</h2>
              <p className="mt-2 text-muted-foreground">Real stories from our successful drivers, verified by Google.</p>
            </div>
            
            <GoogleReviews />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
               <Button asChild variant="outline" className="rounded-full px-8">
                <a 
                  href={process.env.GOOGLE_PLACE_ID 
                    ? `https://search.google.com/local/writereview?placeid=${process.env.GOOGLE_PLACE_ID}`
                    : "https://www.google.com/search?q=QH+Driving+School+Reviews"
                  } 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Leave a Review on Google
                </a>
              </Button>
              <Button asChild className="rounded-full px-8">
                <Link href="/reviews">View All Student Success Stories</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
