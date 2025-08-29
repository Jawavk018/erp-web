import React from "react";

interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleProps<T extends string> {
  options: ToggleOption[];
  selectedValue: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Toggle<T extends string>({
  options,
  selectedValue,
  onChange,
  className = "",
}: ToggleProps<T>) {
  return (
    <div className={`flex rounded-md bg-gray-100 p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedValue === option.value
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => onChange(option.value as T)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}