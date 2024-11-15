
// interface User {
//   role: "student" | "staff";
//   profilePic: string;
//   name: string;
//   preferredName: string;
//   email: string;
//   affiliation: string;
//   gender: "Male" | "Female" | "Other";
//   pronouns: "She/Her" | "He/Him" | "They/Them" | "Other";
//   tshirtSize: string;
//   allergies: string;
//   dietaryReqs: string;
//   accessibilityReqs: string;
// };

interface AccountProps {
  setDashInfo: React.Dispatch<React.SetStateAction<DashInfo>>;
};

export const Account: FC<AccountProps> = ({ setDashInfo }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    role: "student",
    name: "",
    preferredName: "",
    email: "",
    affiliation: "",
    gender: "Other",
    pronouns: "They/Them",
    profilePic: `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`,
    tshirtSize: "",
    allergies: "",
    dietaryReqs: "",
    accessibilityReqs: "",
  });

  const [isEditingUser, setIsEditingUser] = useState(false);
  
  const [newDetails, setNewDetails] = useState<User>({
    ...user,
    profilePic: `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`,
  });

  const handleEditUser = () => {
    setNewDetails(user);
    setIsEditingUser(true);
  };

  const handleSaveUser = async () => {
    setUser(newDetails);
    setIsEditingUser(false);
    await sendRequest.put('/user/profile_info', newDetails);
    setDashInfo({ preferredName: newDetails.preferredName, affiliation: newDetails.affiliation, profilePic: newDetails.profilePic });
  };

  const handleCancelUser = () => {
    setNewDetails(user);
    setIsEditingUser(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];

    if (photoFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(photoFile.type)) {
        alert("Unsupported file format. Please upload a JPEG, PNG, or GIF.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDetails({ ...newDetails, profilePic: reader.result as string });
      };
      reader.readAsDataURL(photoFile);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await sendRequest.get<User>('/user/profile_info');
        setUser(infoResponse.data);
        setIsLoaded(true);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate('/');
          console.log('Error fetching account details: ', error);
        });
      }
    })();
  }, []);

  return ( isLoaded &&
    <Background>
      <AccountContainer>
        <CardContainer>
          <AccountCard $isEditing={isEditingUser}>
            <ProfileEditContainer>
              <ProfileContainer>
                <ProfilePic $imageUrl={newDetails.profilePic || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg` } />
              </ProfileContainer>
              {!isEditingUser && (
                <EditIconButton onClick={handleEditUser}>
                  <EditIcon />
                </EditIconButton>
              )}
            </ProfileEditContainer>
            <DetailsCard>
              <AccountItem>
                {isEditingUser && <Label $isEditing={isEditingUser}>Profile Picture:</Label>}
                {isEditingUser && (
                  <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Name:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.name}
                    onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.name}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Preferred Name:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.preferredName}
                    onChange={(e) => setNewDetails({ ...newDetails, preferredName: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.preferredName}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Email:</Label>
                {isEditingUser ? (
                  <Input
                    type="email"
                    value={newDetails.email}
                    onChange={(e) => setNewDetails({ ...newDetails, email: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.email}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Affiliation:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.affiliation}
                    onChange={(e) => setNewDetails({ ...newDetails, affiliation: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.affiliation}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Gender:</Label>
                {isEditingUser ? (
                  <Select
                    value={newDetails.gender}
                    onChange={(e) => setNewDetails({ ...newDetails, gender: e.target.value as User["gender"] })}
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                ) : (
                  <DetailsText>{user.gender}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Preferred Pronouns:</Label>
                {isEditingUser ? (
                  <Select
                    value={newDetails.pronouns}
                    onChange={(e) => setNewDetails({ ...newDetails, pronouns: e.target.value as User["pronouns"] })}
                  >
                    <Option value="She/Her">She/Her</Option>
                    <Option value="He/Him">He/Him</Option>
                    <Option value="They/Them">They/Them</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                ) : (
                  <DetailsText>{user.pronouns}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>T-Shirt Size:</Label>
                {isEditingUser ? (
                  <Select
                    value={newDetails.tshirtSize}
                    onChange={(e) => setNewDetails({ ...newDetails, tshirtSize: e.target.value })}
                  >
                    <Option value="Male L">Male L</Option>
                    <Option value="Male M">Male M</Option>
                    <Option value="Male S">Male S</Option>
                    <Option value="Female L">Female L</Option>
                    <Option value="Female M">Female M</Option>
                    <Option value="Female S">Female S</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                ) : (
                  <DetailsText>{user.tshirtSize}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Dietary Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.dietaryReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, dietaryReqs: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.dietaryReqs}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Allergy Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.allergies}
                    onChange={(e) => setNewDetails({ ...newDetails, allergies: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.allergies}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Accessibility Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.accessibilityReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, accessibilityReqs: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.accessibilityReqs}</DetailsText>
                )}
                            </AccountItem>
            </DetailsCard>
            <ActionButtons>
              {isEditingUser && (
                <ButtonGroup>
                  <Button type="confirm" onClick={handleSaveUser}>
                    Save
                  </Button>
                  <Button type="cancel" onClick={handleCancelUser}>
                    Cancel
                  </Button>
                </ButtonGroup>
              )}
            </ActionButtons>
          </AccountCard>
        </CardContainer>
      </AccountContainer>
    </Background>
  );
};

