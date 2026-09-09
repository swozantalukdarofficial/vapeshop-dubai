"use client";

import React from "react";

export const VisaIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-auto" }) => (
  <svg className={className} viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="24" rx="4" fill="#1434CB"/>
    <path d="M15.5 17L17.2 7.5H19.7L18 17H15.5ZM25.2 7.7C24.7 7.5 23.9 7.3 22.9 7.3C20.3 7.3 18.5 8.6 18.5 10.5C18.5 11.9 19.8 12.7 20.8 13.2C21.8 13.7 22.1 14 22.1 14.4C22.1 15 21.3 15.3 20.5 15.3C19.4 15.3 18.8 15 18.3 14.8L17.8 17.2C18.5 17.5 19.7 17.8 21 17.8C23.7 17.8 25.4 16.5 25.4 14.5C25.4 13.3 24.6 12.4 23.3 11.8C22.5 11.4 22 11.1 22 10.7C22 10.3 22.4 9.9 23.3 9.9C24.1 9.9 24.7 10.1 25.1 10.3L25.6 7.9L25.2 7.7ZM30.3 7.5H28.4C27.8 7.5 27.3 7.7 27 8.3L23.3 17H26L26.5 15.6H29.7L30 17H32.4L30.3 7.5ZM27.2 13.5L28.3 10.5L29 13.5H27.2ZM14.1 7.5L11.7 13.1L11.4 11.7C10.9 10.1 9.4 8.4 7.7 7.5L12.4 17H15.1L19.2 7.5H14.1Z" fill="white"/>
    <path d="M10.2 7.5H5.9L5.8 7.7C9.1 8.5 11.5 10.5 12.4 13.1L11.5 7.5H10.2Z" fill="#F7B600"/>
  </svg>
);

export const MastercardIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-auto" }) => (
  <svg className={className} viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="24" rx="4" fill="#0A0E27"/>
    <circle cx="14.5" cy="12" r="7" fill="#EB001B"/>
    <circle cx="23.5" cy="12" r="7" fill="#F79E1B"/>
    <path d="M19 6.59C20.5 7.9 21.45 9.84 21.45 12C21.45 14.16 20.5 16.1 19 17.41C17.5 16.1 16.55 14.16 16.55 12C16.55 9.84 17.5 7.9 19 6.59Z" fill="#FF5F00"/>
  </svg>
);

export const ApplePayIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-auto" }) => (
  <svg className={className} viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="42" height="24" rx="4" fill="#000000" stroke="#333333"/>
    <path d="M11.8 11.2C11.8 9.9 12.8 9.2 12.9 9.1C12.3 8.2 11.3 8.1 11 8.1C10.2 8 9.4 8.5 9 8.5C8.6 8.5 8 8.1 7.3 8.1C6.4 8.1 5.6 8.6 5.1 9.4C4.2 11 4.9 13.4 5.7 14.7C6.1 15.3 6.6 16 7.3 16C7.9 16 8.2 15.6 8.9 15.6C9.6 15.6 9.8 16 10.5 16C11.2 16 11.7 15.3 12.1 14.7C12.6 14 12.8 13.3 12.8 13.2C12.8 13.2 11.8 12.7 11.8 11.2Z" fill="white"/>
    <path d="M10.8 7.2C11.2 6.7 11.4 6.1 11.3 5.5C10.8 5.5 10.2 5.8 9.8 6.3C9.5 6.7 9.2 7.3 9.3 7.9C9.9 8 10.5 7.6 10.8 7.2Z" fill="white"/>
    <path d="M16.5 8.2H18.8C20 8.2 20.8 8.9 20.8 10.1C20.8 11.3 20 12 18.8 12H17.7V15.8H16.5V8.2ZM17.7 10.9H18.7C19.3 10.9 19.7 10.6 19.7 10.1C19.7 9.5 19.3 9.2 18.7 9.2H17.7V10.9Z" fill="white"/>
    <path d="M24 15.8V14.7C23.6 15.4 22.8 15.9 21.8 15.9C20.4 15.9 19.4 14.7 19.4 13.2C19.4 11.7 20.4 10.5 21.8 10.5C22.8 10.5 23.5 11 23.9 11.7V10.6H25.1V15.8H24ZM22.3 14.8C23.1 14.8 23.9 14.1 23.9 13.2C23.9 12.2 23.1 11.5 22.3 11.5C21.4 11.5 20.7 12.2 20.7 13.2C20.7 14.1 21.4 14.8 22.3 14.8Z" fill="white"/>
    <path d="M26.2 10.6L28 14.8L29.7 10.6H31L28.6 16.1L27.4 18.8H26.2L27.1 16.6L24.9 10.6H26.2Z" fill="white"/>
  </svg>
);

export const GooglePayIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-auto" }) => (
  <svg className={className} viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="42" height="24" rx="4" fill="#FFFFFF" stroke="#E2E8F0"/>
    <path d="M10.8 12.1C10.8 11.7 10.7 11.3 10.6 11H6V12.9H8.7C8.6 13.5 8.2 14.1 7.6 14.5V15.8H9.2C10.1 14.9 10.8 13.6 10.8 12.1Z" fill="#4285F4"/>
    <path d="M6 17C7.3 17 8.4 16.5 9.2 15.8L7.6 14.5C7.2 14.8 6.6 15 6 15C4.8 15 3.8 14.2 3.4 13.1H1.8V14.4C2.6 16 4.2 17 6 17Z" fill="#34A853"/>
    <path d="M3.4 13.1C3.3 12.8 3.2 12.4 3.2 12C3.2 11.6 3.3 11.2 3.4 10.9V9.6H1.8C1.4 10.3 1.2 11.1 1.2 12C1.2 12.9 1.4 13.7 1.8 14.4L3.4 13.1Z" fill="#FBBC05"/>
    <path d="M6 9C6.7 9 7.3 9.2 7.8 9.7L9.2 8.3C8.4 7.5 7.3 7 6 7C4.2 7 2.6 8 1.8 9.6L3.4 10.9C3.8 9.8 4.8 9 6 9Z" fill="#EA4335"/>
    <path d="M14.5 12.2V14.6H13.2V8H16.4C17.2 8 17.9 8.3 18.5 8.8C19 9.3 19.3 10 19.3 10.8C19.3 11.6 19 12.3 18.5 12.8C17.9 13.3 17.2 13.6 16.4 13.6H14.5V12.2ZM14.5 9.3V12.2H16.4C16.8 12.2 17.2 12 17.5 11.7C17.8 11.4 18 11.1 18 10.8C18 10.4 17.8 10.1 17.5 9.8C17.2 9.5 16.8 9.3 16.4 9.3H14.5Z" fill="#5F6368"/>
    <path d="M21.5 14.8C20.9 14.8 20.4 14.6 20 14.2C19.6 13.8 19.4 13.2 19.4 12.6C19.4 11.9 19.6 11.4 20 11C20.4 10.6 20.9 10.4 21.5 10.4C22.1 10.4 22.6 10.6 23 11C23.4 11.4 23.6 11.9 23.6 12.6V12.8H20.7C20.7 13.2 20.9 13.5 21.1 13.7C21.4 13.9 21.7 14 22 14C22.5 14 22.9 13.8 23.1 13.3L24.2 13.8C23.9 14.4 23.4 14.8 22.7 14.8C22.3 14.8 21.9 14.8 21.5 14.8ZM20.7 11.8H22.3C22.3 11.5 22.2 11.3 22 11.1C21.8 10.9 21.6 10.8 21.3 10.8C21 10.8 20.8 10.9 20.6 11.1C20.4 11.3 20.7 11.5 20.7 11.8Z" fill="#5F6368"/>
    <path d="M25 10.5L26.7 14.8L28.4 10.5H29.7L27.3 16L26.1 18.7H24.9L25.8 16.5L23.6 10.5H25Z" fill="#5F6368"/>
  </svg>
);

export const CodPaymentIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-black text-[11px] uppercase tracking-wider shadow-xs border border-emerald-600 ${className}`}>
    <svg className="h-4 w-4 text-emerald-200 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
    <span className="whitespace-nowrap">Cash on Delivery</span>
  </div>
);

export const UaeFlagIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`h-4 w-6 rounded shrink-0 shadow-2xs ${className}`} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="2" fill="#000000"/>
    <path d="M0 0H9V24H0V0Z" fill="#FF0000"/>
    <path d="M9 0H36V8H9V0Z" fill="#007A3D"/>
    <path d="M9 8H36V16H9V8Z" fill="#FFFFFF"/>
    <path d="M9 16H36V24H9V16Z" fill="#000000"/>
  </svg>
);
