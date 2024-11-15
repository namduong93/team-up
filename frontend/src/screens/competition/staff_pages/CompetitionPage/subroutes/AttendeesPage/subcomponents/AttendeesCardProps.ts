import { AttendeesDetails } from "../../../../../../../../shared_types/Competition/staff/AttendeesDetails";

export interface AttendeesCardProps extends React.HTMLAttributes<HTMLDivElement> {
  attendeesListState: [Array<AttendeesDetails>, React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>];
  attendeesDetails: AttendeesDetails;
}