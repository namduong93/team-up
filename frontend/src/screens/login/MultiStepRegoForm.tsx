import React, { createContext, useContext, useState } from 'react';

interface FormState {
  role: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  preferredPronoun: string;
  email: string;
  password:string;
  tShirtSize: string;
  foodAllergies?: string;
  dietaryRequirements?: string[];
  accessibilityRequirements?: string;

}

interface MultiStepRegoFormContextType {
  formData: FormData;
  setFormData: (data: FormData) => void
  resetFormData: () => void;
}

const MultiStepRegoFormContext = createContext<MultiStepRegoFormContextType | undefined>(undefined);

export const useMultiStepRegoForm

const initialState: FormState = {
  role: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  preferredPronoun: '',
  email: '',
  password: '',
  tShirtSize: '',
  foodAllergies: '',
  dietaryRequirements: [],
  accessibilityRequirements: '',
}