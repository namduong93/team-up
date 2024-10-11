import { FC, useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import styled from "styled-components";
interface FilterSelectProps {
  options: { [key: string]: string[] };
  onFilterChange: (selectedFilters: { [key: string]: string[] }) => void;
  isOpen: boolean;
  currentFilters: { [field: string]: string[] };
}

const FilterContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 33px;
  right: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding: 10px;
  max-width: 300px;
  width: 200px;
  
  height: fit-content;
  overflow-y: auto;
  overflow-x: hidden;
`;

const FilterField = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const FieldTitle = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const OptionButton = styled.button<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colours.optionSelected : theme.colours.optionUnselected};
  color: ${({ selected, theme }) =>
    selected ? theme.background : theme.fonts.colour};  margin: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.optionSelected};
    color: ${({ theme }) => theme.background};
  }
`;

export const FilterSelect: FC<FilterSelectProps> = ({
  options,
  onFilterChange,
  isOpen,
  currentFilters,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<{ [field: string]: string[] }>({});

  // update the current filters selected when prompted from filter tags in dashboard
  useEffect(() => {
    setSelectedFilters(currentFilters);
  }, [currentFilters]);

  const handleOptionChange = (field: string, option: string) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (!updated[field]) {
        updated[field] = [option];
      } else if (updated[field].includes(option)) {
        updated[field] = updated[field].filter((item) => item !== option);
        // if empty, remove
        if (updated[field].length === 0) {
          delete updated[field];
        }
      } else {
        updated[field].push(option);
      }
      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <FilterContainer $isOpen={isOpen}>
      {Object.entries(options).map(([field, values]) => (
        <FilterField key={field}>
          <FieldTitle>{field}</FieldTitle>
          {values.map((value) => (
            <OptionButton
              key={value}
              selected={selectedFilters[field]?.includes(value) || false}
              onClick={() => handleOptionChange(field, value)}
            >
              {value}
            </OptionButton>
          ))}
        </FilterField>
      ))}
    </FilterContainer>
  );
};

export const FilterIcon = styled(FaFilter)`
  height: 50%;
  flex: 0 0 auto;
`;
