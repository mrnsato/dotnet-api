"use client";

import React, { forwardRef } from "react";

type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (val: boolean) => void;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={`w-4 h-4 rounded border ${className}`}
        {...rest}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";