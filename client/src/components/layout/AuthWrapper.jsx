export default function AuthWrapper({ children }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F9FA" }}>
      {children}
    </div>
  );
}
