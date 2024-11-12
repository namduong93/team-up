import React from "react";
import { StaffInfo } from "../../../../shared_types/Competition/staff/StaffInfo";
import { sendRequest } from "../../../utility/request";

export const fetchStaffRequests = async (setStaffList: React.Dispatch<React.SetStateAction<StaffInfo[]>>) => {
  try {
    const response = await sendRequest.get<{staffRequests: Array<StaffInfo>}>("/user/staff_requests");
    const staffList = response.data.staffRequests;
    setStaffList(staffList);
  }
  catch (error) {
    console.error("Error fetching staff requests list: ", error);
  }

}