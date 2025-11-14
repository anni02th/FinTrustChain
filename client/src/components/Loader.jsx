import React from "react";

export default function Loader({ size = 48 }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="rounded-full border-4 border-t-transparent animate-spin"
        style={{ width: size, height: size, borderColor: "rgba(255,255,255,0.12)", borderTopColor: "#7C3AED" }}
      />
    </div>
  );
}
