import { FC, useEffect, useState } from "react";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";
import { ButtonContainer, CloseButton, CloseContainer, ContentContainer, Field, Form, HeaderContainer, ModalContent, ModalOverlay, Title, TitleContainer } from "./EditCompUserDetails.styles";
import { FaTimes } from "react-icons/fa";
import { Colon, Descriptor, DoubleInputContainer, FormLabel, Text } from "../../../competition/register/RegisterForm/subroutes/CompIndividualInput/CompIndividualInput.styles";
import DropdownInputLight from "../../../../components/general_utility/DropDownLight";
import { yearOptions } from "../../../competition/register/RegisterForm/subroutes/CompIndividualInput/CompIndividual";
import TextInputLight from "../../../../components/general_utility/TextInputLight";
import RadioButton from "../../../../components/general_utility/RadioButton";
import { CompetitionLevel } from "../../../../../shared_types/Competition/CompetitionLevel";
import DescriptiveTextInput from "../../../../components/general_utility/DescriptiveTextInput";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";

interface EditCompPreferencesProps {
  student: StudentInfo;
  onSubmit: (updatedStudent: StudentInfo) => Promise<boolean>;
  onClose: () => void;
};

export const EditCompPreferences: FC<EditCompPreferencesProps> = ({
  student,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<StudentInfo>(student);

  const handleSubmit = async () => {
    onSubmit(formData);
    onClose();
    return true;
  };

  useEffect(() => {
    console.log(student);
  },[])

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
