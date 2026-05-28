import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [, setIsDark] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });
    const [isMobile, setIsMobile] = useState(false);
    const [forceDesktop, setForceDesktop] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(true);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleGetStarted = () => {
        if (isMobile && !forceDesktop) {
            const modal = document.getElementById('mobile-warning-modal');
            if (modal) modal.style.display = 'flex';
            return;
        }
        onGetStarted();
    };

    const handleForceDesktop = () => {
        setForceDesktop(true);
        const modal = document.getElementById('mobile-warning-modal');
        if (modal) modal.style.display = 'none';
        onGetStarted();
    };

    const handleCloseModal = () => {
        const modal = document.getElementById('mobile-warning-modal');
        if (modal) modal.style.display = 'none';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-y-auto">
            {/* Mobile Warning Banner */}
            {isMobile && !forceDesktop && bannerVisible && (
                <div id="mobile-warning-banner" className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white px-3 py-2 text-center shadow-lg">
                    <div className="container mx-auto px-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-xs font-medium">
                                    ⚠️ Mobile View: Some features may not work optimally
                                </span>
                            </div>
                            <button
                                onClick={() => setBannerVisible(false)}
                                className="text-black dark:text-white hover:opacity-70"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm z-40 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${
                isMobile && !forceDesktop && bannerVisible ? 'mt-8' : 'mt-0'
            }`}>
                <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center justify-between gap-2">
                        {/* Logo */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">SQL Playground</span>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-6">
                            <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Features</a>
                            <a href="#faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">FAQ</a>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <ThemeToggle />
                            <a
                                href="https://github.com/mohankumaronly/sql-playground"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                                aria-label="GitHub"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.099 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <button
                                onClick={handleGetStarted}
                                className="px-2.5 sm:px-4 py-1 sm:py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all transform hover:scale-105 shadow-md whitespace-nowrap text-xs sm:text-sm"
                            >
                                Go To App 👉
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                                aria-label="Menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col space-y-2">
                                <a
                                    href="#features"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition py-1.5 px-2"
                                >
                                    Features
                                </a>
                                <a
                                    href="#faq"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition py-1.5 px-2"
                                >
                                    FAQ
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Warning Modal */}
            <div className="fixed inset-0 bg-black/70 z-50 items-center justify-center p-4 hidden" id="mobile-warning-modal">
                <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Desktop Recommended
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            SQL Playground is optimized for desktop use. The full features including real-time diagram visualization and drag-and-drop functionality work best on larger screens.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                📺 Minimum screen width: <strong>768px</strong>
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                💻 Recommended: Desktop or Laptop
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleForceDesktop}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                            >
                                Continue Anyway (Desktop Mode)
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition"
                            >
                                Stay on Landing Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className={`pt-32 pb-20 px-4 ${isMobile && !forceDesktop && bannerVisible ? 'mt-16' : 'mt-10'}`}>
                <div className="container mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Draw Database Diagrams, Painlessly 😎
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                        Write SQL,
                        <span className="text-blue-600 dark:text-blue-400">
                            {' '}See Diagrams Instantly
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        A free, simple tool to draw database diagrams by just writing SQL code. Designed for developers and data analysts.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Create your diagram →
                        </button>
                        <a
                            href="#demo"
                            className="px-8 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all"
                        >
                            Watch Demo
                        </a>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Create, visualize, and export your database schemas
                    </p>
                </div>
            </section>

            {/* Demo Video Section */}
            <section id="demo" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            See how it works 🎥
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Write SQL on the left, visualize your database on the right
                        </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
                        <video
                            className="w-full h-full object-contain"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                        >
                            <source src="/demo.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything you need to design databases 🚀
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Write SQL, get visual diagrams instantly
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Write SQL, get diagrams</h3>
                            <p className="text-gray-600 dark:text-gray-400">You type SQL and an ER diagram appears. Real-time visualization as you code.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Foreign key visualization</h3>
                            <p className="text-gray-600 dark:text-gray-400">Automatic relationship detection with animated connection lines.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Export SQL & Documentation</h3>
                            <p className="text-gray-600 dark:text-gray-400">Generate SQL statements and Markdown documentation with one click.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dark mode support</h3>
                            <p className="text-gray-600 dark:text-gray-400">Easy on the eyes with light and dark theme support.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Drag & drop canvas</h3>
                            <p className="text-gray-600 dark:text-gray-400">Freely position tables anywhere on the canvas.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Auto-save your work</h3>
                            <p className="text-gray-600 dark:text-gray-400">Your SQL code is automatically saved in local storage.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is SQL Playground free?</h3>
                            <p className="text-gray-600 dark:text-gray-400">Absolutely! The app is completely free. No credit card required.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What SQL syntax do you support?</h3>
                            <p className="text-gray-600 dark:text-gray-400">We support MySQL syntax including CREATE TABLE, PRIMARY KEY, FOREIGN KEY, NOT NULL, and UNIQUE constraints.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I export my diagrams?</h3>
                            <p className="text-gray-600 dark:text-gray-400">Yes! You can export your schema as SQL file, Markdown documentation, or JSON format.</p>
                        </div>

                        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is my data saved?</h3>
                            <p className="text-gray-600 dark:text-gray-400">Your SQL code is automatically saved in your browser's local storage.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-900 dark:bg-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-gray-900 mb-4">
                        Ready to design your database?
                    </h2>
                    <p className="text-xl text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
                        Start visualizing your database schemas in seconds
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="px-8 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Create your diagram →
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        <span className="font-bold text-gray-900 dark:text-white">SQL Playground</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <a
                            href="https://github.com/mohankumaronly/sql-playground"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                        >
                            GitHub
                        </a>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <a href="#features" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">Features</a>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <a href="#faq" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">FAQ</a>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        © 2026 SQL Playground - Built with ❤️ for developers and data analysts
                    </p>
                </div>
            </footer>
        </div>
    );
};