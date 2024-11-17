// IMPORTANT!!!!! Make sure you import these from vitest
import { describe, expect, it } from 'vitest';
//
import { render, screen } from '@testing-library/react';
import { CompRegisterFormProvider } from '../../CompRegisterFormProvider';
import { CompExperienceInput } from './CompExperienceInput';
import { contextRender } from '../../../../../../test_utils/contextRender';


describe('CompExperienceInput', () => {
  it('Renders correctly', async () => {
    // ARRANGE
    contextRender(
      <CompRegisterFormProvider>
        <CompExperienceInput />
      </CompRegisterFormProvider>
    )
    // ACT

    // EXPECT    
  });
});