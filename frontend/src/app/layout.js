import { Poppins } from 'next/font/google';
import "@/app/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Configure your font
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
