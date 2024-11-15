


interface EditSiteCapacityPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onSubmit: (site: {label: string, value: number}, capacity: number) => void;
};

export const EditSiteCapacityPopUp: React.FC<EditSiteCapacityPopUpProps> = ({
  heading,
  onClose,
  onSubmit,
}) => {
  const { compId } = useParams();
  const { roles, siteOptionsState: [siteOptions, setSiteOptions] } = useCompetitionOutletContext("manage");
  const [selectedSite, setSelectedSite] = useState<{ value: string; label: string }>({label: "", value: "0"});
  const [capacity, setCapacity] = useState<number>(0);
  const [currentCapacity, setCurrentCapacity] = useState<number>(0);

  const [siteCapacities, setSiteCapacities] = useState<CompetitionSiteCapacity[] | undefined>()

  useEffect(() => {

    const fetchSiteCapacities = async () => {

      const ids = (roles.includes(CompetitionRole.Admin) ? siteOptions.map((site) => site.value) : []);

      const response = await sendRequest.get<{ site: CompetitionSiteCapacity[] }>(
        '/competition/site/capacity',
        { compId, ids });
      
      const { site: siteCapacities } = response.data;
      setSiteCapacities(siteCapacities);
    }
    fetchSiteCapacities();
  }, []);

  useEffect(() => {
    const newCapacity = siteCapacities?.find((site) => site.id === parseInt(selectedSite.value));
    console.log(newCapacity);
    setCurrentCapacity(newCapacity?.capacity || 0);
  }, [selectedSite, siteCapacities]);

  useEffect(() => {
    setSelectedSite(siteOptions[0]);
  }, [siteOptions]);


  // const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selected = siteOptions.find((site) => site.value === e.target.value);
  //   if (selected) {
  //     setSelectedSite(selected); // Update selectedSite state
  //   }

  //   console.log(selected?.label);
  // };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCapacity = Number(e.target.value);
    if (newCapacity >= 0) {
      setCapacity(newCapacity);
    }
  };

  const handleSubmit = async () => {
    // Call onSubmit with the site and capacity
    // onSubmit({label: selectedSite.label, value: parseInt(selectedSite.value)}, capacity);
    onClose();
    
    await sendRequest.put('/competition/site/capacity/update', { compId, siteId: parseInt(selectedSite.value), capacity });
  };

  return (
    <ModalOverlay>
      <Modal>
        <View>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
          <Container>
            <Heading>{heading}</Heading>
            <div style={{ display: "flex", alignContent: "center" }}>
              <Text>
                <em>Capacity is the number of participants your site can host.</em>
              </Text>
            </div>

            {roles.includes(CompetitionRole.Admin) && 
            <div style={{ width: '300px' }}>
              <AdvancedDropdown
                setCurrentSelected={setSelectedSite}
                optionsState={[siteOptions, setSiteOptions]}
                style={{ width: "100%" }}
                isExtendable={false}
                defaultSearchTerm={selectedSite.label}
              />
            </div>
            
            }
            <NumberInputLight
              label="Provide a capacity"
              value={currentCapacity}
              onChange={handleCapacityChange}
              currentCapacity={currentCapacity}
            />

            <Button onClick={handleSubmit} disabled={capacity <= 0} >Save Changes</Button>
          </Container>
        </View>
      </Modal>
    </ModalOverlay>
  );
};
