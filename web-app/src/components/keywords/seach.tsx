"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  className?: string;
  delay?: number;
}

export function Search({
  onSearch,
  className,
  delay = 500,
  ...props
}: SearchProps) {
  const [value, setValue] = React.useState("");
  const debouncedValue = useDebounce(value, delay);
  React.useEffect(() => {
      onSearch?.(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("pl-8", className)}
        placeholder={props.placeholder || "Search..."}
        type="search"
      />
    </div>
  );
}
