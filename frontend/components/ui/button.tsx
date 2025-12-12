"use client";

import React, { forwardRef, isValidElement, cloneElement } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "outline" | "destructive";
  className?: string;
};

const variantClasses: Record<string, string> = {
  default: "bg-sky-600 text-white hover:bg-sky-700",
  outline: "border bg-transparent text-gray-700 hover:bg-gray-100",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, variant = "default", className = "", children, ...rest }, ref) => {
    const base = "inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition";
    const classes = `${base} ${variantClasses[variant] ?? ""} ${className}`.trim();

    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement, {
        className: [classes, (children as any).props?.className].filter(Boolean).join(" "),
      } as any);
    }

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";