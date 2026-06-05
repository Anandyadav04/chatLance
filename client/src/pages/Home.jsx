import React, { useEffect, useRef, useState } from "react"; // Add React and useState
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight, Users, Lock, Zap } from "lucide-react";

// FadeInSection component - fixed with proper imports
const FadeInSection = ({ children }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // Now useState is defined

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white font-sans antialiased">
      {/* Navbar – minimal, transparent, fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-900">ChatLance</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero – asymmetric layout with image */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">
                <Zap className="w-3 h-3" />
                <span>Real‑time messaging</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Chat with your team,<br />
                <span className="text-indigo-600">instantly</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-md">
                No noise, no distractions. Just fast, reliable chat for teams who need to get things done.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Sign in
                </button>
              </div>
              <div className="flex items-center gap-4 pt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Team ready</span>
              </div>
            </div>

            {/* Right image – realistic chat mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl blur-2xl opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format"
                alt="Chat interface preview"
                className="relative rounded-2xl shadow-2xl border border-gray-200 w-full object-cover"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">1,200+ active conversations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid – clean, informative */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Everything you need</h2>
              <p className="text-gray-500 mt-2">No bloat, just the essentials</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Real‑time",
                  desc: "Messages delivered instantly with WebSockets.",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Room based",
                  desc: "Create separate spaces for different topics.",
                },
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: "Secure auth",
                  desc: "JWT authentication, messages are private.",
                },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feat.title}</h3>
                  <p className="text-gray-500 text-sm">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Simple CTA */}
      <FadeInSection>
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-gray-900">Ready to start?</h2>
            <p className="text-gray-500 mt-2 mb-8">Join hundreds of teams using ChatLance every day.</p>
            <button
              onClick={() => navigate("/register")}
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
            >
              Create free account
            </button>
          </div>
        </section>
      </FadeInSection>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <span>© 2024 ChatLance. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition">Terms</a>
            <a href="#" className="hover:text-gray-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;