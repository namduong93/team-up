
interface DownloadButtonProps {
  isEditingStatus?: boolean;
  isEditingNameStatus?: boolean;
  isDownloadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  handleEnable?: VoidFunction;
  handleDisable?: VoidFunction;
  downloadCSV: () => Promise<boolean>;
  downloadPDF: () => Promise<boolean>;
  updateTeamStatus?: () => Promise<boolean>;
  downloadQuestion: string;
  isSiteDownload: boolean;
  hasTeamsToDownload?: boolean;
  hasAttendeesToDownload?: boolean;
}

export const DownloadButtons: FC<DownloadButtonProps> = ({ isEditingStatus = false, isEditingNameStatus = false,
  isDownloadingState: [isDownloading, setIsDownloading],
  handleEnable = () => {},
  handleDisable = () => {},
  downloadCSV = async () => true,
  downloadPDF = async () => true,
  updateTeamStatus = async () => true,
  downloadQuestion,
  isSiteDownload,
  hasTeamsToDownload,
  hasAttendeesToDownload,
}) => {
  const theme = useTheme();

  const enableDownloading = () => {
    setIsDownloading(true);
    handleEnable();
  }

  const disableDownloading = () => {
    setIsDownloading(false);
    handleDisable();
  }

  return (
    <>
      {!isEditingStatus && !isEditingNameStatus && !isDownloading &&
        <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
          <TransparentResponsiveButton actionType="primary"
            label="Download"
            icon={<FaDownload />}
            style={{ backgroundColor: theme.colours.primaryLight }}
            onClick={enableDownloading} isOpen={false}
          />

        </div>
      }
      {isDownloading && (hasTeamsToDownload || hasAttendeesToDownload) &&
      <>
        <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
          <TransparentResponsiveButton actionType="error"
            onClick={disableDownloading} label="Cancel" isOpen={false}
            icon={<GiCancel />}
            style={{
              backgroundColor: theme.colours.cancel,
          }} />
        </div>
        
        <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
          <ResponsiveActionButton actionType="secondary"
            label="Download CSV"
            question={downloadQuestion}
            icon={<GrDocumentCsv />}
            handleSubmit={downloadCSV}
          />
        </div>

        <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
          <ResponsiveActionButton actionType="primary"
            label="Download PDF"
            question={downloadQuestion}
            icon={<GrDocumentPdf />}
            handleSubmit={downloadPDF}
          />
        </div>

        {!isSiteDownload && hasTeamsToDownload &&
          <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
            <ResponsiveActionButton actionType="confirm"
              label="Update Status"
              question="Are you sure you have registered these teams on ICPC and would like to update their status to 'Registered'?"
              icon={<FaStamp />}
              handleSubmit={updateTeamStatus}
            />
          </div>
        }
      </>
      }
    </>
    
  )
}