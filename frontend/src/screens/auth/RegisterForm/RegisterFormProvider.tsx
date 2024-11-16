import React, { useState } from "react";
import { MultiStepRegoFormContext } from "./hooks/useMultiStepRegoForm";
import { FormState, initialState } from "./FormState";

/**
 * A provider component that manages and provides the form data state for a multi-step registration form.
 *
 * The `RegisterFormProvider` component uses React's `useState` hook to manage the form's data (`formData`)
 * and provides a method (`updateFormData`) to update it. This provider makes the form data and the update
 * function available to any child components that consume the `MultiStepRegoFormContext`.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The properties passed to the provider,
 * including any child components to be rendered within the provider.
 *
 * @returns {JSX.Element} - A provider component that supplies the `formData` and `setFormData`
 * to its child components through context.
 */
export const RegisterFormProvider: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children }) => {
  const [formData, setFormData] = useState<FormState>(initialState);

  const updateFormData = (data: Partial<FormState>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <MultiStepRegoFormContext.Provider
      value={{ formData, setFormData: updateFormData }}
    >
      {children}
    </MultiStepRegoFormContext.Provider>
  );
};
