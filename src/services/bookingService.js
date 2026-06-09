import { GOOGLE_FORM_CONFIG } from "../config/googleFormConfig";

/**
 * Service to handle booking submissions.
 * Currently uses Google Forms as a backend, but can easily be swapped
 * for Supabase, Firebase, or MongoDB without changing the UI.
 */
export const bookingService = {
  submitBooking: async (bookingData) => {
    try {
      const formData = new URLSearchParams();
      
      // Map our bookingData object to the specific entry.XXX IDs Google Forms expects
      formData.append(GOOGLE_FORM_CONFIG.entries.name, bookingData.name);
      formData.append(GOOGLE_FORM_CONFIG.entries.email, bookingData.email);
      formData.append(GOOGLE_FORM_CONFIG.entries.phone, bookingData.phone);
      formData.append(GOOGLE_FORM_CONFIG.entries.eventName, bookingData.eventName);
      formData.append(GOOGLE_FORM_CONFIG.entries.tickets, bookingData.qty.toString());
      
      if (bookingData.notes) {
        formData.append(GOOGLE_FORM_CONFIG.entries.notes, bookingData.notes);
      }

      // Submit to Google Forms using 'no-cors'
      // Note: 'no-cors' means we can't read the response directly, 
      // but the POST request still goes through successfully.
      await fetch(GOOGLE_FORM_CONFIG.formActionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString(),
      });
      
      return { success: true };
    } catch (error) {
      console.error("Booking submission failed:", error);
      return { success: false, error: error.message };
    }
  }
};
