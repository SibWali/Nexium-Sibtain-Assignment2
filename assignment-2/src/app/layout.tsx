import './globals.css';
export const metadata = { title:'Blog Summariser' };

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
