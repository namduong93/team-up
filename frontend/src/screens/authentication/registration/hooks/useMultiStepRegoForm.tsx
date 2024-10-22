import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FormState {
  role: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  gender: string;
  preferredPronoun?: string;
  email: string;
  password:string;
  tShirtSize: string;
  foodAllergies?: string;
  dietaryRequirements?: string[];
  accessibilityRequirements?: string;
  institution: string;
  studentId?: string;
}

const initialState: FormState = {
  role: '',
  firstName: '',
  lastName: '',
  preferredName: undefined,
  gender: '',
  preferredPronoun: undefined,
  email: '',
  password: '',
  tShirtSize: '',
  foodAllergies: undefined,
  dietaryRequirements: [],
  accessibilityRequirements: undefined,
  institution: '',
  studentId: undefined,
}

interface MultiStepRegoFormContextType {
  formData: FormState;
  setFormData: (data: Partial<FormState>) => void
}

const MultiStepRegoFormContext = createContext<MultiStepRegoFormContextType | undefined>(undefined);

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

export const useMultiStepRegoForm = () => {
  const context = useContext(MultiStepRegoFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }
  return context;
};

