import { FC, useState, ChangeEvent, FormEvent } from "react";
import { StudentInfo } from "../../../../shared_types/Competition/student/StudentInfo";
import styled from "styled-components";

interface EditCompPreferencesProps {
  student: StudentInfo;
  onSave: (updatedStudent: StudentInfo) => void;
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
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  max-height: 800px;
`;

const Title = styled.h2`
  margin-bottom: 30px;
  text-align: center;
  font-size: 24px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px; // Adjusted spacing between fields
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  margin-bottom: 8px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  font-size: 14px;
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};

  &::placeholder {
    color: ${({ theme }) => theme.colours.sidebarLine};
  }

  &:focus {
    border-color: ${({ theme }) => theme.fonts.colour};
    outline: none;
  }
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

export const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  font-size: 14px;
  resize: none;
  min-height: 100px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};

  &::placeholder {
    color: ${({ theme }) => theme.colours.sidebarLine};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colours.sidebarBackground};
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.colours.primaryLight};
  color: ${({ theme }) => theme.fonts.colour};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colours.primaryDark};
    color: ${({ theme }) => theme.background};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    cursor: not-allowed;
  }
`;

export const EditCompPreferences: FC<EditCompPreferencesProps> = ({
  student,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<StudentInfo>(student);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    onCancel();
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
              checked={formData.ICPCEligible}
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
              value={formData.universityCourses.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  universityCourses: e.target.value
                    .split(",")
                    .map((course) => course.trim()),
                })
              }
              rows={3}
            />
          </Field>
          <Field>
            <Label>Codeforces Rating</Label>
            <Input
              type="number"
              name="codeforce"
              value={formData.codeforcesRating || ""}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label>Regional Participant</Label>
            <Checkbox
              type="checkbox"
              name="regional"
              checked={formData.isRemote}
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
              rows={3}
            />
          </Field>
          {/* Displaying but not editing competition level and boersen eligibility */}
          <Field>
            <Label>Competition Level</Label>
            <Input type="text" value={formData.competitionLevel} readOnly />
          </Field>
          <Field>
            <Label>Boersen Eligible</Label>
            <Input
              type="text"
              value={formData.boersenEligible ? "Yes" : "No"}
              readOnly
            />
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
