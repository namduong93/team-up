import { FC, useState, ChangeEvent, FormEvent } from "react";
import { Student } from "./TeamDetails";
import styled from "styled-components";

export interface StudentDetails extends Student {
  name: string;
  email: string;
  degreeYear: number;
  degree: string;
  ICPCEligibility?: boolean;
  isRemote?: boolean;
  competitionLevel: string;
  boersenEligible?: boolean;
  courses: string[];
  codeforce?: number;
  regional?: boolean;
  nationalPrizes?: string;
  internationalPrizes?: string;
  bio: string; // Ensure bio is included in the StudentDetails type
}

interface EditCompPreferencesProps {
  student: StudentDetails;
  onSave: (updatedStudent: StudentDetails) => void;
  onCancel: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.background};
  padding: 20px;
  border-radius: 12px; // Rounded edges
  width: 90%;
  max-width: 800px; // Wider for 2-column layout
`;

const Title = styled.h2`
  margin-bottom: 20px; // Space below the title
  text-align: center; // Center the title
`;

const Form = styled.form`
  display: grid; // Use grid layout for two columns
  grid-template-columns: 1fr 1fr; // Two equal columns
  gap: 20px; // Gap between fields
`;

const Field = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
`;

const Checkbox = styled.input`
  margin-right: 5px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  resize: none; // Prevent resizing
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colours.primaryDark};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

export const EditCompPreferences: FC<EditCompPreferencesProps> = ({
  student,
  onSave,
  onCancel,
}) => {
  // Initialize form data with default values
  const [formData, setFormData] = useState<StudentDetails>({
    ...student,
    ICPCEligibility: student.ICPCEligibility ?? false, // Default to false
    isRemote: student.isRemote ?? false, // Default to false
    codeforce: student.codeforce ?? undefined, // Ensure it's undefined if not provided
    regional: student.regional ?? false, // Default to false
    nationalPrizes: student.nationalPrizes ?? '', // Default to empty string
    internationalPrizes: student.internationalPrizes ?? '', // Default to empty string
    bio: student.bio ?? '', // Default to empty string
    courses: student.courses || [], // Default to an empty array
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onCancel(); // Call onCancel after saving
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Edit Competition Details</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Degree Year</Label>
            <Input
              type="number"
              name="degreeYear"
              value={formData.degreeYear}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>Degree</Label>
            <Input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>ICPC Eligibility</Label>
            <Checkbox
              type="checkbox"
              name="ICPCEligibility"
              checked={formData.ICPCEligibility}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>Is Remote</Label>
            <Checkbox
              type="checkbox"
              name="isRemote"
              checked={formData.isRemote}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>Courses</Label>
            <TextArea
              name="courses"
              value={formData.courses.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  courses: e.target.value.split(",").map((course) => course.trim()),
                })
              }
              rows={3} // Set rows for better height control
            />
          </Field>
          <Field>
            <Label>Codeforces Rating</Label>
            <Input
              type="number"
              name="codeforce"
              value={formData.codeforce || ""} // Handle undefined case
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>Regional Participant</Label>
            <Checkbox
              type="checkbox"
              name="regional"
              checked={formData.regional}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>National Prizes</Label>
            <Input
              type="text"
              name="nationalPrizes"
              value={formData.nationalPrizes}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>International Prizes</Label>
            <Input
              type="text"
              name="internationalPrizes"
              value={formData.internationalPrizes}
              onChange={handleChange}
            />
          </Field>
          {/* New Bio Field */}
          <Field>
            <Label>Bio</Label>
            <TextArea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3} // Adjust row count as needed
            />
          </Field>
          {/* Displaying but not editing competition level and boersen eligibility */}
          <Field>
            <Label>Competition Level</Label>
            <Input type="text" value={formData.competitionLevel} readOnly />
          </Field>
          <Field>
            <Label>Boersen Eligible</Label>
            <Input type="text" value={formData.boersenEligible ? "Yes" : "No"} readOnly />
          </Field>
          <Button type="submit">Save</Button>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};
