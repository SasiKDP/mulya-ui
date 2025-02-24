import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Field } from "formik";

const qualifications = [
    "High School",
    "Dicloma",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate (PhD)",
    "Associate Degree",
    "Certification",
    "Postgraduate Diploma",
    "MBA",
    "B.Sc",
    "M.Sc",
    "PhD in Computer Science",
    "PhD in Engineering",
    "LLB (Bachelor of Laws)",
    "LLM (Master of Laws)",
    "MD (Doctor of Medicine)",
    "DDS (Doctor of Dental Surgery)",
    "DVM (Doctor of Veterinary Medicine)",
    "Pharm.D (Doctor of Pharmacy)",
    "BBA (Bachelor of Business Administration)",
    "BFA (Bachelor of Fine Arts)",
    "MFA (Master of Fine Arts)",
    "B.Ed (Bachelor of Education)",
    "M.Ed (Master of Education)",
    "B.Tech (Bachelor of Technology)",
    "M.Tech (Master of Technology)",
    "B.Arch (Bachelor of Architecture)",
    "M.Arch (Master of Architecture)",
    "B.Com (Bachelor of Commerce)",
    "M.Com (Master of Commerce)",
    "B.A (Bachelor of Arts)",
    "M.A (Master of Arts)",
    "B.S (Bachelor of Science)",
    "M.S (Master of Science)",
    "B.N (Bachelor of Nursing)",
    "M.N (Master of Nursing)",
    "B.Pharm (Bachelor of Pharmacy)",
    "M.Pharm (Master of Pharmacy)",
    "BDS (Bachelor of Dental Surgery)",
    "BVSc (Bachelor of Veterinary Science)",
    "PGDM (Post Graduate Diploma in Management)",
    "PGDBA (Post Graduate Diploma in Business Administration)",
    "CFA (Chartered Financial Analyst)",
    "CPA (Certified Public Accountant)",
    "ACCA (Association of Chartered Certified Accountants)",
    "PMP (Project Management Professional)",
    "CISSP (Certified Information Systems Security Professional)",
    "CEH (Certified Ethical Hacker)",
    "CCNA (Cisco Certified Network Associate)",
    "AWS Certified Solutions Architect",
    "Microsoft Certified: Azure Administrator",
    "Google Certified Professional Cloud Architect",
    "other",
  ];
  
const QualificationDropdown = ({ field, form }) => {
  return (
    <Autocomplete
      options={qualifications}
      value={field.value || ""}
      onChange={(event, newValue) => form.setFieldValue(field.name, newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Qualification"
          variant="outlined"
          fullWidth
          error={form.touched[field.name] && Boolean(form.errors[field.name])}
          helperText={form.touched[field.name] && form.errors[field.name]}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
           
          }}
        />
      )}
      fullWidth
      clearOnEscape
    />
  );
};

export default function QualificationField() {
  return (
    <Field name="qualification" component={QualificationDropdown} />
  );
}
