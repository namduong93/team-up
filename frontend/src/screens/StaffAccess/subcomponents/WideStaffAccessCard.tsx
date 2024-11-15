
export const WideStaffAccessCard: FC<StaffAccessCardProps> = ({
  staffDetails,
  staffListState: [staffList, setStaffList],
  ...props  }) => {

  const handleAccessChange = async (userId: number | undefined, newAccess: UserAccess) => {
    const staffRequests : Array<StaffRequests> = [];
    if(userId) {
      staffRequests.push({ userId: userId, access: newAccess });
      try {
        await sendRequest.post("/user/staff_requests", { staffRequests });
        const userIndex = staffList.findIndex((staff) => staff.userId === userId);
        setStaffList([
          ...staffList.slice(0, userIndex),
          { ...staffList[userIndex], userAccess: newAccess },
          ...staffList.slice(userIndex + 1)
        ]);
      }
      catch (error) {
        console.error(error);
      }
    }
  };

  return (
  <>
    <WideInfoContainerDiv {...props}>
      <UserNameContainerDiv>
        <UserNameGrid>
          <UserIcon />
          <UsernameTextSpan>
            {staffDetails.name}
          </UsernameTextSpan>
        </UserNameGrid>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>
          {staffDetails.universityName}
        </StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <AccessDropdown
          staffId={staffDetails.userId}
          currentAccess={staffDetails.userAccess}
          onChange={(newAccess) => handleAccessChange(staffDetails.userId, newAccess)}
        />
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>
          {staffDetails.email}
        </StandardSpan>
      </StandardContainerDiv>


    </WideInfoContainerDiv>
  </>
  );
}