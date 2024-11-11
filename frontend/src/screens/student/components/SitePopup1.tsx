import React from "react";
import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";
import { AdvancedDropdown } from "../../../components/AdvancedDropdown/AdvancedDropdown";

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 450px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #d9534f;
  transition: color 0.2s;
  font-size: 26px;

  &:hover {
    color: #c9302c;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  min-width: 100px;
  width: 50%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.fonts.colour : theme.background};
    font-weight: ${({ theme, disabled }) =>
      disabled
        ? theme.fonts.fontWeights.regular
        : theme.fonts.fontWeights.bold};
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colours.sidebarBackground : theme.colours.primaryDark};
  }
`;

interface FirstStepPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
  text: string;
  inputOption: { value: string; label: string };
  setInputOption: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }>
  >;
  siteOptionsState: [
    { value: string; label: string }[],
    React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>
  ];
}

export const SitePopup1: React.FC<FirstStepPopUpProps> = ({
  heading,
  onClose,
  onNext,
  text,
  inputOption: inputOption,
  setInputOption: setInputOption,
  siteOptionsState: [siteOptions, setSiteOptions],
}) => {
  // const [inputValue, setInputValue] = useState("");

  const isButtonDisabled = () => {
    return inputOption.value === "";
  };

  return (
    <>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>
        <span style={{ marginBottom: "20px" }}>
          Your Coach will review <br /> your change, and your team
          <br />
          will receive a notification <br /> of the results
        </span>
        <AdvancedDropdown
          setCurrentSelected={setInputOption}
          optionsState={[siteOptions, setSiteOptions]}
          style={{ width: "100%" }}
          isExtendable={false}
        />

        <Button disabled={isButtonDisabled()} onClick={onNext}>
          Request
        </Button>
      </Modal>
    </>
  );
};
