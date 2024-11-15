export const WideStaffAccessHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv $isHeader={true} style={{
      backgroundColor: theme.colours.userInfoCardHeader,
      fontWeight: 'bold'
    }}>
      <UserNameContainerDiv>
        <UsernameTextSpan>
          Full Name
        </UsernameTextSpan>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Affiliation</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Access</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Email</StandardSpan>
      </StandardContainerDiv>


    </WideInfoContainerDiv>
  )
}
