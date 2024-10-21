import React, { FC, ReactNode, SetStateAction, useState } from "react";
import { FaBell, FaSort } from "react-icons/fa";
import styled from "styled-components";
import { SortOption, SortSelect } from "../general_utility/SortSelect";
import { FilterIcon, FilterSelect } from "../general_utility/FilterSelect";
import { SearchBar } from "../../screens/staff/CoachPage/PageUtils";
import { Notifications } from "../general_utility/Notifications";
import { AlertButton } from "../../screens/Dashboard/Dashboard";

type Filters = Record<string, Array<string>>;

export const PageHeaderContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  min-height: 117px;
  width: 100%;
`;

export const PageTitle = styled.h1`
  margin-bottom: 0;
  font-size: 2em;
`;

export const PageDescriptionSpan = styled.span`
  color: #525252;
  font-size: 1em;
`;

export const MenuOptionsContainerDiv = styled.div`
  margin-right: min(20px, 2%);
  flex: 1;
  max-width: 360px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
`;

export const ButtonContainer = styled.div`
  width: 19%;
  height: 33px;
  position: relative;
  min-width: 29px;
`;

export const SortFilterSearchContainerDiv = styled.div`
  width: 100%;
  /* min-width: 152px; */
  height: 66px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  column-gap: 4px;
  min-width: 62px;
`;

interface ResponsiveSortButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  icon: ReactNode;
  label: string;
}

export const SortButton = styled.button<{ $isSortOpen: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.filterText};
  color: ${({ theme }) => theme.colours.filterText};
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;

  ${({ $isSortOpen: isSortOpen, theme }) =>
    isSortOpen &&
    `
    background-color: ${theme.colours.sidebarBackground};
    color: ${theme.fonts.colour};
  `}

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

export const ResponsiveButton: FC<ResponsiveSortButtonProps> = ({ onClick, icon, label, style, isOpen, ...props }) => {
  return (
    <SortButton onClick={onClick} style={{
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      padding: '0',
      display: 'flex',
      flexWrap: 'wrap',
      ...style
    }} $isSortOpen={isOpen} {...props}>
      <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          {icon}
        </div>
        <span>{label}</span>
      </div>
    </SortButton>
  )
}

export const SortIcon = styled(FaSort)`
  height: 50%;
  flex: 0 0 auto;
`;

interface HeaderAttributes extends React.HTMLAttributes<HTMLDivElement> {
  pageTitle: string;
  pageDescription: string;
  sortOptions?: Array<SortOption>;
  filterOptions?: Record<string, Array<string>>;
  sortOptionState?: { sortOption: string | null, setSortOption: React.Dispatch<SetStateAction<string | null>> };
  filtersState?: { filters: Filters, setFilters: React.Dispatch<SetStateAction<Filters>> };
  searchTermState?: { searchTerm: string, setSearchTerm: React.Dispatch<SetStateAction<string>> };
}

const AdditionalElementsDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 4px;
  flex-direction: row-reverse;
`;

// ACCEPTS PROPS:
// - pageTitle --- The large header to appear at the top of the page
// - pageDescription --- The subheading
// - filterOptions --- The different filters that can be chosen for the page
// - sortOptions --- The different sorting methods that can be chosen for the page
// - sortOptionState --- sortOption: state variable representing current selected option, setSortOption: the setState function for sortOption
// - filtersState --- filters: state variable of current filters, setFilters: setState function for filters
// - searchTermState --- searchTerm: state variable of current search query, setSearchTerm: setState for searchTerm
// - children --- IMPORTANT, contains any extra page-specific buttons to appear in the top-right
// - style --- extra styling for the outermost container of PageHeader if needed
// - props --- extra props for the outermost container of PageHeader if needed
export const PageHeader: FC<HeaderAttributes> = ({
  pageTitle, pageDescription,
  filterOptions,
  sortOptions,
  sortOptionState /*{ sortOption, setSortOption }*/,
  filtersState /*{ filters, setFilters } */,
  searchTermState /*{ searchTerm, setSearchTerm }*/,
  children, style, ...props }) => {

  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
  <PageHeaderContainerDiv style={{ flexDirection: 'row', justifyContent: 'space-between', ...style }} {...props}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around' }}>
      <PageTitle>{pageTitle}</PageTitle>
      <PageDescriptionSpan>{pageDescription}</PageDescriptionSpan>
    </div>

    <MenuOptionsContainerDiv>
      <SortFilterSearchContainerDiv>
        {sortOptions && sortOptionState &&
        <ButtonContainer>
          
          <ResponsiveButton
            icon={<SortIcon />}
            label='Sort'
            isOpen={isSortOpen}
            onClick={() => setIsSortOpen((prev) => !prev)}
          />

          {isSortOpen && 
          <SortSelect
            isOpen={isSortOpen}
            onSortChange={(sortOption) => sortOptionState.setSortOption(sortOption)}
            options={sortOptions} 
          />}

        </ButtonContainer>}
        
        {filterOptions && filtersState &&
        <ButtonContainer>
          <ResponsiveButton
            icon={<FilterIcon />}
            label='Filter'
            isOpen={isFilterOpen}
            onClick={() => setIsFilterOpen((prev) => !prev)}
          />

          {isFilterOpen &&
            <FilterSelect
              options={filterOptions}
              isOpen={isFilterOpen}
              onFilterChange={(selectedFilters) => filtersState.setFilters(selectedFilters)}
              currentFilters={filtersState.filters} 
          />}
        </ButtonContainer>}
        
        {searchTermState &&
        <ButtonContainer style={{ flex: '1 1 58px' }}>
          <SearchBar value={searchTermState.searchTerm}
            onChange={(e) => searchTermState.setSearchTerm(e.target.value)} />
        </ButtonContainer>}
      </SortFilterSearchContainerDiv>
      <AdditionalElementsDiv>
        <Notifications />
        {children}
      </AdditionalElementsDiv>
    </MenuOptionsContainerDiv>
  </PageHeaderContainerDiv>
  )
}