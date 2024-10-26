import React, { useEffect, useState } from "react";
import { sendRequest } from "../../../utility/request";
// import { DashboardSidebar } from "../../components/general_utility/DashboardSidebar";

// interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
//   cropState: boolean;
// }

export interface DashInfo {
  preferredName: string;
  affiliation: string;
  profilePic: string;
}

export const useDashInfo = (): [{ preferredName: string, affiliation: string, profilePic: string, }, React.Dispatch<React.SetStateAction<{ preferredName: string, affiliation: string, profilePic: string, }>>] => {

  const [dashInfo, setDashInfo] = useState({ preferredName: '', affiliation: '', profilePic: '', });

  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await sendRequest.get<{ preferredName: string, affiliation: string, profilePic: string }>(`/user/dash_info`);
        // Can also store the preferredName from the response and use it in the sidebar.
        // Request any personal info needed here and then if there's an auth error in any of them
        // the page will redirect.
        setDashInfo(infoResponse.data);
      } catch (error: unknown) {
        console.log('Error fetching dashboard info:', error);
        // can handle other codes or types of errors here if needed.
      }
    })();
  }, []);

  return [dashInfo, setDashInfo];

}