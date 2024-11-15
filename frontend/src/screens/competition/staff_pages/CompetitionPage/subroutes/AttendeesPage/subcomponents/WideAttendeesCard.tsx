export const WideAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  attendeesListState: [attendeesList, setAttendeesList],
  ...props
}) => {

  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return (<>
    <AttendeesInfoBar
      attendeesState={[attendeesList, setAttendeesList]}
      attendeesDetails={attendeesDetails}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />
    <WideInfoContainerDiv onDoubleClick={() => setIsInfoBarOpen((p) => !p)} {...props}>

      <UserNameContainerDiv>
        <UserNameGrid>
          <UserIcon />
          <UsernameTextSpan>
            {attendeesDetails.name}
          </UsernameTextSpan>
        </UserNameGrid>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>{attendeesDetails.sex}</StandardSpan>
      </StandardContainerDiv>

      <StaffRoles roles={attendeesDetails.roles} />

      <StandardContainerDiv>
        <StandardSpan>{attendeesDetails.universityName}</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>{attendeesDetails.tshirtSize}</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <BooleanStatus $toggled={!!attendeesDetails.dietaryNeeds}>
          {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
        </BooleanStatus>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <BooleanStatus $toggled={!!attendeesDetails.allergies}>
          {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
        </BooleanStatus>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <BooleanStatus $toggled={!!attendeesDetails.accessibilityNeeds}>
            {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
        </BooleanStatus>
      </StandardContainerDiv>

    </WideInfoContainerDiv>
  </>)
}