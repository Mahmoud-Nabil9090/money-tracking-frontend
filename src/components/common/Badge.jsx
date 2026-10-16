export default function Badge({ children, tone = "neutral" }) {
  const styles = {
    neutral: {
      backgroundColor: "var(--bg-tertiary)",
      color: "var(--text-secondary)",
    },
    blue: {
      backgroundColor: "var(--status-info-bg)",
      color: "var(--status-info)",
    },
    green: {
      backgroundColor: "var(--status-success-bg)",
      color: "var(--status-success)",
    },
    red: {
      backgroundColor: "var(--status-danger-bg)",
      color: "var(--status-danger)",
    },
    yellow: {
      backgroundColor: "var(--status-warning-bg)",
      color: "var(--status-warning)",
    },
  };

  const style = styles[tone] || styles.neutral;

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
      style={style}
    >
      {children}
    </span>
  );
}