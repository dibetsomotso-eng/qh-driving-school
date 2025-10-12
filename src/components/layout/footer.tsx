"use client";

import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, getFirestore } from "firebase/firestore";

import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { navLinks } from "@/lib/data";
import { useFirebase, useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";


const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function Footer() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: NewsletterFormValues) {
    if (firestore) {
      const subscribersCol = collection(firestore, "subscribers");
      addDocumentNonBlocking(subscribersCol, {
        ...data,
        subscriptionDate: new Date().toISOString(),
      });
    }
    toast({
      title: "Subscribed!",
      description: "Thanks for joining our newsletter.",
    });
    form.reset();
  }

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Contact Info */}
          <div className="md:col-span-2">
            <Icons.Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-md text-accent-foreground/80">
              We Teach You to Drive Step by Step.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p>
                <a href="tel:+27733813197" className="hover:text-primary transition-colors">+27 73 381 3197</a>
              </p>
              <p>
                <a href="tel:+27788332283" className="hover:text-primary transition-colors">+27 78 833 2283</a>
              </p>
              <p>
                <a href="tel:+27108259488" className="hover:text-primary transition-colors">+27 10 825 9488</a>
              </p>
              <p>
                <a href="mailto:henrymteb@gmail.com" className="hover:text-primary transition-colors">henrymteb@gmail.com</a>
              </p>
               <a
                href="https://wa.me/27733813197"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 pt-2 font-semibold text-primary"
              >
                <Icons.Whatsapp className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-headline font-bold text-lg">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors text-accent-foreground/80">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/booking" className="text-sm hover:text-primary transition-colors text-accent-foreground/80">
                  Book a Lesson
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-headline font-bold text-lg">Newsletter</h4>
            <p className="mt-4 text-sm text-accent-foreground/80">
              Get driving tips and special offers directly in your inbox.
            </p>
            <div className="mt-4">
              {isClient ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input
                              placeholder="Your email"
                              {...field}
                              className="bg-background/20 border-border/50 text-accent-foreground placeholder:text-accent-foreground/60"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" variant="default" className="bg-accent-foreground text-accent">
                      Subscribe
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="flex gap-2">
                   <Input placeholder="Your email" disabled className="bg-background/20 border-border/50" />
                   <Button type="submit" variant="default" className="bg-accent-foreground text-accent" disabled>
                      Subscribe
                    </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/20 pt-6 text-center text-sm text-accent-foreground/60">
          <p>&copy; {new Date().getFullYear()} QH Driving School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
