import { useState } from "react";
import { validateRationale } from "../utils/validationRules";

export default function ApplicationForm({
  institution,
  cohort,
  config,
  onSave,
}) {
  const programStartDate = "2026-06-01";

  const initialForm = {
    institution,
    cohort,
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    qualification: "",
    graduationYear: "",
    percentage: "",
    cgpa: "",
    screeningScore: "",
    interviewStatus: "",
    aadhaar: "",
    offerLetterSent: false,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [exceptions, setExceptions] = useState({});
  const [rationales, setRationales] = useState({});

  // -----------------------
  // STRICT RULE VALIDATION
  // -----------------------
  const validateStrict = () => {
    let e = {};

    if (!form.fullName || form.fullName.length < 2 || /\d/.test(form.fullName))
      e.fullName = "Enter valid full name (min 2 chars, no numbers).";

    if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Invalid email format.";

    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Invalid Indian mobile number.";

    if (!/^\d{12}$/.test(form.aadhaar))
      e.aadhaar = "Aadhaar must be 12 digits.";

    if (!["Cleared", "Waitlisted", "Rejected"].includes(form.interviewStatus))
      e.interviewStatus = "Select valid interview status.";

    if (
      form.offerLetterSent &&
      !["Cleared", "Waitlisted"].includes(form.interviewStatus)
    )
      e.offerLetterSent =
        "Offer letter allowed only for Cleared or Waitlisted.";

    return e;
  };

  // -----------------------
  // DYNAMIC SOFT VALIDATION
  // -----------------------
  const validateSoft = () => {
    let e = {};
    let exceptionCount = 0;

    const checkSoft = (field, condition, message) => {
      if (condition) {
        if (exceptions[field]) {
          const rationaleError = validateRationale(
            rationales[field]
          );
          if (rationaleError) e[field] = rationaleError;
          else exceptionCount++;
        } else {
          e[field] = message;
        }
      }
    };

    // Age
    if (form.dob) {
      const age =
        new Date(programStartDate).getFullYear() -
        new Date(form.dob).getFullYear();

      checkSoft(
        "dob",
        age < config.minAge || age > config.maxAge,
        `Age must be between ${config.minAge} and ${config.maxAge}`
      );
    }

    // Graduation Year
    checkSoft(
      "graduationYear",
      form.graduationYear < config.graduationYearMin ||
        form.graduationYear > config.graduationYearMax,
      `Graduation year must be between ${config.graduationYearMin} and ${config.graduationYearMax}`
    );

    // Percentage
    if (form.percentage)
      checkSoft(
        "percentage",
        form.percentage < config.minPercentage,
        `Minimum percentage required: ${config.minPercentage}%`
      );

    // CGPA
    if (form.cgpa)
      checkSoft(
        "cgpa",
        form.cgpa < config.minCgpa,
        `Minimum CGPA required: ${config.minCgpa}`
      );

    // Screening Score
    checkSoft(
      "screeningScore",
      form.screeningScore < config.minScreeningScore,
      `Minimum screening score: ${config.minScreeningScore}`
    );

    return { errors: e, exceptionCount };
  };

  const handleSubmit = () => {
    const strictErrors = validateStrict();
    const { errors: softErrors, exceptionCount } = validateSoft();

    const combinedErrors = {
      ...strictErrors,
      ...softErrors,
    };

    if (Object.keys(combinedErrors).length > 0) {
      setErrors(combinedErrors);
      return;
    }

    onSave({
      ...form,
      exceptions: Object.keys(exceptions)
        .filter((f) => exceptions[f])
        .map((f) => ({
          field: f,
          rationale: rationales[f],
        })),
    });

    if (exceptionCount > 2) {
      alert("⚠ This application will be flagged for manager review.");
    }

    setForm(initialForm);
    setErrors({});
    setExceptions({});
    setRationales({});
  };

  const renderField = (
    label,
    name,
    type = "text",
    options = null,
    isSoft = false
  ) => {
    return (
      <div>
        <label className="block font-medium mb-1">
          {label}
        </label>

        {options ? (
          <select
            name={name}
            value={form[name]}
            onChange={(e) =>
              setForm({ ...form, [name]: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select</option>
            {options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={(e) =>
              setForm({ ...form, [name]: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
          />
        )}

        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[name]}
          </p>
        )}

        {isSoft && errors[name] && (
          <div className="mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={exceptions[name] || false}
                onChange={() =>
                  setExceptions({
                    ...exceptions,
                    [name]: !exceptions[name],
                  })
                }
              />
              Override with Exception
            </label>

            {exceptions[name] && (
              <textarea
                placeholder="Enter detailed rationale (min 30 chars with required keywords)..."
                value={rationales[name] || ""}
                onChange={(e) =>
                  setRationales({
                    ...rationales,
                    [name]: e.target.value,
                  })
                }
                className="w-full mt-2 p-3 border rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-8">
        New Application
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {renderField("Full Name", "fullName")}
        {renderField("Email", "email")}
        {renderField("Phone", "phone")}
        {renderField("Date of Birth", "dob", "date", null, true)}

        {renderField(
          "Highest Qualification",
          "qualification",
          "text",
          ["B.Tech", "B.E.", "B.Sc", "BCA", "M.Tech", "M.Sc", "MCA", "MBA"]
        )}

        {renderField("Graduation Year", "graduationYear", "number", null, true)}
        {renderField("Percentage", "percentage", "number", null, true)}
        {renderField("CGPA (10 scale)", "cgpa", "number", null, true)}
        {renderField("Screening Score", "screeningScore", "number", null, true)}

        {renderField(
          "Interview Status",
          "interviewStatus",
          "text",
          ["Cleared", "Waitlisted", "Rejected"]
        )}

        {renderField("Aadhaar Number", "aadhaar")}

        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="offerLetterSent"
              checked={form.offerLetterSent}
              onChange={(e) =>
                setForm({
                  ...form,
                  offerLetterSent: e.target.checked,
                })
              }
            />
            Offer Letter Sent
          </label>
          {errors.offerLetterSent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.offerLetterSent}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 bg-primary text-white px-8 py-3 rounded-xl hover:opacity-90"
      >
        Save Application
      </button>
    </div>
  );
}