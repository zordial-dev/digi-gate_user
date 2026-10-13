import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface SearchableSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  flag?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  inputHeightClass?: string;
  testId?: string;
  allowCustomInput?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  disabled = false,
  className = "",
  inputHeightClass = "h-9",
  testId,
  allowCustomInput = true,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Find selected option object
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return options.find(
      (opt) => opt.value.toLowerCase() === value.toLowerCase() || opt.label.toLowerCase() === value.toLowerCase()
    );
  }, [options, value]);

  // Filter & sort options based on search query without duplicates
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();

    const matches = options.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(q);
      const valMatch = opt.value && opt.value.toLowerCase().includes(q);
      const subMatch = opt.sublabel && opt.sublabel.toLowerCase().includes(q);
      return labelMatch || valMatch || subMatch;
    });

    // Sort prefix matches first
    return matches.sort((a, b) => {
      const aStarts =
        a.label.toLowerCase().startsWith(q) ||
        (a.sublabel && a.sublabel.toLowerCase().startsWith(q)) ||
        (a.value && a.value.toLowerCase().startsWith(q));
      const bStarts =
        b.label.toLowerCase().startsWith(q) ||
        (b.sublabel && b.sublabel.toLowerCase().startsWith(q)) ||
        (b.value && b.value.toLowerCase().startsWith(q));

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }, [options, searchQuery]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        data-testid={testId}
        className={`w-full ${inputHeightClass} px-4 rounded-full border bg-[#F4F7F6] text-xs text-[#172525] flex items-center justify-between transition-all cursor-pointer ${
          isOpen
            ? "border-[#035352] bg-white ring-2 ring-[#035352]/20"
            : "border-slate-200 hover:border-slate-300 focus:outline-none"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedOption?.flag && <span className="text-sm shrink-0">{selectedOption.flag}</span>}
          <span className={`truncate font-medium ${!value ? "text-slate-400" : "text-[#172525]"}`}>
            {selectedOption ? selectedOption.label : value || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`size-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#035352]" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-[#035352]/10 space-y-2 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (filteredOptions.length > 0) {
                    handleSelect(filteredOptions[0].value);
                  } else if (allowCustomInput && searchQuery.trim()) {
                    handleSelect(searchQuery.trim());
                  }
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-8 pr-7 rounded-xl border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-1 focus:ring-[#035352]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.slice(0, 300).map((opt, idx) => {
                const isSelected =
                  value &&
                  (opt.value.toLowerCase() === value.toLowerCase() || opt.label.toLowerCase() === value.toLowerCase());
                return (
                  <button
                    key={`${opt.value}-${opt.label}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#035352]/10 text-[#035352] font-semibold"
                        : "text-[#172525] hover:bg-[#F4F7F6]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.flag && <span className="text-sm shrink-0">{opt.flag}</span>}
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[10px] text-slate-400 truncate">({opt.sublabel})</span>
                      )}
                    </div>
                    {isSelected && <Check className="size-3.5 text-[#035352] shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-2 text-center">
                <p className="text-[11px] text-slate-500">No matching options found</p>
                {allowCustomInput && searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSelect(searchQuery.trim())}
                    className="mt-1.5 text-xs font-semibold text-[#035352] hover:underline cursor-pointer"
                  >
                    Use "{searchQuery.trim()}"
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
