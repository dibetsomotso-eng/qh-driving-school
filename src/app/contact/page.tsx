"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  licenseType: z.string().min(1, "Please select a license type."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      licenseType: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you shortly.",
    });
    form.reset();
  }
  
  const mapEmbedUrl = "https://www.google.com/maps/embed/v1/place?key=&q=59%20Mare%20Street%2C%20Roodepoort%2C%201727%2C%20South%20Africa";


  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Have a question or ready to book? Get in touch with us today.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+27 12 345 6789" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                          control={form.control}
                          name="licenseType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>License Type Interested In</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a license type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="code-a-b-eb">Code A, B & EB</SelectItem>
                                  <SelectItem value="code-c1-ec">Code C1 & Code EC</SelectItem>
                                  <SelectItem value="learners">Learner's License</SelectItem>
                                  <SelectItem value="renewals">License Renewal</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Your message..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Send Message</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            {/* Contact Details */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a href="tel:+27733813197" className="flex items-center gap-4 group">
                    <Phone className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>+27 73 381 3197</span>
                  </a>
                  <a href="tel:+27788332283" className="flex items-center gap-4 group">
                    <Phone className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>+27 78 833 2283</span>
                  </a>
                  <a href="tel:+27108259488" className="flex items-center gap-4 group">
                    <Phone className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>+27 10 825 9488</span>
                  </a>
                  <a href="mailto:henrymteb@gmail.com" className="flex items-center gap-4 group">
                    <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>henrymteb@gmail.com</span>
                  </a>
                  <a href="https://wa.me/27733813197" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 pt-2 font-semibold text-green-600">
                    <Icons.Whatsapp className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No 59 Mare Street, Roodepoort, 1727</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full h-[400px]">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location of QH Driving School"
        ></iframe>
      </section>
    </>
  );
}
