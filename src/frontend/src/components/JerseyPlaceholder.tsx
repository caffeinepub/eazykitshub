interface JerseyPlaceholderProps {
  team?: string;
  className?: string;
}

const TEAM_COLORS: Record<string, [string, string]> = {
  "Real Madrid": ["#FFFFFF", "#1A1A2E"],
  Barcelona: ["#A50044", "#004D98"],
  "Manchester United": ["#DA020E", "#FBE122"],
  Liverpool: ["#C8102E", "#00B2A9"],
  Chelsea: ["#034694", "#D1D3D4"],
  Arsenal: ["#EF0107", "#9C824A"],
  PSG: ["#004170", "#DA291C"],
  "Bayern Munich": ["#DC052D", "#0066B2"],
  Juventus: ["#231F20", "#FFFFFF"],
  "AC Milan": ["#FB090B", "#000000"],
};

export default function JerseyPlaceholder({
  team = "",
  className = "",
}: JerseyPlaceholderProps) {
  const colors = TEAM_COLORS[team] || ["#C8102E", "#1A1A2E"];
  const [primary, secondary] = colors;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${secondary}22 0%, ${secondary}44 100%)`,
      }}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-2/3 h-2/3 opacity-60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={team ? `${team} jersey` : "Jersey placeholder"}
      >
        {/* Jersey shape */}
        <path
          d="M60 20 L20 60 L40 80 L40 220 L160 220 L160 80 L180 60 L140 20 L120 40 Q100 50 80 40 Z"
          fill={primary}
          stroke={secondary}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Sleeve lines */}
        <path
          d="M60 20 L20 60 L40 80"
          stroke={secondary}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M140 20 L180 60 L160 80"
          stroke={secondary}
          strokeWidth="2"
          fill="none"
        />
        {/* Number */}
        <text
          x="100"
          y="160"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="60"
          fontWeight="900"
          fontFamily="sans-serif"
          fill={secondary}
          opacity="0.4"
        >
          {team ? team.charAt(0) : "?"}
        </text>
      </svg>
    </div>
  );
}
