import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Your configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhwd1NULj80sY0u3GwHzR67ZDs3byp4Qg",
  authDomain: "studio-3859332776-8df84.firebaseapp.com",
  projectId: "studio-3859332776-8df84",
  storageBucket: "studio-3859332776-8df84.firebasestorage.app",
  messagingSenderId: "990403811303",
  appId: "1:990403811303:web:2415c42a5768926603cf42",
  measurementId: "G-5PX5YD7HSS"
};

// Mock data (since we are outside the project structure)
const services = [
  { title: "Learner's & Driver's License", slug: "learners-and-drivers-license", description: "Complete journey from getting your learner's to your full driver's license." },
  { title: "Code A, B & EB", slug: "code-a-b-eb", description: "Master motorcycles and light motor vehicles." },
  { title: "Code C1 & Code EC", slug: "code-c1-ec", description: "Professional training for medium and heavy-duty vehicles." }
];

const vehicleServices = [
  { title: "Car Registration & Licensing", slug: "car-registration-licensing", description: "Full vehicle registration and licensing service." },
  { title: "Disk Renewal", slug: "disk-renewal", description: "Vehicle licence disk renewal without queues." }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runMigration() {
  console.log('Starting standalone migration...');
  
  try {
    // Migrate Driving Services
    for (const s of services) {
      await addDoc(collection(db, 'services'), {
        ...s,
        name: s.title,
        category: 'driving',
        lastUpdated: new Date().toISOString()
      });
      console.log(`Added: ${s.title}`);
    }

    // Migrate Vehicle Services
    for (const s of vehicleServices) {
      await addDoc(collection(db, 'services'), {
        ...s,
        name: s.title,
        category: 'vehicle',
        lastUpdated: new Date().toISOString()
      });
      console.log(`Added: ${s.title}`);
    }

    console.log('Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
