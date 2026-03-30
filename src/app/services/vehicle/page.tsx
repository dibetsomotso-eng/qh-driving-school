import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { vehicleServices } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default function VehicleServicesPage() {
  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Vehicle Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            From car registration and license disk renewals to police clearances and microdots — we handle your vehicle paperwork from start to finish.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleServices.map((service) => {
              const serviceImage = PlaceHolderImages.find((img) => img.id === service.imageId);
              const Icon = service.icon;
              return (
                <Card key={service.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Link href={`/services/${service.slug}`} className="flex flex-col h-full">
                    <CardHeader className="p-0">
                      {serviceImage ? (
                        <Image
                          src={serviceImage.imageUrl}
                          alt={serviceImage.description}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover"
                          data-ai-hint={serviceImage.imageHint}
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <Icon className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                      </div>
                      <CardDescription className="flex-grow">{service.shortDescription}</CardDescription>
                      <div className="text-primary font-semibold mt-4 flex items-center">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
