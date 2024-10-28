import Fuse, { FuseResult } from "fuse.js";
import React, { FC, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";

const DropdownContainerDiv = styled.div`
  height: 36px;
  border-radius: 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  color: ${({ theme }) => theme.fonts.colour};
  
`;

const DropdownTextInput = styled.input`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.notifDark};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};

  &:focus + div {
    border-color: ${({ theme }) => theme.fonts.colour};
  }

`;

const DropdownIconDiv = styled.div`
  position: absolute;
  width: 36px;
  height: 100%;
  z-index: 5000;
  right: 0;
  top: 0;
  border-left: 1px solid ${({ theme }) => theme.colours.notifDark};
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;


// dropdown opts

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  optionsState: [Array<{
    value: string;
    label: string;
  }>, React.Dispatch<React.SetStateAction<Array<{ value: string, label: string }>>>];
  setCurrentSelected: React.Dispatch<React.SetStateAction<{ value: string, label: string }>>;
  label?: string;
  isExtendable?: boolean;
}

const DropdownOptionsDiv = styled.div`
  position: absolute;
  width: 100%;
  right: 0;
  min-height: 36px;
  min-width: 200px;
  background-color: ${({ theme }) => theme.background};
  top: calc(100% + 3px);
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  box-sizing: border-box;
  max-height: 150px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    border-radius: 10px;
  }
`;

const OptionContainerDiv = styled.button<{ $isLast: boolean }>`
  all: unset;
  width: 100%;
  height: 36px;
  display: flex;
  overflow: hidden;
  align-items: center;
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  ${({$isLast, theme}) => $isLast ? '' : `border-bottom: 1px solid ${theme.colours.sidebarBackground}`};
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.colours.primaryLight};
    cursor: pointer;
  }
`;

interface OptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  options: Array<FuseResult<{ value: string, label: string }>> | Array<{ item: { value: string, label: string } }>;
  searchTerm: string;
  display: boolean;
  handleSelectOption: (e: React.MouseEvent<HTMLButtonElement>, value: string, label: string) => void;
  handleCreate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isExtendable?: boolean;
}

const DropdownOptions: FC<OptionsProps> = ({
  options, display, searchTerm, isExtendable = true,
  handleSelectOption, handleCreate, style, ...props }) => {
  
  return (display &&
    <DropdownOptionsDiv style={{ ...style }} {...props}>
      {
        options.map(({item: { value, label } }, index) => {
          return (
            <OptionContainerDiv type="button" key={index} $isLast={false}
              onClick={(e) => handleSelectOption(e, value, label)}
              onMouseDown={(e) => { e.preventDefault(); }}
            >
              {label}
            </OptionContainerDiv>
          )
        })
      }

        {searchTerm && isExtendable && !options.some(({ item: { value: _, label } }) => label === searchTerm) &&
        <OptionContainerDiv $isLast={true}
          onClick={handleCreate}
          onMouseDown={(e) => { e.preventDefault(); }}
        >
          Create "{searchTerm}"
        </OptionContainerDiv>}
    </DropdownOptionsDiv>
  )
}


// PROPS:
// - optionsState ---[ options -- state variable list of { value: string, label: string }, setOptions -- setSate for the options state variable ]
// - setCurrentSelected --- setState function that should track the currently selected option ({ value: string, label: string })
// - style --- additional styling to apply to the dropdown container
// - props --- additional props to apply to the dropdown container
// 
// INSTRUCTIONS:
// To use the advanced dropdown create a state variable [<optionList>, set<OptionList>] of some kind that contains the list of options
// that can be chosen from in the dropdown, then create a state variable [currentSelected, setCurrentSelected] that should store
// the currently selected option (of type { value: string, label: string }). Then provide the optionsState prop containing the
// optionList and setOptionList, along with the setCurrentSelected setState as props to the advanced dropdown
// Then, the currentSelected state variable will have the currently selected option loaded into it, if the user creates their own
// option then the value of that new option will be an empty string '' but the label will be the name they inserted for their own option
export const AdvancedDropdown: FC<DropdownProps> = ({
  optionsState: [options, setOptions], setCurrentSelected, isExtendable = true, style, ...props }) => {
  
    const [searchTerm, setSearchTerm] = useState('');
  const [displayDropdown, setDisplayDropdown] = useState(false);

  const fuse = new Fuse(options, {
    keys: ['label'],
    threshold: 1,
  });

  let filteredOptions;
  if (searchTerm) {
    filteredOptions = fuse.search(searchTerm);
  } else {
    filteredOptions = options.map(obj =>{ return { item: obj }});
  }


  const handleSelectOption = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>, value: string, label: string) => {
    e.preventDefault();
    setCurrentSelected({ value, label });
    setSearchTerm(label);
    e.currentTarget.focus();
    e.currentTarget.blur();
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSelectOption(e, filteredOptions[0].item.value, filteredOptions[0].item.label);
    }
  }

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOptions((prevOptions) => [ ...prevOptions, { value: '', label: searchTerm } ]);
    handleSelectOption(e, '', searchTerm);
  }
  return (
    <DropdownContainerDiv style={{ ...style }} {...props}>
      <DropdownTextInput
        type='text'
        onFocus={() => setDisplayDropdown(true)}
        onBlur={() => setDisplayDropdown(false)}
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      >
      </DropdownTextInput>
      <DropdownIconDiv>
        <IoIosArrowDown style={{ height: '50%', width: '50%' }} />
      </DropdownIconDiv>

      <DropdownOptions isExtendable={isExtendable} handleCreate={handleCreate} handleSelectOption={handleSelectOption} display={displayDropdown}
        searchTerm={searchTerm} options={filteredOptions} />
    </DropdownContainerDiv>
  )
}