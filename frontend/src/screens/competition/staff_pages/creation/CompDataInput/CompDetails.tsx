

export interface SiteLocation {
  universityId: number;
  defaultSite: string;
}

export interface OtherSiteLocation {
  universityName: string;
  defaultSite: string;
}

const createTimezoneOptions = () => {
  const timezones = moment.tz.names().map((tz) => ({
    value: tz,
    label: tz.replace(/_/g, " ").replace(/\/(.+)/, " - $1"), // Format label for better readability
  }));

  return [{ value: "", label: "Please Select" }, ...timezones];
};

export const CompetitionDetails: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [locationError, setLocationError] = useState<ReactNode>("");

  const [optionDisplayList, setOptionDisplayList] = useState<
    Array<{ value: string; label: string; defaultSite: string }>
  >(location.state?.optionDisplayList || []);

  const [competitionInfo, setCompetitionInfo] =
    useState<CompetitionInformation>(
      location.state?.competitionInfo || {
        name: "",
        region: "",
        timeZone: "",
        startDate: undefined,
        start: "",
        earlyRegDeadline: undefined,
        generalRegDeadline: undefined,
        code: "",
        siteLocations: [],
        otherSiteLocations: [],
      }
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CompetitionInformation
  ) => {
    setCompetitionInfo({ ...competitionInfo, [field]: e.target.value });
  };

  const addSite = (
    option: { value: string; label: string },
    defaultSite: string
  ) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: [
        ...prev.siteLocations,
        { universityId: parseInt(option.value), defaultSite, universityName: option.label },
      ],
      // convert universityId to number before we send to backend;
    }));

    setOptionDisplayList((prev) => [
      ...prev,
      { value: option.value, label: option.label, defaultSite },
    ]);
  };

  const addOtherSite = (
    option: { value: string; label: string },
    defaultSite: string
  ) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      otherSiteLocations: [
        ...(prev.otherSiteLocations || []),
        { universityName: option.label, defaultSite },
      ],
    }));

    setOptionDisplayList((prev) => [
      ...prev,
      { value: option.value, label: option.label, defaultSite },
    ]);
  };

  const handleAddSiteLocation = (
    currentOption: { value: string; label: string },
    defaultSite: string
  ) => {
    if (!defaultSite) {
      setLocationError(<p>No site name provided</p>);
      return;
    }

    if (
      competitionInfo.siteLocations.some(
        (site) => String(site.universityId) === currentOption.value
      ) ||
      (competitionInfo.otherSiteLocations || []).some(
        (otherSite) => otherSite.universityName === currentOption.label
      )
    ) {
      setLocationError(
        <p>
          You have already entered a default site location for this institution
          <br />
          Please delete your previous entry or select a different institution
        </p>
      );
      return;
    }

    setLocationError("");

    // if currentOptions value is empty which will be the case when it's a custom option.
    if (!currentOption.value) {
      addOtherSite(currentOption, defaultSite);

      return;
    }

    addSite(currentOption, defaultSite);
  };

  const handleDeleteSiteLocation = (deleteObject: {
    value: string;
    label: string;
    defaultSite: string;
  }) => {
    setOptionDisplayList((prev) => [
      ...prev.filter(
        (elem) =>
          !(
            elem.value === deleteObject.value &&
            elem.label === deleteObject.label
          )
      ),
    ]);

    if (!deleteObject.value) {
      setCompetitionInfo((prev) => ({
        ...prev,
        otherSiteLocations: (prev.otherSiteLocations || []).filter(
          (elem) => elem.universityName !== deleteObject.label
        ),
      }));

      return;
    }

    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: prev.siteLocations.filter(
        (elem) => elem.universityId !== Number(deleteObject.value)
      ),
    }));
  };

  const isButtonDisabled = () => {
    const {
      name,
      earlyRegDeadline,
      code,
      siteLocations,
      otherSiteLocations,
      region,
      startDate,
      generalRegDeadline
    } = competitionInfo;
    return (
      name === "" ||
      region === "" ||
      !generalRegDeadline ||
      code === "" ||
      (siteLocations.length === 0 && (!otherSiteLocations || otherSiteLocations.length === 0))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate("/competition/confirmation", {
      state: { competitionInfo, optionDisplayList },
    });
  };

  const [startDateInput, setStartDateInput] = useState<Date | undefined>();
  const [earlyRegInput, setEarlyRegInput] = useState<Date | undefined>();
  const [generalRegInput, setGeneralRegInput] = useState<Date | undefined>();

  useEffect(() => {
    const { startDate, earlyRegDeadline, generalRegDeadline } = competitionInfo;
    setStartDateInput(startDate);
    setEarlyRegInput(earlyRegDeadline);
    setGeneralRegInput(generalRegDeadline);
  }, []);

  useEffect(() => {
    if (!startDateInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      startDate: dateToUTC(startDateInput)
    }));
  }, [startDateInput]);

  useEffect(() => {
    if (!earlyRegInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      earlyRegDeadline: dateToUTC(earlyRegInput)
    }));
  }, [earlyRegInput]);

  useEffect(() => {
    if (!generalRegInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      generalRegDeadline: dateToUTC(generalRegInput)
    }));
  }, [generalRegInput]);



  const [isEarlyReg, setIsEarlyReg] = useState(false);

  return (
    <FlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <CompCreationProgressBar progressNumber={0} />
      <Container>
        <FormContainer onSubmit={handleSubmit}>
          <Title>Competition Details</Title>

          <TextInput
            label="Competition Name"
            placeholder="Please type"
            type="text"
            required={true}
            value={competitionInfo.name}
            onChange={(e) => handleChange(e, "name")}
            width="100%"
          />

          <TextInput
            label="Competition Region"
            placeholder="Please type"
            type="text"
            required={true}
            value={competitionInfo.region}
            onChange={(e) => handleChange(e, "region")}
            width="100%"
            descriptor="Please specify the region your Competition will be held in"
          />

          <Label>
            Competition Start<Asterisk>*</Asterisk>
          </Label>

          <DoubleInputContainer>
              <TextInputLight
                label="Date and Time (UTC Timezone)"
                placeholder="dd/mm/yyyy"
                type="datetime-local"
                required={false}
                value={formatDate(startDateInput)}
                onChange={(e) => setStartDateInput(new Date(e.target.value))}
                width="45%"
              />

          </DoubleInputContainer>

          <Label>Early Bird Registration Deadline</Label>

          <RadioButton
            label=""
            options={["Yes", "No"]}
            selectedOption={
              isEarlyReg === null
                ? ""
                : isEarlyReg
                ? "Yes"
                : "No"
            }
            onOptionChange={(e) => {
              setIsEarlyReg(e.target.value === 'Yes');
            }}
            required={true}
            descriptor="Will your Competition have an Early Bird Registration Deadline?"
            width="100%"
          />

          {isEarlyReg && (
            <>
              <Descriptor>
                Please set the Date and Time of your Early Bird Registration
                Deadline
              </Descriptor>
              <DoubleInputContainer>
                  <TextInputLight
                    label="Date and Time (UTC Timezone)"
                    placeholder="dd/mm/yyyy"
                    type="datetime-local"
                    required={false}
                    value={formatDate(earlyRegInput)}
                    onChange={(e) => setEarlyRegInput(new Date(e.target.value))}
                    width="45%"
                  />

              </DoubleInputContainer>
            </>
          )}

          <Label>
            General Registration Deadline<Asterisk>*</Asterisk>
          </Label>
          <Descriptor>
            Please set the Date and Time of your General Registration Deadline
          </Descriptor>

          <DoubleInputContainer>
            <TextInputLight
              label="Date and Time (UTC Timezone)"
              placeholder="dd/mm/yyyy"
              type="datetime-local"
              required={false}
              value={formatDate(generalRegInput)}
              onChange={(e) => setGeneralRegInput(new Date(e.target.value))}
              width="45%"
            />

          </DoubleInputContainer>

          <TextInput
            label="Competition Code"
            placeholder="COMP1234"
            type="text"
            required={true}
            value={competitionInfo.code}
            onChange={(e) => handleChange(e, "code")}
            width="100%"
            descriptor="Please type a unique code that will be used to identify your Competition"
          />

          <SiteLocationForm onAddLocation={handleAddSiteLocation} />

          {locationError && (
            <div
              style={{ color: "red", marginTop: "30px", textAlign: "center" }}
            >
              {locationError}
            </div>
          )}

          <LocationList>
            {optionDisplayList.map((displayObject, index) => {
              return (
                <LocationItem key={index}>
                  <div>{displayObject.label}</div>
                  <div>{displayObject.defaultSite}</div>
                  <DeleteIcon
                    onClick={() => handleDeleteSiteLocation(displayObject)}
                  >
                    x
                  </DeleteIcon>
                </LocationItem>
              );
            })}
          </LocationList>

          <ButtonContainer>
            <Button onClick={() => navigate("/dashboard")}>Back</Button>
            <Button type="submit" disabled={isButtonDisabled()}>
              Next
            </Button>
          </ButtonContainer>
        </FormContainer>
      </Container>
    </FlexBackground>
  );
};
