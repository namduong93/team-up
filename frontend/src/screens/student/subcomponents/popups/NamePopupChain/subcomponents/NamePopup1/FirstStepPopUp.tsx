import { FaTimes } from "react-icons/fa";
import { StyledButton, StyledCloseButton, StyledModal } from "./NamePopup1.styles";
import TextInputLight from "../../../../../../../components/general_utility/TextInputLight";


interface FirstStepPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
  text: string;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export const FirstStepPopUp: React.FC<FirstStepPopUpProps> = ({
  heading,
  onClose,
  onNext,
  text,
  inputValue,
  setInputValue,
}) => {
  // const [inputValue, setInputValue] = useState("");

  const isButtonDisabled = () => {
    return inputValue === "";
  };

  return (
    <>
      <StyledModal>
        <StyledCloseButton onClick={onClose}>
          <FaTimes />
        </StyledCloseButton>
        <div>{heading}</div>
        <span style={{ marginBottom: "20px" }}>
          Your Coach will review <br /> your change, where you will
          <br />
          receive a notification <br /> with the results of the review
        </span>
        <TextInputLight
          label=""
          placeholder={text}
          required={false}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          width="80%"
        />

        <StyledButton disabled={isButtonDisabled()} onClick={onNext}>
          Request
        </StyledButton>
      </StyledModal>
    </>
  );
};
