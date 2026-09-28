import "./globals.css";
export const metadata = { title: "AMU Hub", description: "AMU students. One place." };
export default function RootLayout({children}:{children:React.ReactNode}){ return <html lang="en"><body>{children}</body></html> }
