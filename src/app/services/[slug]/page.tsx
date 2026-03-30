import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { services, vehicleServices } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const allServices = [...services, ...vehicleServices];

export async function generateStaticParams() {
  return allServices.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = allServices.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const serviceImage = PlaceHolderImages.find((img) => img.id === service.imageId);
  const isVehicleService = vehicleServices.some((s) => s.slug === params.slug);
  const backHref = isVehicleService ? '/services/vehicle' : '/services';
  const backLabel = isVehicleService ? 'Vehicle Services' : 'Driving Services';

  const drivingIncludes = [
    'One-on-one training with a certified instructor',
    'Use of our fully insured, dual-control vehicle',
    'Flexible scheduling to fit your life',
    'Guidance on test booking and preparation',
  ];

  const vehicleIncludes = [
    'Expert guidance through the full application process',
    'Document checklist and preparation assistance',
    'Liaison with DLTC, SAPS, or NATIS on your behalf',
    'Follow-up until your document is collected',
  ];

  const includes = isVehicleService ? vehicleIncludes : drivingIncludes;
  const ctaTitle = isVehicleService ? 'Ready to Get It Done?' : 'Ready to Get Started?';
  const ctaBody = isVehicleService
    ? 'Contact us today and we will handle your vehicle paperwork from start to finish.'
    : 'Take the next step towards getting your license. Book your lesson with us today!';

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
            <Link href={backHref} className="text-primary text-sm font-medium hover:underline mb-6 inline-block">
              ← Back to {backLabel}
            </Link>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold">Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">What&apos;s included?</h3>
                  <ul className="space-y-3">
                    {includes.map((item) => (
                      <li key={item} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 text-center bg-primary/10 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold font-headline">{ctaTitle}</h2>
                  <p className="mt-2 text-muted-foreground">{ctaBody}</p>
                  <Button asChild size="lg" className="mt-6">
                    <Link href={isVehicleService ? '/contact' : '/booking'}>
                      {isVehicleService ? 'Contact Us' : 'Book Now'}
                    </Link>
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
