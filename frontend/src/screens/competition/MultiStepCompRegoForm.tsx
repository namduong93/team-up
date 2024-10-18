import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FormState {
  degreeYear: number;
  degree: string;
  ICPCEligibility: boolean | undefined;
  isRemote: boolean | undefined;
  competitionLevel: string;
  boersenEligible?: boolean;
  courses: string[];
  codeforce?: number;
  pastRegional?: boolean | undefined;
  nationalPrizes?: string;
  internationalPrizes?: string;
}

const initialState: FormState = {
  degreeYear: 0,
  degree: '',
  ICPCEligibility: undefined,
  isRemote: undefined,
  competitionLevel: '',
  boersenEligible: undefined,
  courses: [],
  codeforce: undefined,
  pastRegional: undefined,
  nationalPrizes: "",
  internationalPrizes: "",
}

interface MultiStepCompRegoFormContextType {
  formData: FormState;
  setFormData: (data: Partial<FormState>) => void
}

const MultiStepCompRegoFormContext = createContext<MultiStepCompRegoFormContextType | undefined>(undefined);

export const MultiStepCompRegoFormProvider: React.FC<{ children: ReactNode }> = ({children}) => {
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

export const useMultiStepCompRegoForm = () => {
  const context = useContext(MultiStepCompRegoFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }
  return context;
};

