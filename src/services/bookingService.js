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
      formData.append(GOOGLE_FORM_CONFIG.entries.name, bookingData.name || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.email, bookingData.email || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.phone, bookingData.phone || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.eventName, bookingData.eventName || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.tickets, bookingData.qty ? bookingData.qty.toString() : "1");
      formData.append(GOOGLE_FORM_CONFIG.entries.dob, bookingData.dob || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.gender, bookingData.gender || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.paymentTo, bookingData.paymentTo || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.upiName, bookingData.upiName || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.upiId, bookingData.upiId || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.paymentMethod, bookingData.paymentMethod || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.attendedBefore, bookingData.attendedBefore || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.cityPart, bookingData.cityPart || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.artistCollab, bookingData.artistCollab || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.seatingPreference, bookingData.seatingPreference || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.instagram, bookingData.instagram || "");
      formData.append(GOOGLE_FORM_CONFIG.entries.amountPaid, bookingData.amountPaid ? bookingData.amountPaid.toString() : "");
      
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

      // ─── TICKET EMAIL DISPATCH SIMULATION ───
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`TANGY_TICKET_${bookingData.eventName}_${bookingData.email}_${bookingData.qty || 1}`)}`;
      console.log(`
      📬 [EMAIL SIMULATION] Sending Confirmation Email...
      To: ${bookingData.email}
      Subject: Your Tangy Sessions Tickets are Confirmed! 🎟️
      
      Hi ${bookingData.name || "Guest"},
      
      Your spot is reserved for "${bookingData.eventName}".
      Tickets: ${bookingData.qty || 1}x
      
      Please present the attached QR code at the venue gate for scanning:
      QR Code URL: ${qrCodeUrl}
      
      See you beneath history!
      - The Tangy Team
      `);
      
      return { success: true };
    } catch (error) {
      console.error("Booking submission failed:", error);
      return { success: false, error: error.message };
    }
  }
};
