import { ShieldCheck, CalendarCheck, Award, Trophy, UserCheck, BookOpen } from "lucide-react";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
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

export const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Mastering Parallel Parking",
    slug: "5-tips-for-mastering-parallel-parking",
    date: "2024-07-15",
    imageId: "blog-2",
    excerpt: "Parallel parking can be intimidating, but it doesn't have to be. With our step-by-step guide, you'll be slotting into tight spaces like a pro in no time...",
  },
  {
    id: 2,
    title: "Understanding South African Road Signs",
    slug: "understanding-south-african-road-signs",
    date: "2024-07-01",
    imageId: "blog-3",
    excerpt: "Regulatory, warning, or guidance? We break down the different categories of road signs in South Africa to help you prepare for your learner's test and drive safer.",
  },
  {
    id: 3,
    title: "What to Expect on Your Driver's Test Day",
    slug: "what-to-expect-on-your-drivers-test-day",
    date: "2024-06-20",
    imageId: "blog-1",
    excerpt: "The big day is approaching! Here’s a checklist of what to bring, what the examiner will be looking for, and how to keep your nerves in check to ensure success.",
  },
];

export const galleryItems = [
    { id: "gallery-1", description: "Happy student holding a driver's license." },
    { id: "gallery-2", description: "Instructor giving a thumbs up to a student." },
    { id: "gallery-3", description: "QH Driving School branded car." },
    { id: "gallery-4", description: "Student practicing a three-point turn." },
    { id: "gallery-5", description: "Close-up of hands on a steering wheel." },
    { id: "gallery-6", description: "Student receiving a certificate of completion." },
    { id: "gallery-7", description: "A group of students posing for a photo." },
    { id: "gallery-8", description: "A view from inside the car during a lesson." },
];
