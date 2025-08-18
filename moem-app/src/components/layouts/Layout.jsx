import Footer from './footer';
import Navigation from './Navigation';

function Layout({ children }) {
    return (
        // flex flex-col: flex column layout
        // min-h-screen: viewport height 100%
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navigation />
            
            <main className="flex-grow overflow-y-auto">
                {/* container: max-width for different breakpoints
                  mx-auto: center the container
                  px-4: horizontal padding for mobile
                  py-8: vertical padding
                */}
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Layout;