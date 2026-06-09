export const GOOGLE_FORM_CONFIG = {
  // Replace this with your actual formResponse URL
  // e.g., "https://docs.google.com/forms/d/e/1FAIpQLS.../formResponse"
  formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdB36r14BkVvHT2W_kcr9F-JtNx6nWQPbyNGeiz8rtZ34_eQA/formResponse",
  
  // Replace these with the actual "entry.XXXXXX" IDs from your Google Form
  entries: {
    name: "entry.111111111",         // Your Full Name
    email: "entry.222222222",        // Email Address
    phone: "entry.333333333",        // Mobile Number
    eventName: "entry.444444444",    // Event Name (Hidden)
    tickets: "entry.555555555",      // Number of tickets booked
    notes: "entry.666666666",        // Anything else you'd like to share?
    dob: "entry.777777777",          // Date of Birth
    gender: "entry.888888888",       // Gender
    paymentTo: "entry.999999999",    // Payment made to
    upiName: "entry.101010101",      // Who made the payment? (UPI Name)
    upiId: "entry.121212121",        // UPI Transaction ID
    paymentMethod: "entry.131313131",// Payment made through
    attendedBefore: "entry.141414141",// Have you attended a Tangy Session before?
    cityPart: "entry.151515151",     // Which part of the city are you coming from?
    artistCollab: "entry.161616161", // Are you an Artist? / Collaborate
    seatingPreference: "entry.171717171", // Seating preference
    instagram: "entry.181818181",    // Instagram Id
    amountPaid: "entry.191919191"    // Amount Paid in INR
  },
  
  // VOLUNTEER FORM CONFIGURATION
  volunteerFormActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc7JUMJCBbd35ApJ1pX6ak-07AmBtC-rgF3YlmsRh-c272olQ/formResponse",
  volunteerEntries: {
    name: "entry.111111111",      // Full Name
    email: "entry.222222222",     // Email
    phone: "entry.333333333",     // Phone
    dob: "entry.444444444",       // DOB
    why: "entry.555555555",       // Why do you want to volunteer?
    team: "entry.666666666",      // Which team?
    experience: "entry.777777777",// Prior experience?
    social: "entry.888888888"     // Instagram / LinkedIn
  }
};
