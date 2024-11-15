
export interface SiteLocation {
  id: number;
  name: string;
}
interface FormState {
  degreeYear: number;
  degree: string;
  ICPCEligibility: boolean | undefined;
  isRemote: boolean | undefined;
  competitionLevel: string;
  siteLocation: SiteLocation;
  boersenEligible?: boolean;
  courses: string[];
  codeforce?: number;
  pastRegional?: boolean | undefined;
  nationalPrizes?: string;
  internationalPrizes?: string;
  competitionBio:string;
  platform?: string;
  handle?: string;
}

const initialState: FormState = {
  degreeYear: 0,
  degree: '',
  ICPCEligibility: undefined,
  isRemote: undefined,
  competitionLevel: '',
  siteLocation: { id: 0, name: '' },
  boersenEligible: undefined,
  courses: [],
  codeforce: undefined,
  pastRegional: undefined,
  nationalPrizes: "",
  internationalPrizes: "",
  competitionBio:"",
  platform: undefined, 
  handle: undefined,
}

interface MultiStepCompRegoFormContextType {
  formData: FormState;
  setFormData: (data: Partial<FormState>) => void
}

const MultiStepCompRegoFormContext = createContext<MultiStepCompRegoFormContextType | undefined>(undefined);

export const useMultiStepCompRegoForm = () => {
  const context = useContext(MultiStepCompRegoFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }
  return context;
};

