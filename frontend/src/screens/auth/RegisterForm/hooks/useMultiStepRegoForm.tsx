import { createContext, useContext } from "react";
import { FormState } from "../FormState";


interface MultiStepRegoFormContextType {
  formData: FormState;
  setFormData: (data: Partial<FormState>) => void
}

export const MultiStepRegoFormContext = createContext<MultiStepRegoFormContextType | undefined>(undefined);

export const useMultiStepRegoForm = () => {
  const context = useContext(MultiStepRegoFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }
  return context;
};

