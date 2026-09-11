const tones = {
  neutral: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
};

export default function Badge({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}
