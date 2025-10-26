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

const bookingFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  licenseType: z.string().min(1, "Please select a license type."),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
  }),
  preferredTime: z.string().min(1, "Please select a preferred time slot."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const defaultValues: Partial<BookingFormValues> = {
    fullName: "",
    phone: "",
    email: "",
    licenseType: "",
    preferredTime: "",
};

export default function BookingPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  const onSubmit = (data: BookingFormValues) => {
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

    addDoc(collection(firestore, "bookings"), bookingData)
      .then(() => {
        toast({
          title: "Booking Request Received!",
          description: `We've received your request for a lesson on ${bookingData.preferredDate} at ${data.preferredTime}. We will contact you shortly to confirm.`,
        });
        form.reset();
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: 'bookings',
          operation: 'create',
          requestResourceData: bookingData,
        });
        errorEmitter.emit('permission-error', permissionError);
        
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: "There was a problem submitting your booking. Please try again later.",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Book Your Lesson</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Take the first step towards your driving freedom. Fill out the form below to request a lesson.
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
                        <FormLabel>What are you booking for?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service or license" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="learners">Learner's License Prep</SelectItem>
                            <SelectItem value="code-b">Code B (Car) Lesson</SelectItem>
                            <SelectItem value="code-eb">Code EB (Towing) Lesson</SelectItem>
                            <SelectItem value="code-a">Code A (Motorcycle) Lesson</SelectItem>
                            <SelectItem value="code-c1">Code C1 (Medium Truck) Lesson</SelectItem>
                            <SelectItem value="renewal">License Renewal Assistance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
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
                                  date < new Date(new Date().setHours(0,0,0,0))
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
                              <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12pm - 4pm)</SelectItem>
                              <SelectItem value="late-afternoon">Late Afternoon (4pm - 6pm)</SelectItem>
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
