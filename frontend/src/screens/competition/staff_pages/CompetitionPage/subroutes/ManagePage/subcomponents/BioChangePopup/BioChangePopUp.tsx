import { FC } from "react";
import { StyledButton, StyledCloseButton, StyledContainer, StyledContentBio, StyledContentMarkdown, StyledEditorContainer, StyledModal, StyledModalOverlay, StyledTextarea, StyledView } from "./BioChangePopup.styles";
import { FaTimes } from "react-icons/fa";
import { StyledHeading } from "../../ManagePage.styles";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

interface BioChangePopUpProps {
  onClose: () => void;
  onNext: () => void;
  bioValue: string | undefined;
  announcementValue: string;
  onBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAnnouncementChange: (value: string) => void;
}

export const BioChangePopUp: FC<BioChangePopUpProps> = ({
  onClose,
  onNext,
  bioValue,
  onBioChange,
  announcementValue,
  onAnnouncementChange,
}) => {
  const isButtonDisabled = () => bioValue === "" && announcementValue === "";

  return (
    <StyledModalOverlay>
      <StyledModal>
        <StyledView>
          <StyledCloseButton onClick={onClose}>
            <FaTimes />
          </StyledCloseButton>

          <StyledContainer>
            <StyledContentBio>
              <StyledHeading>Update Your Contact Bio</StyledHeading>
              <StyledTextarea
                value={bioValue}
                onChange={onBioChange}
                $height="100px"
                required={false}
                placeholder={bioValue}
              />
            </StyledContentBio>
            
            <StyledContentMarkdown>
              <StyledHeading>Update Announcements to Your Teams</StyledHeading>
              <StyledEditorContainer>
                <ReactMarkdownEditorLite
                  value={announcementValue}
                  onChange={({ text }) => onAnnouncementChange(text)}
                  style={{ height: "100%" }}
                  renderHTML={(text: string) => MarkdownIt().render(text)}
                  config={{
                    placeholder: "Write announcement here...",
                    toolbar: [
                      "bold",
                      "italic",
                      "strikethrough",
                      "header",
                      "|",
                      "unordered-list",
                      "ordered-list",
                      "quote",
                      "|",
                      "link",
                      "image",
                      "|",
                      "preview",
                      "undo",
                      "redo",
                    ],
                  }}
                />
              </StyledEditorContainer>
            </StyledContentMarkdown>
          </StyledContainer>

          <StyledButton disabled={isButtonDisabled()} onClick={onNext}>
            Save Changes
          </StyledButton>
        </StyledView>
      </StyledModal>
    </StyledModalOverlay>
  );
};
