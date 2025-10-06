import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const founderImage = PlaceHolderImages.find((img) => img.id === 'about-founder');
  const instructorsImage = PlaceHolderImages.find((img) => img.id === 'about-instructors');
  const studentsImage = PlaceHolderImages.find((img) => img.id === 'about-students');

  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">About QH Driving School</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner on the journey to becoming a safe, confident, and licensed driver.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-headline font-bold">Our Mission & Values</h2>
              <p className="mt-4 text-muted-foreground">
                At QH Driving School, our mission is simple: to provide high-quality, accessible, and stress-free driver education. We believe that learning to drive is a significant milestone that opens up a world of opportunities. Our approach is built on a foundation of trust, clarity, and a step-by-step methodology that ensures every learner achieves their goals.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">✔</span>
                  <div>
                    <h3 className="font-bold">Professionalism</h3>
                    <p className="text-muted-foreground">We maintain the highest standards of instruction and customer service.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">✔</span>
                  <div>
                    <h3 className="font-bold">Patience</h3>
                    <p className="text-muted-foreground">We create a calm and supportive learning environment for all students.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">✔</span>
                  <div>
                    <h3 className="font-bold">Success</h3>
                    <p className="text-muted-foreground">We are dedicated to helping you pass your test and become a safe driver for life.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {instructorsImage && (
                    <Image
                        src={instructorsImage.imageUrl}
                        alt={instructorsImage.description}
                        width={400}
                        height={500}
                        className="rounded-lg shadow-lg object-cover w-full h-full"
                        data-ai-hint={instructorsImage.imageHint}
                    />
                )}
                {studentsImage && (
                    <Image
                        src={studentsImage.imageUrl}
                        alt={studentsImage.description}
                        width={400}
                        height={500}
                        className="rounded-lg shadow-lg object-cover w-full h-full mt-8"
                        data-ai-hint={studentsImage.imageHint}
                    />
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden md:grid md:grid-cols-3 md:items-center">
             {founderImage && (
              <div className="md:col-span-1">
                <Image
                  src={founderImage.imageUrl}
                  alt={founderImage.description}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint={founderImage.imageHint}
                />
              </div>
            )}
            <div className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-3xl font-headline">Meet Our Founder</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold">Henry Qoli Mtebula</h3>
                <p className="mt-4 text-muted-foreground">
                  With over 15 years of experience in driver education, Henry Qoli Mtebula founded QH Driving School with a vision to create a more supportive and effective learning experience for aspiring drivers. His passion for road safety and his patient, encouraging teaching style are the cornerstones of our school's philosophy.
                </p>
                <p className="mt-4 text-muted-foreground">
                  "I believe anyone can become a great driver with the right guidance. My goal is to empower every student with the skills and confidence they need not just to pass the test, but to be a safe and responsible driver for life."
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
