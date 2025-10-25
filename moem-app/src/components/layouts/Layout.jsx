import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navigation from './Navigation';


function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navigation />
            
            <main className="flex-grow overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                      <Outlet /> 
                </div>
                {/* <div className="container mx-auto px-4 py-8">
                    {children}
                </div> */}
            </main>

            <Footer />
        </div>
    );
}

export default Layout;