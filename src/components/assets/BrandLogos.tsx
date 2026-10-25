import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  color?: string;
}

export const PythonLogo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" className={className} fill="none">
    <path
      d="M63.5 12C36.8 12 38.5 23.6 38.5 23.6L38.6 35.6H64.2V39.2H25.3C25.3 39.2 12 37.7 12 64.3C12 90.9 23.6 89.6 23.6 89.6H31.6V78.4C31.6 78.4 31 64.8 45 64.8H63.6C63.6 64.8 77.2 64.8 77.2 51.5V25.2C77.2 25.2 78.4 12 63.5 12ZM48.5 20.3C52.2 20.3 55.2 23.3 55.2 27C55.2 30.7 52.2 33.7 48.5 33.7C44.8 33.7 41.8 30.7 41.8 27C41.8 23.3 44.8 20.3 48.5 20.3Z"
      fill="#3776AB"
    />
    <path
      d="M64.5 116C91.2 116 89.5 104.4 89.5 104.4L89.4 92.4H63.8V88.8H102.7C102.7 88.8 116 90.3 116 63.7C116 37.1 104.4 38.4 104.4 38.4H96.4V49.6C96.4 49.6 97 63.2 83 63.2H64.4C64.4 63.2 50.8 63.2 50.8 76.5V102.8C50.8 102.8 49.6 116 64.5 116ZM79.5 107.7C75.8 107.7 72.8 104.7 72.8 101C72.8 97.3 75.8 94.3 79.5 94.3C83.2 94.3 86.2 97.3 86.2 101C86.2 104.7 83.2 107.7 79.5 107.7Z"
      fill="#FFD43B"
    />
  </svg>
);

export const RustLogo: React.FC<LogoProps> = ({ size = 64, className = '', color = '#EA580C' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    {/* Outer gear teeth */}
    <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="8" strokeDasharray="6 4" />
    <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="4" />
    {/* Center R */}
    <path
      d="M38 32H54C59.5 32 63 35.5 63 40.5C63 44.5 60.5 47.5 56.5 48.5L64 68H55.5L48.8 51.5H45.5V68H38V32ZM45.5 45.5H53C55.5 45.5 57 44 57 41.5C57 39 55.5 37.5 53 37.5H45.5V45.5Z"
      fill={color}
    />
  </svg>
);

export const CppLogo: React.FC<LogoProps> = ({ size = 64, className = '', color = '#0284C7' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    {/* Hexagon */}
    <polygon
      points="50,8 86,28 86,72 50,92 14,72 14,28"
      fill="#F0F9FF"
      stroke={color}
      strokeWidth="6"
      strokeLinejoin="round"
    />
    {/* C++ text */}
    <path
      d="M42 36C36 36 31 41 31 50C31 59 36 64 42 64C46 64 49 62 51 59L56 63C53 68 48 71 42 71C31 71 23 62 23 50C23 38 31 29 42 29C48 29 53 32 56 37L51 41C49 38 46 36 42 36Z"
      fill={color}
    />
    {/* Plus 1 */}
    <path d="M60 46H66V40H69V46H75V49H69V55H66V49H60V46Z" fill={color} />
    {/* Plus 2 */}
    <path d="M74 54H80V48H83V54H89V57H83V63H80V57H74V54Z" fill={color} />
  </svg>
);

export const XAiLogo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <rect width="100" height="100" rx="24" fill="#0F172A" />
    <path
      d="M30 28L68 72H58L20 28H30ZM45 46L24 72H34L50 52L45 46ZM54 48L76 28H66L49 42L54 48Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const GitHubLogo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 98 96" className={className} fill="#0F172A">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
    />
  </svg>
);

export const CopilotLogo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <rect width="100" height="100" rx="24" fill="#0284C7" />
    <path
      d="M32 44C32 35.1634 39.1634 28 48 28H52C60.8366 28 68 35.1634 68 44V56C68 64.8366 60.8366 72 52 72H48C39.1634 72 32 64.8366 32 56V44Z"
      fill="#FFFFFF"
    />
    <circle cx="43" cy="48" r="4" fill="#0284C7" />
    <circle cx="57" cy="48" r="4" fill="#0284C7" />
    <path d="M44 58C47 61 53 61 56 58" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const HuggingFaceLogo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <rect width="100" height="100" rx="24" fill="#FEF08A" />
    {/* Smiling face */}
    <circle cx="50" cy="50" r="32" fill="#FACC15" />
    <ellipse cx="40" cy="46" rx="3.5" ry="5" fill="#1E293B" />
    <ellipse cx="60" cy="46" rx="3.5" ry="5" fill="#1E293B" />
    <path
      d="M38 56C42 62 58 62 62 56"
      stroke="#1E293B"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Hugging hands */}
    <path
      d="M20 54C22 46 30 46 30 52C30 58 24 62 20 54Z"
      fill="#EAB308"
    />
    <path
      d="M80 54C78 46 70 46 70 52C70 58 76 62 80 54Z"
      fill="#EAB308"
    />
  </svg>
);

export const MicrosoftLogo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <rect x="18" y="18" width="30" height="30" fill="#F25022" />
    <rect x="52" y="18" width="30" height="30" fill="#7FBA00" />
    <rect x="18" y="52" width="30" height="30" fill="#00A4EF" />
    <rect x="52" y="52" width="30" height="30" fill="#FFB900" />
  </svg>
);

export const GoogleLogo: React.FC<LogoProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <path
      d="M86.8 50.8C86.8 48.2 86.6 46.2 86.1 44.2H50V57.6H70.9C69.9 62.5 66.8 66.7 62.2 69.5V79.2H76.1C84.3 71.7 86.8 61.3 86.8 50.8Z"
      fill="#4285F4"
    />
    <path
      d="M50 88C60.3 88 68.9 84.6 75.3 78.7L61.4 69C58.6 70.9 54.8 72.2 50 72.2C40 72.2 31.5 65.5 28.5 56.4H14.1V66.4C20.6 79.2 34.2 88 50 88Z"
      fill="#34A853"
    />
    <path
      d="M28.5 56.4C27.7 54.1 27.3 51.6 27.3 49C27.3 46.4 27.7 43.9 28.5 41.6V31.6H14.1C11.3 37.1 9.7 42.9 9.7 49C9.7 55.1 11.3 60.9 14.1 66.4L28.5 56.4Z"
      fill="#FBBC05"
    />
    <path
      d="M50 25.8C55.6 25.8 60.6 27.7 64.5 31.4L75.6 20.3C68.8 13.9 60.2 10 50 10C34.2 10 20.6 18.8 14.1 31.6L28.5 41.6C31.5 32.5 40 25.8 50 25.8Z"
      fill="#EA4335"
    />
  </svg>
);
