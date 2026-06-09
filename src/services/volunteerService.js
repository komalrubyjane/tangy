import { GOOGLE_FORM_CONFIG } from "../config/googleFormConfig";

export const volunteerService = {
  submitApplication: async (data) => {
    try {
      const formData = new URLSearchParams();
      const entries = GOOGLE_FORM_CONFIG.volunteerEntries;
      
      // Step 1: Basic Info
      formData.append(entries.name, data.name || "");
      formData.append(entries.phone, data.phone || "");
      formData.append(entries.email, data.email || "");
      formData.append(entries.instagram, data.instagram || "");
      formData.append(entries.city, data.city || "");
      formData.append(entries.foundOut, data.foundOut || "");

      // Step 2: Primary & Second Dept
      formData.append(entries.primaryDept, data.primaryDept || "");
      formData.append(entries.secondDept, data.secondDept || "");

      // Conditionals for Step 2
      if (data.primaryDept === "Creative Direction & Show Design") {
        formData.append(entries.cdRole, data.cdRole || "");
        formData.append(entries.cdExp, data.cdExp || "");
        formData.append(entries.cdVision, data.cdVision || "");
        formData.append(entries.cdPort, data.cdPort || "");
      } else if (data.primaryDept === "Stage Designer & Decor Lead") {
        formData.append(entries.sdBg, data.sdBg || "");
        formData.append(entries.sdRole, data.sdRole || "");
        formData.append(entries.sdExp, data.sdExp || "");
        formData.append(entries.sdAccess, data.sdAccess || "");
        formData.append(entries.sdVision, data.sdVision || "");
        formData.append(entries.sdPort, data.sdPort || "");
      } else if (data.primaryDept === "Costume Design") {
        formData.append(entries.csBg, data.csBg || "");
        formData.append(entries.csRole, data.csRole || "");
        formData.append(entries.csExp, data.csExp || "");
        formData.append(entries.csPort, data.csPort || "");
        formData.append(entries.csInsta, data.csInsta || "");
      } else if (data.primaryDept === "Visual & Content") {
        formData.append(entries.vcSkills, data.vcSkills || "");
        formData.append(entries.vcExp, data.vcExp || "");
        formData.append(entries.vcEquip, data.vcEquip || "");
        formData.append(entries.vcPort, data.vcPort || "");
        formData.append(entries.vcInsta, data.vcInsta || "");
      } else if (data.primaryDept === "Audio Engineering & Sound") {
        formData.append(entries.aeRole, data.aeRole || "");
        formData.append(entries.aeExp, data.aeExp || "");
        formData.append(entries.aeOutdoor, data.aeOutdoor || "");
        formData.append(entries.aeEquip, data.aeEquip || "");
      } else if (data.primaryDept === "Production, Coordination, Ticketing & Artist Management" || data.primaryDept === "Artist Liaison & Management" || data.primaryDept === "Setup, Breakdown, Security & General Crew" || data.primaryDept === "Flexible Volunteer") {
        // Shared production fields (assuming PR fields handle these)
        formData.append(entries.prRole, data.prRole || "");
        formData.append(entries.prPeople, data.prPeople || "");
        formData.append(entries.prComfort, data.prComfort || "");
      } else if (data.primaryDept === "MC / Hosting") {
        formData.append(entries.mcHosted, data.mcHosted || "");
        // Handle array for Languages
        if (data.mcLang && Array.isArray(data.mcLang)) {
          data.mcLang.forEach(lang => formData.append(entries.mcLang, lang));
        }
        formData.append(entries.mcComfort, data.mcComfort || "");
        formData.append(entries.mcVideo, data.mcVideo || "");
      }

      // Step 3: Commitment
      formData.append(entries.involvement, data.involvement || "");
      if (data.dates && Array.isArray(data.dates)) {
        data.dates.forEach(d => formData.append(entries.dates, d));
      }

      // Step 4: About You
      formData.append(entries.emergName, data.emergName || "");
      formData.append(entries.emergNum, data.emergNum || "");
      formData.append(entries.attendedBefore, data.attendedBefore || "");
      formData.append(entries.whyJoin, data.whyJoin || "");
      if (data.hopeGain && Array.isArray(data.hopeGain)) {
        data.hopeGain.forEach(g => formData.append(entries.hopeGain, g));
      }

      // Step 5: Declaration
      formData.append(entries.dec1, data.dec1 ? "Yes" : "");
      formData.append(entries.dec2, data.dec2 ? "Yes" : "");

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
