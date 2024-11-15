
interface ResponsiveSortButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  icon: ReactNode;
  label: string;
}

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

export const SearchBar: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ value, onChange, ...props }) => {
  return (
  <SearchContainer>
    <SearchInput type="text" value={value} onChange={onChange} {...props} />
    {!value && <SearchCell>
      <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          <SearchIcon />
        </div>
          <span>Search</span>
      </div>
    </SearchCell>}
  </SearchContainer>
  )
}