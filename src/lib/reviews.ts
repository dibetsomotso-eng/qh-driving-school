import { client } from '@/sanity/lib/client';

export interface Review {
  name: string;
  rating: number;
  quote: string;
  license?: string;
  date: string;
  source: string;
  avatar?: string;
}

export async function getReviews() {
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID;

  let googleReviews: Review[] = [];
  let googleStats = { totalRating: 5.0, totalReviews: 0 };

  // 1. Fetch from Google Places API (New)
  if (GOOGLE_API_KEY && PLACE_ID) {
    try {
      const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
      const response = await fetch(url, {
        headers: {
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
        },
        next: { revalidate: 21600 },
      });
      const data = await response.json();

      if (data.reviews) {
        googleReviews = data.reviews.map((r: {
          authorAttribution: { displayName: string; photoUri?: string };
          rating: number;
          text?: { text: string };
          publishTime: string;
        }) => ({
          name: r.authorAttribution.displayName,
          rating: r.rating,
          quote: r.text?.text ?? '',
          license: 'Google Review',
          date: new Date(r.publishTime).toISOString().split('T')[0],
          source: 'Google',
          avatar: r.authorAttribution.photoUri,
        }));
        googleStats = {
          totalRating: data.rating ?? 5.0,
          totalReviews: data.userRatingCount ?? 0,
        };
      }
    } catch (error) {
      console.error('Error fetching Google Reviews:', error);
    }
  }

  // 2. Fetch from Sanity
  let sanityReviews: Review[] = [];
  try {
    const query = `*[_type == "testimonial"] | order(date desc) {
      name,
      rating,
      quote,
      license,
      date,
      source,
      "avatar": avatar
    }`;
    sanityReviews = await client.fetch(query);
  } catch (error) {
    console.error('Error fetching Sanity testimonials:', error);
  }

  // 3. Combine and fallback to real reviews if everything else fails (to ensure authentic experience)
  let allReviews: typeof googleReviews = [...googleReviews, ...sanityReviews];

  if (allReviews.length === 0) {
    allReviews = [
      {
        name: "Thandeka Skosana",
        rating: 5,
        quote: "Thank you, QH Driving School, for the excellent service you provided. The instructor assigned to me was patient, supportive, and dedicated throughout my driving lessons.",
        license: "Verified Student",
        date: "2024-04-15",
        source: "Google"
      },
      {
        name: "Hlabekisa Mashakeng",
        rating: 5,
        quote: "I had a phenomenal experience with QH driving school, they are professional and an authentic driving school I highly recommend them. Im jovial to have passed and received my learners license.",
        license: "Learner's License",
        date: "2024-03-20",
        source: "Google"
      },
      {
        name: "Crazy Werrie",
        rating: 5,
        quote: "What an absolute pleasure using their services! It was a hassle free easy process! Will definitely recommend them when it comes to learners as well as drivers licenses!",
        license: "Verified Student",
        date: "2024-02-10",
        source: "Google"
      },
      {
        name: "Bonginkosi Mvelase",
        rating: 5,
        quote: "Best service and very professional. Patient instructor that will make you feel at home during the process",
        license: "Verified Student",
        date: "2024-01-25",
        source: "Google"
      }
    ];
  }
  
  return {
    reviews: allReviews,
    stats: {
      totalRating: googleStats.totalRating || 5.0,
      totalReviews: googleStats.totalReviews || allReviews.length
    }
  };
}
