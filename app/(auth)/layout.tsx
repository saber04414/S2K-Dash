import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Sidebar />
        <div className="py-16 px-10 w-full h-screen overflow-y-auto">{children}</div>
        <div><Toaster position="bottom-right" reverseOrder={false} /></div>
    </>
  );
}
