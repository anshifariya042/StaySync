import React from 'react';

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ value, onChange, placeholder = "Search for logs...", className = "" }: SearchInputProps) => (
  <div className={`relative group ${className}`}>
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F7C82] flex items-center transition-transform group-focus-within:scale-110">
        <Icon name="search" />
    </div>
    <input 
      className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-100 bg-white focus:outline-none focus:ring-4 focus:ring-[#B8E3E9]/50 focus:border-[#4F7C82] transition-all text-sm font-black text-[#0B2E33] placeholder:text-[#4F7C82] placeholder:opacity-30 shadow-sm" 
      placeholder={placeholder}
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SearchInput;
