"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const SA_PHONE_REGEX = /^(\+27|0)[6-8][0-9]{8}$/;

const bookingFormSchema = z.object({
  serviceCategory: z.enum(["driving", "vehicle"], {
    required_error: "Please select a service category.",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z.string().regex(SA_PHONE_REGEX, "Please enter a valid South African phone number (e.g. 0812345678)."),
  email: z.string().email("Please enter a valid email address."),
  licenseType: z.string().min(1, "Please select a service."),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
  }),
  preferredTime: z.string().min(1, "Please select a preferred time slot."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const drivingServices = [
  { value: "learners", label: "Learner\u2019s License Prep" },
  { value: "code-b", label: "Code B (Car) Lesson" },
  { value: "code-eb", label: "Code EB (Towing) Lesson" },
  { value: "code-a", label: "Code A (Motorcycle) Lesson" },
  { value: "code-c1", label: "Code C1 (Medium Truck) Lesson" },
  { value: "renewal", label: "License Renewal Assistance" },
  { value: "prdp", label: "PrDP Application" },
];

const vehicleServiceOptions = [
  { value: "car-registration", label: "Car Registration & Licensing" },
  { value: "number-plates", label: "Number Plates" },
  { value: "disk-renewal", label: "Disk Renewal" },
  { value: "police-clearance", label: "Police Clearance" },
  { value: "export-clearance", label: "Export Police Clearance" },
  { value: "vin-update", label: "VIN Update" },
  { value: "roadworthy", label: "Roadworthy Certificate" },
  { value: "duplicates", label: "Duplicates" },
  { value: "microdots", label: "Microdots" },
  { value: "vintage-registration", label: "Vintage Car Registration" },
];

export default function BookingPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceCategory: undefined,
      fullName: "",
      phone: "",
      email: "",
      licenseType: "",
      preferredTime: "",
    },
  });

  const selectedCategory = form.watch("serviceCategory");

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);

    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Firestore is not available. Please try again later.",
      });
      setIsSubmitting(false);
      return;
    }

    const bookingData = {
      ...data,
      preferredDate: format(data.preferredDate, "PPP"),
      bookingDate: new Date().toISOString(),
    };

    let docRef;
    try {
      docRef = await addDoc(collection(firestore, "bookings"), bookingData);
    } catch (error) {
      const permissionError = new FirestorePermissionError({
        path: "bookings",
        operation: "create",
        requestResourceData: bookingData,
      });
      errorEmitter.emit("permission-error", permissionError);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem submitting your booking. Please try again later.",
      });
      setIsSubmitting(false);
      return;
    }

    // Send confirmation emails and surface any failure to the user.
    try {
      const emailRes = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationType: "booking",
          data: { ...bookingData, bookingId: docRef.id },
        }),
      });
      const emailJson = await emailRes.json();
      if (!emailJson.success) {
        console.error("Email notification failed:", emailJson.message);
        toast({
          variant: "destructive",
          title: "Email Not Sent",
          description: "Your booking was saved but we could not send a confirmation email. Please contact us directly.",
        });
      }
    } catch (err) {
      console.error("Email fetch error:", err);
    }

    toast({
      title: "Booking Request Received!",
      description: "We\u2019ve received your request and will contact you shortly to confirm.",
    });
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Book a Service</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you need a driving lesson or help with vehicle paperwork, fill out the form below and we will be in touch.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Booking Form</CardTitle>
              <CardDescription>We will contact you to confirm your booking and arrange payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  {/* Service Category */}
                  <FormField
                    control={form.control}
                    name="serviceCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("licenseType", "");
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select driving or vehicle services" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="driving">Driving Lessons &amp; Licenses</SelectItem>
                            <SelectItem value="vehicle">Vehicle Registration &amp; Documentation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Personal Details */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="0812345678" {...field} />
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

                  {/* Service Selection — shown once category is chosen */}
                  {selectedCategory && (
                    <FormField
                      control={form.control}
                      name="licenseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {selectedCategory === "driving" ? "What are you booking for?" : "Which vehicle service do you need?"}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(selectedCategory === "driving" ? drivingServices : vehicleServiceOptions).map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Preferred Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time Slot</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="morning">Morning (8am – 12pm)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12pm – 4pm)</SelectItem>
                              <SelectItem value="late-afternoon">Late Afternoon (4pm – 6pm)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Request Booking
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
