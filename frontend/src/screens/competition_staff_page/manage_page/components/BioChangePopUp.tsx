import { FC } from "react";
import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";
import { Heading } from "./StaffActionCard";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 800px;
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
  font-size: 26px;
  color: #d9534f;
  transition: color 0.2s;

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

const StyledTextarea = styled.textarea<{ $height: string }>`
  border-radius: 10px;
  box-sizing: border-box;
  resize: vertical;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  font-size: 16px;
  height: ${({ $height }) => $height};
  width: 100%;
  margin-top: 25px;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 5%;
  overflow: hidden;
  align-items: flex-start;
  box-sizing: border-box;
`;

const ContentField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
`;

const ContentMarkdown = styled(ContentField)`
  flex: 2;
`;

const ContentBio = styled(ContentField)`
  flex: 1;
`;

const View = styled.div`
  width: 100%;
  height: 625px;
  overflow: hidden;
`;

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
`;

interface BioChangePopUpProps {
  onClose: () => void;
  onNext: () => void;
  bioValue: string;
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
  const isButtonDisabled = () => bioValue === "" || announcementValue === "";

  return (
    <ModalOverlay>
      <Modal>
        <View>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>

          <Container>
            <ContentBio>
              <Heading>Update Your Contact Bio</Heading>
              <StyledTextarea
                value={bioValue}
                onChange={onBioChange}
                $height="100px"
                required={false}
                placeholder={bioValue}
              />
            </ContentBio>
            <ContentMarkdown>
              <Heading>Update Announcements to Your Teams</Heading>
              <EditorContainer>
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
              </EditorContainer>
            </ContentMarkdown>
          </Container>

          <Button disabled={isButtonDisabled()} onClick={onNext}>
            Save Changes
          </Button>
        </View>
      </Modal>
    </ModalOverlay>
  );
};
