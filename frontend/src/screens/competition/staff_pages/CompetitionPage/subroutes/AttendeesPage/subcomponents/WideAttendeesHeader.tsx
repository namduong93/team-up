export const WideAttendeesHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv $isHeader style={{
      backgroundColor: theme.colours.userInfoCardHeader,
      fontWeight: 'bold'
    }}>
      <UserNameContainerDiv>
        <UsernameTextSpan>
          Full Name
        </UsernameTextSpan>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Gender</StandardSpan>
      </StandardContainerDiv>
      
      <StandardContainerDiv>
        <StandardSpan>Role</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>University</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Shirt Size</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Dietary Needs</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Allergies</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Accessibility</StandardSpan>
      </StandardContainerDiv>

    </WideInfoContainerDiv>
  )
}