import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const serviceImage = PlaceHolderImages.find((img) => img.id === service.imageId);

  return (
    <>
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center text-center text-white">
        {serviceImage && (
          <Image
            src={serviceImage.imageUrl}
            alt={serviceImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={serviceImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
            {service.title}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold">Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">What's included?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">One-on-one training with a certified instructor</span>
                    </li>
                     <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">Use of our fully insured, dual-control vehicle</span>
                    </li>
                     <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">Flexible scheduling to fit your life</span>
                    </li>
                     <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">Guidance on test booking and preparation</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-10 text-center bg-primary/10 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold font-headline">Ready to Get Started?</h2>
                    <p className="mt-2 text-muted-foreground">Take the next step towards getting your license. Book your lesson with us today!</p>
                     <Button asChild size="lg" className="mt-6">
                        <Link href="/booking">Book Now</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
