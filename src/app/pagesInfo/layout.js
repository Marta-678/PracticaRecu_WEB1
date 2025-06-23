import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import "@/styles/pages.css"

export default function PageLayout({ children }) {
    return (
        <div className="page-layout">
            <Header tittle="Bildy" />
            <div className="layout-content">
                <Sidebar />
                <main className="main-content">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
