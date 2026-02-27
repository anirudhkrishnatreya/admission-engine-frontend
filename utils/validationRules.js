const keywords = [
  "approved by",
  "special case",
  "documentation pending",
  "waiver granted"
];

export const validateField = (field, value, form, programStartDate) => {
  switch (field) {
    case "fullName":
      if (!value || value.length < 2)
        return "Full name must be at least 2 characters.";
      if (/\d/.test(value))
        return "Full name cannot contain numbers.";
      return "";

    case "email":
      if (!/^\S+@\S+\.\S+$/.test(value))
        return "Invalid email format.";
      return "";

    case "phone":
      if (!/^[6-9]\d{9}$/.test(value))
        return "Invalid Indian mobile number.";
      return "";

    case "dob":
      const dob = new Date(value);
      const start = new Date(programStartDate);
      const age =
        start.getFullYear() - dob.getFullYear();
      if (age < 18 || age > 35)
        return "Age must be between 18 and 35.";
      return "";

    case "graduationYear":
      if (value < 2015 || value > 2025)
        return "Graduation year must be between 2015 and 2025.";
      return "";

    case "percentage":
      if (form.cgpa) return "";
      if (value < 60)
        return "Percentage must be at least 60%.";
      return "";

    case "cgpa":
      if (form.percentage) return "";
      if (value < 6)
        return "CGPA must be at least 6.0.";
      return "";

    case "screeningScore":
      if (value < 40)
        return "Minimum screening score is 40.";
      return "";

    case "interviewStatus":
      if (value === "Rejected")
        return "Rejected candidates cannot proceed.";
      return "";

    case "aadhaar":
      if (!/^\d{12}$/.test(value))
        return "Aadhaar must be exactly 12 digits.";
      return "";

    case "offerLetterSent":
      if (
        value === true &&
        !["Cleared", "Waitlisted"].includes(
          form.interviewStatus
        )
      )
        return "Offer letter allowed only if Cleared or Waitlisted.";
      return "";

    default:
      return "";
  }
};

export const validateRationale = (text) => {
  if (!text || text.length < 30)
    return "Rationale must be at least 30 characters.";

  const hasKeyword = keywords.some((k) =>
    text.toLowerCase().includes(k)
  );

  if (!hasKeyword)
    return "Rationale must include required approval keywords.";

  return "";
};