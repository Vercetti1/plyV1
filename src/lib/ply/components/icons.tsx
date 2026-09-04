import type { SVGProps } from "react";

/**
 * Ply ships its own icons so the library has no peer dependency on an icon
 * set. All of them inherit `currentColor` and size from `1em` by default.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}><path d="m20 6-11 11-5-5" /></Icon>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>
);
export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>
);
export const XIcon = (p: IconProps) => (
  <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>
);
export const SearchIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
);
export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);
export const MoonIcon = (p: IconProps) => (
  <Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></Icon>
);
export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
  </Icon>
);
export const AlertIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></Icon>
);
export const InfoIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></Icon>
);
export const CodeIcon = (p: IconProps) => (
  <Icon {...p}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></Icon>
);
export const MenuIcon = (p: IconProps) => (
  <Icon {...p}><path d="M3 6h18M3 12h18M3 18h18" /></Icon>
);
export const LayersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" />
  </Icon>
);

export const SpinnerIcon = ({ className, ...p }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
    className={className}
    {...p}
  >
    <circle
      cx="12" cy="12" r="9"
      fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform" type="rotate"
        from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"
      />
    </path>
  </svg>
);
