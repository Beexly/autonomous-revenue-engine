export const metadata = {
  title: "qi-check — Viewport Hold",
  description: "Score a draft for first-screen density and qualified-impression fitness. Does not write the post."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0e0e0e", color: "#e8e4d9", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
