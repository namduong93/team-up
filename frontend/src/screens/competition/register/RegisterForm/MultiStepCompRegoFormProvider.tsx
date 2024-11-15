import { useState } from "react";
import { FormState, initialState } from "./FormState";
import { MultiStepCompRegoFormContext } from "./hooks/useMultiStepCompRegoForm";

export const MultiStepCompRegoFormProvider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children}) => {
  const [formData, setFormData] = useState<FormState>(initialState);

  const updateFormData = (data: Partial<FormState>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <MultiStepCompRegoFormContext.Provider value={{ formData, setFormData: updateFormData }}>
      {children}
    </MultiStepCompRegoFormContext.Provider>
  );
};