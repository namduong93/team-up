
export const MultiStepRegoFormProvider: React.FC<{ children: ReactNode }> = ({children}) => {
  const [formData, setFormData] = useState<FormState>(initialState);

  const updateFormData = (data: Partial<FormState>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <MultiStepRegoFormContext.Provider value={{ formData, setFormData: updateFormData }}>
      {children}
    </MultiStepRegoFormContext.Provider>
  );
};
