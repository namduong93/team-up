import { createContext, useContext } from "react";
import { FormState } from "../FormState";

interface MultiStepCompRegoFormContextType {
  formData: FormState;
  setFormData: (data: Partial<FormState>) => void
}

export const MultiStepCompRegoFormContext = createContext<MultiStepCompRegoFormContextType | undefined>(undefined);

export const useMultiStepCompRegoForm = () => {
  const context = useContext(MultiStepCompRegoFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }
  return context;
};

