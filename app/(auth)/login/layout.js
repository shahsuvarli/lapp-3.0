import "../../globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#e0dbd4]">{children}</body>
    </html>
  );
}
