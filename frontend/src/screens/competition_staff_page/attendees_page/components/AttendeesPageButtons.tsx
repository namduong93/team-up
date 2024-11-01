import React, { FC, useState } from "react"
import { DownloadButtons } from "../../components/DownloadButtons"
import { AttendeesDetails } from "../AttendeesPage";

interface AttendeesButtonsProps {
  attendeesListState: [Array<AttendeesDetails>, React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>];
}

export const AttendeesPageButtons: FC<AttendeesButtonsProps> = (
  { attendeesListState: [attendeesList, setAttendeesList] }) => {

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const downloadCSV = async () => {
    
    return true;
  }

  const downloadPDF = async () => {

    return true;
  }
  
  return (
    <>
    <DownloadButtons
      isDownloadingState={[isDownloading, setIsDownloading]}
      downloadCSV={downloadCSV}
      downloadPDF={downloadPDF}
    />
    </>
  )
}