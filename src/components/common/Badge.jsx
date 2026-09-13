export default function Badge({ children, tone = "neutral" }) {
  const styles = {
    neutral: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[tone] || styles.neutral
      }`}
    >
      {children}
    </span>
  );
}