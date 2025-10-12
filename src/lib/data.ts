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

export const blogPosts: BlogPost[] = [
  {
    title: "5 Tips for Mastering Parallel Parking",
    slug: "5-tips-for-mastering-parallel-parking",
    publishedAt: "2024-07-15T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1648573688136-de51ced7aa0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwYXJhbGxlbCUyMHBhcmtpbmcnZXx8MHx8fHwxNzU5Nzc1NTM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "parallel parking",
    excerpt: "Parallel parking can be intimidating, but it doesn't have to be. With our step-by-step guide, you'll be slotting into tight spaces like a pro in no time...",
    content: `
Parallel parking is a driving skill that many find daunting, but with the right technique, it becomes second nature. Here are five tips to help you master it.

### 1. Pick the Right Spot
Choose a parking space that is at least one and a half times the length of your car. This gives you enough room to maneuver without stress.

### 2. The Initial Position is Key
Pull up alongside the car you'll be parking behind, aligning your rear bumpers. You should be about 2-3 feet away from the other car.

### 3. Start Reversing Straight
Turn your steering wheel all the way to the left (or right, depending on the side of the road). Reverse slowly until your car is at a 45-degree angle to the curb. A good reference point is when you can see the entire front of the car behind you in your driver's side mirror.

### 4. Straighten and Continue
Now, straighten your steering wheel and continue to reverse straight back. Keep going until your front bumper has cleared the rear bumper of the car in front of you.

### 5. Final Turn into the Spot
Turn your steering wheel all the way in the opposite direction (towards the curb). This will swing the front of your car into the space. Keep reversing slowly until you are parallel with the curb. You may need to pull forward slightly to center your car in the space.

Practice makes perfect! Find an empty parking lot and use cones to practice these steps. You'll be a parallel parking expert in no time.`
  },
  {
    title: "Understanding South African Road Signs",
    slug: "understanding-south-african-road-signs",
    publishedAt: "2024-07-01T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1572670014853-1d3a3f22b40f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxyb2FkJTIwc2lnbnN8ZW58MHx8fHwxNzU5NjcyNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "road signs",
    excerpt: "Regulatory, warning, or guidance? We break down the different categories of road signs in South Africa to help you prepare for your learner's test and drive safer.",
    content: `
Road signs are the silent language of the road. Understanding them is crucial for passing your learner's test and for safe driving. In South Africa, signs are divided into several categories.

### Regulatory Signs
These are usually circular with a red border and tell you what you *must* or *must not* do. The most common is the Stop sign (an octagon) and the Yield sign (an inverted triangle). Others include speed limits and no-entry signs.

### Warning Signs
These are typically triangular with a red border and warn you of potential hazards ahead, such as sharp curves, slippery roads, or animal crossings. They are designed to give you time to adjust your driving.

### Information and Guidance Signs
These are rectangular and provide information. Blue signs often indicate directions or facilities, while green signs are used for guidance on freeways.

Mastering these signs is a key part of your learner's license preparation. Our classes include dedicated modules to ensure you know them all by heart.`
  },
  {
    title: "What to Expect on Your Driver's Test Day",
    slug: "what-to-expect-on-your-drivers-test-day",
    publishedAt: "2024-06-20T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1629015346993-2c1aa5d94cb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxkcml2aW5nJTIwdmlld3xlbnwwfHx8fDE3NTk3NzU1MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "driving view",
    excerpt: "The big day is approaching! Here’s a checklist of what to bring, what the examiner will be looking for, and how to keep your nerves in check to ensure success.",
    content: `
The practical driving test is the final step to freedom. Knowing what to expect can significantly calm your nerves.

### Before the Test
*   **Pre-Trip Inspection:** You will be asked to perform an exterior and interior pre-trip inspection of the vehicle. You must know how to check lights, wipers, tyres, and fluids.
*   **Documentation:** Ensure you have your ID book/card, learner's license, and booking confirmation.

### The Yard Test
This is the first part of the test. You'll be required to perform several maneuvers:
*   Parallel parking
*   Alley docking (reversing into a bay)
*   Three-point turn
You must complete these without hitting any poles and within the designated number of attempts.

### The Road Test
After successfully completing the yard test, you'll go out onto public roads with the examiner. They will be assessing your ability to:
*   Obey traffic signs and signals.
*   Perform observation checks (mirrors, blind spots).
*   Maintain a safe following distance.
*   Handle the vehicle smoothly and confidently.

Remember to stay calm, listen carefully to the examiner's instructions, and drive safely. Good luck!`
  }
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
