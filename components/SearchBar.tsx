'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function SearchBar({
  placeholder = 'Search...',
  searchParamKey = 'search',
  queryKey = 'users',
  debounceMs = 400,
}: {
  placeholder?: string;
  searchParamKey?: string;
  queryKey?: string;
  debounceMs?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get(searchParamKey) || '';
  const [term, setTerm] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      queryClient.invalidateQueries({queryKey: [queryKey]})
      if (term) params.set(searchParamKey, term);
      else params.delete(searchParamKey);
      params.delete('page');
      router.push(`?${params.toString()}`);
    }, debounceMs);
    return () => clearTimeout(timeout);
  }, [term]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        ref={inputRef}
        id="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="
          block w-full rounded-md border border-gray-300
          bg-white py-2 pl-9 pr-3 text-sm
          placeholder:text-gray-500
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
          transition-colors
        "
      />
    </div>
  );
}
