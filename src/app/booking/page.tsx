"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

// ─── Validation ──────────────────────────────────────────────────────────────

const SA_PHONE_REGEX = /^(\+27|0)[6-8][0-9]{8}$/;

const bookingFormSchema = z.object({
  serviceCategory: z.enum(["driving", "vehicle"], {
    required_error: "Please select a service category.",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z
    .string()
    .regex(SA_PHONE_REGEX, "Please enter a valid SA phone number (e.g. 0812345678)."),
  email: z.string().email("Please enter a valid email address."),
  licenseType: z.string().min(1, "Please select a service."),
  preferredDate: z.date({ required_error: "A preferred date is required." }),
  preferredTime: z.string().min(1, "Please select a time slot."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

// ─── Data ─────────────────────────────────────────────────────────────────────

const drivingServices = [
  { value: "learners",  label: "Learner's License Prep",        desc: "Study materials & guided test prep." },
  { value: "code-b",   label: "Code B (Car) Lesson",            desc: "Standard manual/auto car lessons." },
  { value: "code-eb",  label: "Code EB (Towing) Lesson",        desc: "Tow a caravan or trailer legally." },
  { value: "code-a",   label: "Code A (Motorcycle) Lesson",     desc: "Two-wheel licence training." },
  { value: "code-c1",  label: "Code C1 (Medium Truck) Lesson",  desc: "Drive medium goods vehicles." },
  { value: "renewal",  label: "License Renewal Assistance",     desc: "Skip the queues, we handle it." },
  { value: "prdp",     label: "PrDP Application",               desc: "Professional driving permit help." },
];

const vehicleServiceOptions = [
  { value: "car-registration",     label: "Car Registration & Licensing",  desc: "New, transfers, and renewals." },
  { value: "number-plates",        label: "Number Plates",                 desc: "Standard and personalised plates." },
  { value: "disk-renewal",         label: "Disk Renewal",                  desc: "No queues, delivered to you." },
  { value: "police-clearance",     label: "Police Clearance",              desc: "For employment or immigration." },
  { value: "export-clearance",     label: "Export Police Clearance",       desc: "Clear your vehicle for export." },
  { value: "vin-update",           label: "VIN Update",                    desc: "NATIS corrections & VIN plates." },
  { value: "roadworthy",           label: "Roadworthy Certificate",        desc: "Prep and test station booking." },
  { value: "duplicates",           label: "Duplicates",                    desc: "Lost disc or registration docs." },
  { value: "microdots",            label: "Microdots",                     desc: "Anti-theft ID for your vehicle." },
  { value: "vintage-registration", label: "Vintage Car Registration",      desc: "Classic & heritage vehicle docs." },
];

const timeSlots = [
  { value: "morning",        label: "Morning",       range: "8am – 12pm" },
  { value: "afternoon",      label: "Afternoon",     range: "12pm – 4pm" },
  { value: "late-afternoon", label: "Late Afternoon", range: "4pm – 6pm" },
];

const allServices = [...drivingServices, ...vehicleServiceOptions];

// ─── Progress Indicator ───────────────────────────────────────────────────────

function ProgressIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = ["Service", "Details", "Date & Time"];
  return (
    <div className="flex items-start justify-center gap-0 mb-10">
      {steps.map((label, idx) => {
        const stepNum = (idx + 1) as 1 | 2 | 3;
        const isActive = currentStep === stepNum;
        const isDone = currentStep > stepNum;
        return (
          <div key={stepNum} className="flex items-start">
            {idx > 0 && (
              <div
                className={cn(
                  "h-px w-10 mt-4 shrink-0",
                  isDone ? "bg-[#f5d800]" : "bg-[#2a2a2a]"
                )}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  isActive && "bg-[#f5d800] text-black",
                  isDone && "bg-[#f5d800] text-black",
                  !isActive && !isDone && "bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-500"
                )}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span
                className={cn(
                  "text-[11px] whitespace-nowrap",
                  isActive ? "text-[#f5d800]" : "text-zinc-600"
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const watchedCategory   = form.watch("serviceCategory");
  const watchedLicense    = form.watch("licenseType");
  const watchedTime       = form.watch("preferredTime");
  const watchedDate       = form.watch("preferredDate");

  // ── Step navigation ──────────────────────────────────────────────────────

  const goToStep2 = () => setCurrentStep(2);

  const goToStep3 = async () => {
    const valid = await form.trigger(["fullName", "phone", "email"]);
    if (valid) setCurrentStep(3);
  };

  const goBack = () => setCurrentStep((s) => (s - 1) as 1 | 2);

  // ── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);

    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Service unavailable. Please try again later.",
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

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationType: 'booking',
          data: {
            ...bookingData,
            bookingId: docRef.id,
          },
        }),
      });
    } catch {
      // Email failure is non-blocking — booking is already saved to Firestore
    }

    setIsSuccess(true);
    setIsSubmitting(false);
  };

  // ── Derived display values ───────────────────────────────────────────────

  const serviceLabel = allServices.find((s) => s.value === watchedLicense)?.label;
  const categoryIcon = watchedCategory === "driving" ? "🚗" : "📋";

  // ── Dark input class ─────────────────────────────────────────────────────

  const darkInput =
    "bg-[#141414] border-[#2a2a2a] text-white placeholder:text-zinc-600 " +
    "focus-visible:ring-[#f5d800] focus-visible:ring-offset-0 focus-visible:border-[#f5d800]";

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Minimal header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
        <span className="text-2xl font-bold font-headline text-[#f5d800]">QH</span>
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Back to site
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* ── Success screen ─────────────────────────────────────────── */}
          {isSuccess ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#f5d800] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Booking Request Received!</h2>
              <p className="text-zinc-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                We&apos;ve received your request and will be in touch shortly to confirm your booking.
              </p>
              <Link
                href="/"
                className="text-[#f5d800] hover:underline underline-offset-4 text-sm"
              >
                ← Return to site
              </Link>
            </div>

          ) : (
            /* ── Wizard ────────────────────────────────────────────────── */
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ProgressIndicator currentStep={currentStep} />

                {/* ── STEP 1: Service ──────────────────────────────────── */}
                {currentStep === 1 && (
                  <div>
                    <p className="text-xs text-[#f5d800] font-bold tracking-widest mb-1">
                      STEP 1 OF 3
                    </p>
                    <h1 className="text-2xl font-bold mb-6">What are you booking?</h1>

                    {/* Category cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        { value: "driving" as const, icon: "🚗", label: "Driving Lessons",      sub: "Lessons & licences" },
                        { value: "vehicle" as const, icon: "📋", label: "Vehicle Services",     sub: "Registration & docs" },
                      ].map((cat) => {
                        const isSelected = watchedCategory === cat.value;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => {
                              form.setValue("serviceCategory", cat.value);
                              form.setValue("licenseType", "");
                            }}
                            className={cn(
                              "rounded-xl p-4 text-left transition-colors border",
                              isSelected
                                ? "border-2 border-[#f5d800] bg-[#141414]"
                                : "border-[#2a2a2a] bg-[#111] hover:bg-[#141414]"
                            )}
                          >
                            <span className="text-2xl block mb-2">{cat.icon}</span>
                            <p
                              className={cn(
                                "font-bold text-sm",
                                isSelected ? "text-[#f5d800]" : "text-white"
                              )}
                            >
                              {cat.label}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">{cat.sub}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Service grid — appears once category chosen */}
                    {watchedCategory && (
                      <div>
                        <p className="text-sm text-zinc-400 mb-3">Which service?</p>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {(watchedCategory === "driving"
                            ? drivingServices
                            : vehicleServiceOptions
                          ).map((opt) => {
                            const isSelected = watchedLicense === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => form.setValue("licenseType", opt.value)}
                                className={cn(
                                  "rounded-xl p-3 text-left transition-colors border",
                                  isSelected
                                    ? "border-2 border-[#f5d800] bg-[#141414]"
                                    : "border-[#2a2a2a] bg-[#111] hover:bg-[#141414]"
                                )}
                              >
                                <p
                                  className={cn(
                                    "font-bold text-xs leading-snug",
                                    isSelected ? "text-[#f5d800]" : "text-white"
                                  )}
                                >
                                  {opt.label}
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                                  {opt.desc}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={goToStep2}
                      disabled={!watchedCategory || !watchedLicense}
                      className="w-full h-12 bg-[#f5d800] text-black font-bold text-base hover:bg-[#e5c800] disabled:opacity-30"
                    >
                      Next →
                    </Button>
                  </div>
                )}

                {/* ── STEP 2: Details ───────────────────────────────────── */}
                {currentStep === 2 && (
                  <div>
                    <p className="text-xs text-[#f5d800] font-bold tracking-widest mb-1">
                      STEP 2 OF 3
                    </p>
                    <h1 className="text-2xl font-bold mb-6">Tell us about you</h1>

                    <div className="space-y-5 mb-8">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 text-sm">Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                autoComplete="name"
                                className={darkInput}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 text-sm">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="0812345678"
                                autoComplete="tel"
                                className={darkInput}
                                {...field}
                              />
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
                            <FormLabel className="text-zinc-300 text-sm">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                className={darkInput}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={goBack}
                        variant="outline"
                        className="flex-1 border-[#2a2a2a] bg-transparent text-zinc-400 hover:bg-[#1a1a1a] hover:text-white"
                      >
                        ← Back
                      </Button>
                      <Button
                        type="button"
                        onClick={goToStep3}
                        className="flex-1 bg-[#f5d800] text-black font-bold hover:bg-[#e5c800]"
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Date & Time ───────────────────────────────── */}
                {currentStep === 3 && (
                  <div>
                    <p className="text-xs text-[#f5d800] font-bold tracking-widest mb-1">
                      STEP 3 OF 3
                    </p>
                    <h1 className="text-2xl font-bold mb-6">When works for you?</h1>

                    {/* Booking summary strip */}
                    {serviceLabel && (
                      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
                        <span>{categoryIcon}</span>
                        <span className="text-zinc-300">{serviceLabel}</span>
                      </div>
                    )}

                    <div className="space-y-6 mb-8">
                      {/* Date picker */}
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-zinc-300 text-sm">Preferred Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start font-normal border-[#2a2a2a] bg-[#141414] text-white hover:bg-[#1a1a1a] hover:text-white",
                                      !field.value && "text-zinc-500"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-[#141414] border-[#2a2a2a]" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                  classNames={{
                                    caption_label: "text-white",
                                    nav_button:
                                      "border border-[#2a2a2a] bg-[#141414] text-white hover:bg-[#1f1f1f]",
                                    head_cell: "text-zinc-500",
                                    day: "text-white hover:bg-[#2a2a2a] rounded-md",
                                    day_selected:
                                      "bg-[#f5d800] text-black hover:bg-[#f5d800] focus:bg-[#f5d800]",
                                    day_today: "bg-[#1f1f1f] text-[#f5d800]",
                                    day_outside: "text-zinc-600",
                                    day_disabled: "text-zinc-700 opacity-50",
                                    table: "border-collapse",
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Time slot cards */}
                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-zinc-300 text-sm">Preferred Time Slot</FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                              {timeSlots.map((slot) => {
                                const isSelected = watchedTime === slot.value;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => form.setValue("preferredTime", slot.value)}
                                    className={cn(
                                      "rounded-xl p-3 text-left border transition-colors",
                                      isSelected
                                        ? "border-[#f5d800] bg-[#141414]"
                                        : "border-[#2a2a2a] bg-[#111] hover:bg-[#141414]"
                                    )}
                                  >
                                    <p
                                      className={cn(
                                        "font-bold text-sm",
                                        isSelected ? "text-[#f5d800]" : "text-white"
                                      )}
                                    >
                                      {slot.label}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{slot.range}</p>
                                  </button>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={goBack}
                        variant="outline"
                        className="flex-1 border-[#2a2a2a] bg-transparent text-zinc-400 hover:bg-[#1a1a1a] hover:text-white"
                      >
                        ← Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !watchedDate || !watchedTime}
                        className="flex-1 h-12 bg-[#f5d800] text-black font-bold text-base hover:bg-[#e5c800] disabled:opacity-30"
                      >
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Request Booking
                      </Button>
                    </div>
                  </div>
                )}

              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
