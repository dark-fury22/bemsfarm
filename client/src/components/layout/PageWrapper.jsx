import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageWrapper({ children, noFooter = false }) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
