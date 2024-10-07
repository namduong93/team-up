import { FC, useState } from "react";
import styled from "styled-components";

interface FilterProps {
  options: { [field: string]: string[] };
  onFilterChange: (selectedFilters: { [field: string]: string[] }) => void;
  isOpen: boolean; // controls pop-up visibility
}

const FilterContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 140px;
  right: 30px;
  z-index: 1000;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  padding: 10px;
  width: 300px;
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const FilterField = styled.div`
  margin-bottom: 20px;
`;

const FieldTitle = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const OptionButton = styled.button<{ selected: boolean }>`
  background-color: ${({ selected, theme }) => (selected ? theme.colours.optionSelected : theme.colours.optionUnselected)};
  color: ${({ theme }) => theme.fonts.colour};
  margin: 5px;
  padding: 4px 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.optionSelected};
  }
`;

export const FilterSelect: FC<FilterProps> = ({ options, onFilterChange, isOpen }) => {
  const [selectedFilters, setSelectedFilters] = useState<{ [field: string]: string[] }>({});

  const handleSelect = (field: string, option: string) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (!updated[field]) {
        updated[field] = [option];
      } else if (updated[field].includes(option)) {
        updated[field] = updated[field].filter((item) => item !== option);
      } else {
        updated[field].push(option);
      }
      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <FilterContainer isOpen={isOpen}>
      {Object.keys(options).map((field) => (
        <FilterField key={field}>
          <FieldTitle>{field}</FieldTitle>
          {options[field].map((option) => (
            <OptionButton
              key={option}
              selected={selectedFilters[field]?.includes(option)}
              onClick={() => handleSelect(field, option)}
            >
              {option}
            </OptionButton>
          ))}
        </FilterField>
      ))}
    </FilterContainer>
  );
};
