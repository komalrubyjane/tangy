import { GOOGLE_FORM_CONFIG } from "../config/googleFormConfig";

export const volunteerService = {
  submitApplication: async (volunteerData) => {
    try {
      const formData = new URLSearchParams();
      
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.name, volunteerData.name || "");
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.email, volunteerData.email || "");
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.phone, volunteerData.phone || "");
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.dob, volunteerData.dob || "");
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.why, volunteerData.why || "");
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.team, volunteerData.team || "");
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.experience, volunteerData.experience || "");
      formData.append(GOOGLE_FORM_CONFIG.volunteerEntries.social, volunteerData.social || "");

      await fetch(GOOGLE_FORM_CONFIG.volunteerFormActionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString(),
      });
      
      return { success: true };
    } catch (error) {
      console.error("Volunteer submission failed:", error);
      return { success: false, error: error.message };
    }
  }
};
