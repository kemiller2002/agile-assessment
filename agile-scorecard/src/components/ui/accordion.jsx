import { useState } from "react";

export function Accordion({ children, type, className = "" }) {
  return <div className={`border rounded ${className}`}>{children}</div>;
}

export function AccordionItem({ value, children }) {
  return <div className="border-t">{children}</div>;
}

export function AccordionTrigger({ children, className = "", ...props }) {
  return <button className={`w-full text-left px-4 py-2 font-semibold ${className}`} {...props}>{children}</button>;
}

export function AccordionContent({ children }) {
  return <div className="px-4 py-2">{children}</div>;
}
