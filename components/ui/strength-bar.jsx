"use client";

/**
 * Reusable password strength indicator component
 * 
 * Scoring system:
 * - 1 point: At least 8 characters
 * - 1 point: Contains uppercase letter (A-Z)
 * - 1 point: Contains number (0-9)
 * - 1 point: Contains special character (!@#$%^&* etc)
 * 
 * Score mapping:
 * 1 = Weak (red)
 * 2 = Fair (orange)
 * 3 = Strong (yellow)
 * 4 = Very Strong (green) - All requirements met
 */
export default function StrengthBar({ password = "" }) {
  if (!password) return null;

  // Calculate strength score
  const requirements = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[A-Z]/, label: "Uppercase letter (A-Z)" },
    { regex: /[0-9]/, label: "Number (0-9)" },
    { regex: /[^A-Za-z0-9]/, label: "Special character (!@#$%)" },
  ];

  const metRequirements = requirements.filter(req => req.regex.test(password));
  const score = metRequirements.length;

  // Color and label mapping
  const colorMap = {
    1: { bar: "bg-red-500", label: "Weak" },
    2: { bar: "bg-amber-500", label: "Fair" },
    3: { bar: "bg-yellow-500", label: "Strong" },
    4: { bar: "bg-emerald-500", label: "Very Strong" },
  };

  const { bar: barColor, label: strengthLabel } = colorMap[score] || { bar: "bg-neutral-200", label: "" };

  // if score is max, render only the hint
  if (score === 4) {
    return (
      <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700">
        Excellent! Your password meets all requirements for maximum security.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Strength bar visual */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-sm transition-all ${
                i <= score ? barColor : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium shrink-0 ${
          score === 1 ? "text-red-600" :
          score === 2 ? "text-amber-600" :
          score === 3 ? "text-yellow-600" :
          "text-emerald-600"
        }`}>
          {strengthLabel}
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="flex flex-col gap-1.5 text-xs">
        {requirements.map((req, idx) => {
          const isMet = req.regex.test(password);
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 transition-colors ${
                isMet ? "text-emerald-600" : "text-neutral-400"
              }`}
            >
              <span className="text-sm">
                {isMet ? "✓" : "○"}
              </span>
              <span>{req.label}</span>
            </div>
          );
        })}
      </div>

      {/* "Very Strong" hint */}
      {score === 4 && (
        <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700">
          Excellent! Your password meets all requirements for maximum security.
        </div>
      )}
    </div>
  );
}