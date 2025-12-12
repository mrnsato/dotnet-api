"use client";

import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { className?: string };

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";