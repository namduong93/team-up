
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
