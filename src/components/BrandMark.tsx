const BrandMark = () => (
  <span className="brand__mark" aria-hidden="true">
    <svg
      className="brand__logo"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 5 55 18v26L32 58 9 44V18L32 5Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 43V20l17 11 17-11v20c0 8-5 13-13 13-5 0-9-2-12-6"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 31v20"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <g
        fill="var(--brand-mark-node-fill, currentColor)"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="32" cy="5" r="3.5" />
        <circle cx="55" cy="18" r="3.5" />
        <circle cx="55" cy="44" r="3.5" />
        <circle cx="32" cy="58" r="3.5" />
        <circle cx="9" cy="44" r="3.5" />
        <circle cx="9" cy="18" r="3.5" />
      </g>
    </svg>
  </span>
);

export default BrandMark;
