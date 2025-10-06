"use client";

import * as React from 'react';
import Image from 'next/image';
import { galleryItems } from '@/lib/data';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = React.useState<ImagePlaceholder | null>(null);

  const images = galleryItems.map(item => PlaceHolderImages.find(img => img.id === item.id)).filter(Boolean) as ImagePlaceholder[];

  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Gallery</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            A glimpse into our driving school: happy students, our vehicles, and proud moments.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Dialog>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <DialogTrigger key={image.id} asChild onClick={() => setSelectedImage(image)}>
                  <div className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer shadow-lg">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </DialogTrigger>
              ))}
            </div>

            {selectedImage && (
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Gallery</DialogTitle>
                  <DialogDescription>{selectedImage.description}</DialogDescription>
                </DialogHeader>
                <div className="relative aspect-video mt-4">
                  <Image
                    src={selectedImage.imageUrl}
                    alt={selectedImage.description}
                    fill
                    className="object-contain rounded-md"
                    data-ai-hint={selectedImage.imageHint}
                  />
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </section>
    </>
  );
}
