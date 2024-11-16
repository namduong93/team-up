import { FaTimes } from "react-icons/fa";
import { StyledButton, StyledCloseButton, StyledModal } from "./SitePopup1.styles";
import { AdvancedDropdown } from "../../../../../../../components/AdvancedDropdown/AdvancedDropdown";

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

  return <>
    <StyledModal data-test-id="--StyledModal-0">
      <StyledCloseButton onClick={onClose} data-test-id="--StyledCloseButton-0">
        <FaTimes />
      </StyledCloseButton>
      <div>{heading}</div>
      <span style={{ marginBottom: "20px" }}>
        Your Coach will review <br /> your change, where you will
        <br />
        receive a notification <br /> with the results of the review
      </span>
      <AdvancedDropdown
        setCurrentSelected={setInputOption}
        optionsState={[siteOptions, setSiteOptions]}
        style={{ width: "100%" }}
        isExtendable={false}
      />
      <StyledButton
        disabled={isButtonDisabled()}
        onClick={onNext}
        data-test-id="--StyledButton-0">Request</StyledButton>
    </StyledModal>
  </>;
};
