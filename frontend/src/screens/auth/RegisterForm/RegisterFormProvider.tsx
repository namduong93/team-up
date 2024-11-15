import React, { useState } from "react";
import { MultiStepRegoFormContext } from "./hooks/useMultiStepRegoForm";
import { FormState, initialState } from "./FormState";

export const RegisterFormProvider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children}) => {
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
