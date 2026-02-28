"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import React, { forwardRef } from "react";

const AuthInput = forwardRef(function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  error,
  autoComplete,
  ...inputProps
}, ref) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          ref={ref}
          {...inputProps}
          className={`w-full text-sm px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300
            ${error ? "border-rose-500" : "border-neutral-300"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-rose-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

export default AuthInput;