import { useState, useMemo } from 'react';

interface HasSearchableFields {
  [key: string]: any;
}

export const useDropdownSearch = <T extends HasSearchableFields>(
  options: T[],
  searchFields: (keyof T)[]
) => {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return options.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(query);
      })
    );
  }, [options, search, searchFields]);

  return {
    search,
    setSearch,
    focused,
    setFocused,
    filtered,
  };
};
