export const GOOGLE_FORM_CONFIG = {
  // BOOKING FORM CONFIGURATION
  formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdB36r14BkVvHT2W_kcr9F-JtNx6nWQPbyNGeiz8rtZ34_eQA/formResponse",
  entries: {
    name: "entry.111111111",         // Full Name
    email: "entry.222222222",        // Email Address
    phone: "entry.333333333",        // Phone Number (WhatsApp)
    eventName: "entry.444444444",    // Event Name (Hidden/Auto-filled)
    qty: "entry.555555555",          // Number of Tickets
    notes: "entry.666666666",        // Additional Notes
    
    dob: "entry.777777777",          // Date of Birth
    gender: "entry.888888888",       // Gender
    paymentTo: "entry.999999999",    // Payment Made To (Arjuna / Deepa)
    upiName: "entry.121212121",      // Your UPI Name
    upiId: "entry.131313131",        // UPI Transaction ID
    paymentMethod: "entry.141414141",// Payment Method (GPay/PhonePe/etc)
    attendedBefore: "entry.151515151", // Attended Before?
    cityPart: "entry.202020202",     // Part of City
    artistCollab: "entry.161616161", // Are you an Artist? / Collaborate
    seatingPreference: "entry.171717171", // Seating preference
    instagram: "entry.181818181",    // Instagram Id
    amountPaid: "entry.191919191"    // Amount Paid in INR
  },
  
  // VOLUNTEER FORM CONFIGURATION
  volunteerFormActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc7JUMJCBbd35ApJ1pX6ak-07AmBtC-rgF3YlmsRh-c272olQ/formResponse",
  volunteerEntries: {
    // Step 1: Basic Info
    name: "entry.10001",
    phone: "entry.10002",
    email: "entry.10003",
    instagram: "entry.10004",
    city: "entry.10005",
    foundOut: "entry.10006",
    
    // Step 2: Department
    primaryDept: "entry.20001",
    secondDept: "entry.20002",
    
    // Creative Direction
    cdRole: "entry.21001",
    cdExp: "entry.21002",
    cdVision: "entry.21003",
    cdPort: "entry.21004",
    
    // Stage Design
    sdBg: "entry.22001",
    sdRole: "entry.22002",
    sdExp: "entry.22003",
    sdAccess: "entry.22004",
    sdVision: "entry.22005",
    sdPort: "entry.22006",
    
    // Costume
    csBg: "entry.23001",
    csRole: "entry.23002",
    csExp: "entry.23003",
    csPort: "entry.23004",
    csInsta: "entry.23005",
    
    // Visual Content
    vcSkills: "entry.24001",
    vcExp: "entry.24002",
    vcEquip: "entry.24003",
    vcPort: "entry.24004",
    vcInsta: "entry.24005",
    
    // Audio Engineering
    aeRole: "entry.25001",
    aeExp: "entry.25002",
    aeOutdoor: "entry.25003",
    aeEquip: "entry.25004",
    
    // Production
    prRole: "entry.26001",
    prPeople: "entry.26002",
    prComfort: "entry.26003",
    
    // MC/Hosting
    mcHosted: "entry.27001",
    mcLang: "entry.27002", // multi-select
    mcComfort: "entry.27003",
    mcVideo: "entry.27004",
    
    // Step 3: Commitment
    involvement: "entry.30001",
    dates: "entry.30002", // multi-select
    
    // Step 4: About You
    emergName: "entry.40001",
    emergNum: "entry.40002",
    attendedBefore: "entry.40003",
    whyJoin: "entry.40004",
    hopeGain: "entry.40005", // multi-select
    
    // Step 5: Declaration
    dec1: "entry.50001",
    dec2: "entry.50002"
  }
};