/**
 * Knowledge Base for QH Driving School.
 * This serves as the "Source of Truth" for the AI assistant.
 * In a more advanced version, this would be fetched from Firestore or a Vector DB.
 */

export const QH_KNOWLEDGE_BASE = {
  location: {
    area: "Roodepoort, Gauteng, South Africa",
    address: "Contact us for the exact training facility location in Roodepoort.",
    operatingHours: "Monday to Saturday, 8am – 5pm."
  },
  services: {
    driving: [
      {
        name: "Learner's License Preparation",
        description: "Assistance with study material and test booking for the theory exam.",
        codes: "All codes (A, B, C1, EC)."
      },
      {
        name: "Code B (Light Motor Vehicle)",
        description: "Standard car driving lessons (Manual or Automatic).",
        target: "Beginners to advanced learners."
      },
      {
        name: "Code EB (Towing)",
        description: "Specialized training for towing caravans, trailers, and boats.",
        requirement: "Must already have a Code B license."
      },
      {
        name: "Heavy Vehicles (Code C1 & EC)",
        description: "Professional training for trucks and heavy combination vehicles.",
        target: "Professional drivers and commercial career seekers."
      }
    ],
    vehicle: [
      {
        name: "Registration & Licensing",
        description: "Handling of new vehicle registration, ownership transfers, and disc renewals."
      },
      {
        name: "Police Clearance",
        description: "Assistance with obtaining PCCs for employment, immigration, or vehicle export."
      },
      {
        name: "VIN Updates",
        description: "Official replacement of damaged/missing VIN plates and NATIS corrections."
      }
    ]
  },
  policies: {
    booking: "Online bookings are preferred. A representative will call to confirm within 24 hours.",
    guaranteedPass: "A specialized package with extra support until you pass. *Terms and conditions apply.",
    pricing: "Custom quotes are provided based on the package and number of lessons. Contact us for the latest rates."
  }
};
