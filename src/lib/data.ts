import { ShieldCheck, CalendarCheck, Award, Trophy, UserCheck, BookOpen, Car, FileText, RefreshCw, Search, Tag, Wrench, Shield, Copy, Fingerprint, History } from "lucide-react";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Driving Services" },
  { href: "/services/vehicle", label: "Vehicle Services" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const services = [
  {
    title: "Online Bookings",
    slug: "online-bookings",
    imageId: "service-online-booking",
    shortDescription: "Schedule your driving lessons anytime, anywhere with our easy-to-use online system.",
    description: "Our seamless online booking system allows you to schedule, reschedule, and manage your driving lessons 24/7 from any device. Choose your preferred instructor, pick a time that works for you, and get instant confirmation. It's driving lessons, on your schedule."
  },
  {
    title: "Driver's License Renewals",
    slug: "drivers-license-renewals",
    imageId: "service-renewals",
    shortDescription: "Hassle-free assistance with renewing your driver's license card.",
    description: "Is your driver's license expiring soon? We assist with the entire renewal process, from booking your spot at the traffic department to ensuring you have all the correct documentation. Skip the queues and the stress."
  },
  {
    title: "Code A, B & EB",
    slug: "code-a-b-eb",
    imageId: "service-code-ab-eb",
    shortDescription: "Master motorcycles (Code A) and light motor vehicles (Code B & EB).",
    description: "Whether you're looking to ride a motorcycle (Code A), drive a car (Code B), or tow a caravan or trailer (Code EB), our expert instructors provide tailored lessons to ensure you master the vehicle with confidence and pass your test with ease."
  },
  {
    title: "Code C1 & Code EC",
    slug: "code-c1-ec",
    imageId: "service-code-c1-ec",
    shortDescription: "Professional training for medium and heavy-duty vehicles.",
    description: "Advance your career with a heavy vehicle license. We offer comprehensive training for Code C1 (medium goods vehicles) and Code EC (heavy combination vehicles), focusing on safety, vehicle control, and road regulations to make you a competent professional driver."
  },
  {
    title: "Booking of PrDP",
    slug: "booking-of-prdp",
    imageId: "service-prdp",
    shortDescription: "Obtain your Professional Driving Permit with our expert guidance.",
    description: "A Professional Driving Permit (PrDP) is essential for anyone driving for a living. We guide you through the application process, from medical checks to paperwork, ensuring you meet all requirements to legally transport goods, fare-paying passengers, or dangerous goods."
  },
  {
    title: "Learner's & Driver's License",
    slug: "learners-and-drivers-license",
    imageId: "service-learners-drivers",
    shortDescription: "Your complete journey from getting your learner's to your full driver's license.",
    description: "This is our core service. We start by helping you ace your learner's license test with comprehensive study materials and support. Then, our structured, step-by-step practical lessons will build your skills and confidence behind the wheel, preparing you for a first-time pass."
  },
  {
    title: "Card Issuing",
    slug: "card-issuing",
    imageId: "service-card-issuing",
    shortDescription: "Assistance in the final step: collecting your new license card.",
    description: "After you've passed, the final hurdle is collecting your license card. We can assist in tracking the printing process and advising on the best time to collect, making the final step as smooth as the first."
  },
  {
    title: "Guaranteed Pass",
    slug: "guaranteed-pass",
    imageId: "service-guaranteed-pass",
    shortDescription: "Our specialized program designed to ensure you pass your test.",
    description: "Our Guaranteed Pass package is an intensive, tailored program designed for ultimate success. It includes a set number of lessons, pre-test evaluations, and a dedicated instructor to work on your weak points. We're so confident in our method that we offer additional support if you don't pass on the first try. *Terms and conditions apply."
  },
];

export const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Trusted Instructors",
    description: "Our instructors are certified, patient, and committed to your safety and success.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Bookings",
    description: "Flexible scheduling and a simple online booking system put you in control of your lessons.",
  },
  {
    icon: Award,
    title: "Guaranteed Pass",
    description: "With our proven methods and dedicated support, we offer packages that guarantee success.",
  },
];

export const testimonials = [
  {
    name: "Thabo Ndlovu",
    license: "Code B License",
    quote: "QH Driving School made the entire process so easy. My instructor was patient and gave me the confidence I needed to pass on my first try. Highly recommended!",
  },
  {
    name: "Jessica Pienaar",
    license: "Code EB License",
    quote: "I needed my EB license for our family caravan, and I was so nervous. The team at QH was fantastic, and I learned everything I needed to know about towing safely.",
  },
  {
    name: "Mohammed Khan",
    license: "Code C1 License",
    quote: "Professional from start to finish. The online booking was a breeze and the lessons for my C1 license were top-notch. I got the job I wanted thanks to them.",
  },
  {
    name: "Lerato Mokoena",
    license: "Learner's License",
    quote: "I struggled to pass my learner's test twice before coming to QH. Their study material and support made all the difference. Passed with 100%!",
  },
];

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  publishedAt: string;
  imageUrl: string;
  imageHint: string;
  excerpt: string;
  content: string; // Markdown content
}

export const vehicleServices = [
  {
    title: "Car Registration & Licensing",
    slug: "car-registration-licensing",
    imageId: "service-car-registration",
    icon: Car,
    shortDescription: "Full vehicle registration and licensing service — new, transfers, and renewals.",
    description: "We handle the full vehicle registration process for new purchases, ownership transfers, and licensing renewals. Bring your documents and we take care of the rest, from NATIS submissions to license disk collection. Stress-free, efficient, and accurate every time."
  },
  {
    title: "Number Plates",
    slug: "number-plates",
    imageId: "service-number-plates",
    icon: Tag,
    shortDescription: "Standard and personalised number plates manufactured and fitted.",
    description: "We supply and fit both standard and personalised number plates that comply with all SANS regulations. Whether you need a replacement pair or are applying for a personalised plate through the DLTC, we handle the paperwork and the manufacturing."
  },
  {
    title: "Disk Renewal",
    slug: "disk-renewal",
    imageId: "service-disk-renewal",
    icon: RefreshCw,
    shortDescription: "Vehicle licence disk renewal — no queues at the traffic department.",
    description: "Renew your vehicle's license disk without standing in long queues. We submit your renewal application, settle any outstanding fees on your behalf, and deliver your new disk directly. Valid for all light motor vehicles registered in Gauteng."
  },
  {
    title: "Police Clearance",
    slug: "police-clearance",
    imageId: "service-police-clearance",
    icon: Shield,
    shortDescription: "South African Police Clearance Certificates for local and international purposes.",
    description: "We assist with the application for South African Police Clearance Certificates (PCCs), required for employment, immigration, and regulatory purposes. We guide you through fingerprinting, SAPS submission, and collection of the certified certificate."
  },
  {
    title: "Export Police Clearance",
    slug: "export-police-clearance",
    imageId: "service-export-clearance",
    icon: FileText,
    shortDescription: "Police clearance certificates specifically for exporting vehicles.",
    description: "Planning to export a vehicle? An Export Police Clearance Certificate confirms the vehicle is not stolen and clears it for legal export. We manage the entire application through SAPS and the DLTC, ensuring all documentation meets customs and shipping requirements."
  },
  {
    title: "VIN Update",
    slug: "vin-update",
    imageId: "service-vin-update",
    icon: Search,
    shortDescription: "VIN plate replacement and NATIS record corrections.",
    description: "If your vehicle's VIN plate is damaged, missing, or recorded incorrectly on NATIS, we assist with the official replacement and update process through the relevant authorities. This includes liaising with SAPS for verification and submitting the correction to the DLTC."
  },
  {
    title: "Roadworthy Certificate",
    slug: "roadworthy-certificate",
    imageId: "service-roadworthy",
    icon: Wrench,
    shortDescription: "Roadworthy testing and certificate assistance.",
    description: "A Roadworthy Certificate is required for vehicle sales, re-registration, and certain licensing processes. We help you prepare your vehicle for the test, book at an authorised testing station, and obtain the certificate — minimising re-test failures."
  },
  {
    title: "Duplicates",
    slug: "duplicates",
    imageId: "service-duplicates",
    icon: Copy,
    shortDescription: "Replacement license discs, registration certificates, and other official documents.",
    description: "Lost or damaged your license disc, registration certificate, or any other vehicle document? We process duplicate applications through the correct channels so you can get legally compliant replacements as quickly as possible."
  },
  {
    title: "Microdots",
    slug: "microdots",
    imageId: "service-microdots",
    icon: Fingerprint,
    shortDescription: "Anti-theft microdot application for vehicle identification.",
    description: "Microdots are a proven anti-theft technology — thousands of microscopic dots etched with your vehicle's unique identifier are applied throughout the vehicle. Insurance companies recognise microdot-marked vehicles, and many offer reduced premiums. We supply and apply certified microdot kits."
  },
  {
    title: "Vintage Car Registration",
    slug: "vintage-car-registration",
    imageId: "service-vintage",
    icon: History,
    shortDescription: "Specialist registration and introductions for vintage and classic vehicles.",
    description: "Introducing and registering a vintage or classic vehicle in South Africa involves specialised paperwork, heritage body inspections, and specific NATIS codes. Our team has experience navigating the unique requirements for pre-1960s vehicles, imports, and kit cars to get your prized possession legally on the road."
  },
];

export const galleryItems = [
    { id: "gallery-1", description: "Happy student holding a driver's license." },
    { id: "gallery-2", description: "Another happy student holding their license." },
    { id: "gallery-3", description: "QH Driving School branded car." },
    { id: "gallery-4", description: "Another happy student with their license." },
    { id: "gallery-5", description: "A QH branded motor bike." },
    { id: "gallery-6", description: "Student receiving a certificate of completion." },
    { id: "gallery-7", description: "Student receiving a certificate of completion." },
    { id: "gallery-8", description: "Student receiving a certificate of completion." },
];
