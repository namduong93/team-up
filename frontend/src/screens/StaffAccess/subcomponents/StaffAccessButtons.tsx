import { useTheme } from "styled-components";
import { ResponsiveActionButton } from "../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { FaBan, FaCheckCircle } from "react-icons/fa";

interface StaffAccessButtonsProps {
  onApproveAll: () => Promise<boolean>;
  onRejectAll: () => Promise<boolean>;
  editingForAll: boolean;
}

export const StaffAccessButtons: React.FC<StaffAccessButtonsProps> = ({ onApproveAll, onRejectAll, editingForAll }) => {
  const theme = useTheme();

  return (
    <>
      {editingForAll && 
        <>
          <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
            <ResponsiveActionButton 
              actionType="error" 
              handleSubmit={onRejectAll}
              label="Reject All"
              question="Are you sure you want to reject all pending staff account requests?"
              icon={<FaBan />}
              style={{
                backgroundColor: theme.colours.error,
              }}
            />
          </div>
          <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
            <ResponsiveActionButton 
              actionType="confirm" 
              handleSubmit={onApproveAll}
              label="Approve All"
              question="Are you sure you want to approve all pending staff account requests?"
              icon={<FaCheckCircle />}
              style={{
                backgroundColor: theme.colours.confirm,
              }}
            />
          </div>
        </>
      }
    </>
  );
};
