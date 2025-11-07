import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navigation from './Navigation';


function Layout({ children }) {
    const location = useLocation();
    const isProjectManagePage = location.pathname.includes('/projects/') && location.pathname.includes('/manage');
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navigation />
            
            <main className={isProjectManagePage ? "flex-grow overflow-hidden" : "flex-grow overflow-y-auto"}>
                {isProjectManagePage ? (
                    <Outlet />
                ) : (
                    <div className="container mx-auto px-4 py-8">
                        <Outlet /> 
                    </div>
                )}
            </main>

            {!isProjectManagePage && <Footer />}
        </div>
    );
}

export default Layout;