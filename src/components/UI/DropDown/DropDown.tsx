import { FC, useState } from 'react';
import Select, { StylesConfig, CSSObjectWithLabel } from 'react-select';
import { SortBy } from 'components/Filter';
import { useSearchParams } from 'react-router-dom';
import styles from './dropdown.module.scss';

interface Option {
  value: number | string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  onSelectChange: (selectedOption: SortBy) => void;
  isSortDropdown?: boolean;
  theme: boolean;
}

interface CustomStylesProps {
  isFocused?: boolean;
  isSelected?: boolean;
}

const getBaseStyles = (
  theme: boolean,
  menuIsOpen: boolean,
): StylesConfig<Option, false> => ({
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: menuIsOpen
      ? 'var(--select-border-focudes-color)'
      : 'var(--select-border-color)',
    backgroundColor: 'var(--select-control-bg-color)',
    color: `${theme ? '#242736' : '#fff'}`,
    boxShadow: 'none',
    borderRadius: '8px',
    fontFamily: 'Mont',
    fontSize: '14px',
    fontWeight: '500',
    minHeight: '40px',
    cursor: 'pointer',
    transition: 'border-color .2s ease',

    '&:hover': {
      borderColor: 'var(--select-border-focudes-color)',
    },
    '&:hover [class*="indicatorContainer"]': {
      color: 'var(--select-border-focudes-color)',
    },
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    color: 'var(--primary-color)',
    transition: 'all .3s ease',
  }),

  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: 'var(--select-menu-border-color)',
  }),
  option: (base: CSSObjectWithLabel, { isSelected }: CustomStylesProps) => ({
    ...base,
    fontSize: '14px',
    lineHeight: '21px',
    cursor: 'pointer',
    color: `${isSelected ? 'var(--select-menu-selected-color)' : 'var(--select-menu-not-selected-color)'}`,
    fontWeight: '500',
    backgroundColor: `var(--main-bg-color)`,
    '&:hover': {
      backgroundColor: `var(--select-option-hover-color)`,
      color: `var(--select-hover-text-color)`,
      transition: 'all .3s ease',
    },
  }),
  valueContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: '0 12px',
    lineHeight: '1',
  }),
  dropdownIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    color: menuIsOpen
      ? 'var(--select-border-focudes-color)'
      : 'var(--select-border-color)',
    transition: 'transform .2s ease, color .2s ease',
    transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transformOrigin: 'center',
    '&:hover': {
      color: 'var(--select-border-focudes-color)',
    },
  }),
  indicatorSeparator: (base: CSSObjectWithLabel) => ({
    ...base,
    display: 'none',
  }),
  indicatorsContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: '0 4px',
  }),
});

const getCustomStyles = (
  theme: boolean,
  menuIsOpen: boolean,
): StylesConfig<Option, false> => {
  const baseStyles = getBaseStyles(theme, menuIsOpen);
  return {
    ...baseStyles,
    container: (base: CSSObjectWithLabel) => ({
      ...base,
      minWidth: '180px',
    }),
  };
};

const getDefaultStyles = (
  theme: boolean,
  menuIsOpen: boolean,
): StylesConfig<Option, false> => {
  const baseStyles = getBaseStyles(theme, menuIsOpen);
  return {
    ...baseStyles,
    container: (base: CSSObjectWithLabel) => ({
      ...base,
      width: '136px',
    }),
  };
};

export const Dropdown: FC<DropdownProps> = ({
  options,
  onSelectChange,
  isSortDropdown,
  theme,
}) => {
  const handleChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      onSelectChange(selectedOption.value as SortBy);
    }
  };

  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const sortByParam = params.get('sort');
  const perPageParam = params.get('perPage');

  const getSelectedValue = (options: Option[]) => {
    if (options[0].value === SortBy.age) {
      return options.find(option => option.value === sortByParam);
    }
    return options.find(option => option.value === Number(perPageParam));
  };

  const isWideScreen = window.innerWidth >= 640;
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className={styles.root}>
      <Select
        classNamePrefix="catalog-select"
        defaultValue={getSelectedValue(options) || options[0]}
        options={options}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        styles={
          isSortDropdown && isWideScreen
            ? getCustomStyles(theme, menuIsOpen)
            : getDefaultStyles(theme, menuIsOpen)
        }
        isSearchable={false}
        blurInputOnSelect
        onChange={handleChange}
      />
    </div>
  );
};
