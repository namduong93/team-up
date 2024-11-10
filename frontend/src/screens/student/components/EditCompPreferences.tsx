import { FC, useState } from "react";
import { StudentInfo } from "../../../../shared_types/Competition/student/StudentInfo";
import styled from "styled-components";
import { FormLabel, Descriptor, yearOptions, Text, DoubleInputContainer, Colon } from "../../competition/register/CompIndividual";
import TextInputLight from "../../../components/general_utility/TextInputLight";
import RadioButton from "../../../components/general_utility/RadioButton";
import { CompetitionLevel } from "../../../../shared_types/Competition/CompetitionLevel";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";
import { FaTimes } from "react-icons/fa";
import DropdownInputLight from "../../../components/general_utility/DropDownLight";
import { ResponsiveActionButton } from "../../../components/responsive_fields/action_buttons/ResponsiveActionButton";

interface EditCompPreferencesProps {
  student: StudentInfo;
  onSave: (updatedStudent: StudentInfo) => void;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 12px;
  width: 90%;
  min-width: 290px;
  max-width: 800px;
  height: 90%;
  max-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const CloseContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  z-index: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #d9534f;
  transition: color 0.2s;

  &:hover {
    color: #c9302c;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin: 10px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  min-width: 290px;
  gap: 5px;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
`;

const Field = styled.div`
  max-width: 350px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  resize: none;
`;

const ContentContainer = styled.div`
  max-width: 760px;
  max-height: 780px;
  width: 95%;
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const TitleContainer = styled.div`
  flex: 20;

  display: flex;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  width: 100%;
`;

export const EditCompPreferences: FC<EditCompPreferencesProps> = ({
  student,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<StudentInfo>(student);

  const handleSubmit = async () => {
    onSave(formData);
    onClose();
    return true;
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ContentContainer>
          <HeaderContainer>
            <TitleContainer>
              <Title>Edit Competition Details</Title>
            </TitleContainer>
            <CloseContainer>
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            </CloseContainer>
          </HeaderContainer>
          <Form onSubmit={handleSubmit}>
            <Field>
              <FormLabel>Degree</FormLabel>
              <DropdownInputLight
                label="Current Year of Study"
                options={yearOptions}
                value={formData.degreeYear?.toString()}
                required={true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    degreeYear: parseInt(e.target.value),
                  })
                }
                width="45%"
              />
              <TextInputLight
                label="Degree"
                placeholder="Please enter"
                type="text"
                required={true}
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                width="100%"
              />
              <RadioButton
                label="ICPC Eligibility"
                options={["Yes", "No"]}
                selectedOption={
                  formData.ICPCEligible === undefined
                    ? ""
                    : formData.ICPCEligible
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const isICPCEligible = e.target.value === "Yes";
                  setFormData({ ...formData, ICPCEligible: isICPCEligible });
                }}
                required={true}
                descriptor="Are you ICPC eligible?"
                width="100%"
              />
            </Field>
            <Field>
              <RadioButton
                label="Competition Level"
                options={["Level A", "Level B", "No Preference"]}
                selectedOption={formData.level}
                onOptionChange={(e) => {
                  setFormData({ ...formData, level: e.target.value as CompetitionLevel });
                }}
                required={true}
                width="100%"
              />
              <FormLabel>Site Attendance</FormLabel>
              <div style={{ display: "flex", alignContent: "center" }}>
                <Text>
                  <em>{formData.siteName}</em>
                </Text>
              </div>
              <RadioButton
                options={["Attending On Site", "Attending Remotely"]}
                selectedOption={
                  formData.isRemote === undefined
                    ? ""
                    : formData.isRemote
                    ? "Attending Remotely"
                    : "Attending On Site"
                }
                onOptionChange={(e) => {
                  const isRemote = e.target.value === "Attending Remotely";
                  setFormData({ ...formData, isRemote });
                }}
                required={true}
                descriptor={["Will you be attending on site or remotely?"]}
                width="100%"
              />
            </Field>
            <Field>
              <DescriptiveTextInput
                label="Competition Biography"
                descriptor="Please write a short description about yourself that would help others get to know you"
                placeholder="Enter a description"
                required={true}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                width="100%"
              />
            </Field>
            <Field>
              <FormLabel>Preferred Contact Method</FormLabel>
              <Descriptor>
                Please specify your preferred contact method if you have another preference
              </Descriptor>
              <DoubleInputContainer>
              <TextInputLight
                label="Platform"
                placeholder="Please enter"
                type="text"
                required={false}
                value={formData.preferredContact.split(":")[0] || ""}
                onChange={(e) => {
                  const newPlatform = e.target.value;
                  const currentHandle = formData.preferredContact.split(":")[1] || "";
                  setFormData({ ...formData, preferredContact: `${newPlatform}:${currentHandle}` });
                }}
                width="45%"
              />

              <Colon>:</Colon>

              <TextInputLight
                label="Handle"
                placeholder="Please enter"
                type="text"
                required={false}
                value={formData.preferredContact.split(":")[1] || ""}
                onChange={(e) => {
                  const newHandle = e.target.value;
                  const currentPlatform = formData.preferredContact.split(":")[0] || "";
                  setFormData({ ...formData, preferredContact: `${currentPlatform}:${newHandle}` });
                }}
                width="45%"
              />
              </DoubleInputContainer>
            </Field>
          </Form>
          <ButtonContainer>
            <ResponsiveActionButton 
              actionType="primary" 
              label="Save Changes" 
              question="Are you sure you want to change your competition preferences?" 
              handleSubmit={handleSubmit} 
            />
          </ButtonContainer>
        </ContentContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
