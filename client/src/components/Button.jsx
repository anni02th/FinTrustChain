import React from "react";

export default function Button({ children, onClick, className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center gap-2 px-3 py-2 rounded font-semibold transition-transform transform hover:-translate-y-0.5 active:scale-95 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
