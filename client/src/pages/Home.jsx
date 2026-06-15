import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  ArrowRight,
  Users,
  Lock,
  Zap,
  Globe,
  Shield,
  Radio,
  Hash,
  Bell,
  Eye,
  CheckCheck,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import heroCollabImg from "../assets/hero_collaboration.png";
import teamRealtimeImg from "../assets/team_realtime.png";

/* ─── Animated counter hook ─── */
const useCountUp = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
};

/* ─── FadeInSection ─── */
const FadeInSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

/* ─── Particle background (light-themed) ─── */
const ParticleField = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.25 + 0.08,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(99, 102, 241, ${p.opacity})`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Live chat mockup (dark card on light page) ─── */
const LiveChatMockup = () => {
  const mockMessages = [
    {
      id: 1,
      user: "Sarah",
      avatar: "S",
      color: "from-violet-500 to-purple-600",
      text: "Hey team! The new design system is looking great 🎨",
      time: "2:34 PM",
      read: true,
    },
    {
      id: 2,
      user: "Alex",
      avatar: "A",
      color: "from-emerald-500 to-teal-600",
      text: "Agreed! I've pushed the component library updates.",
      time: "2:35 PM",
      read: true,
    },
    {
      id: 3,
      user: "Maya",
      avatar: "M",
      color: "from-orange-500 to-rose-600",
      text: "Let's sync on the API integration tomorrow morning?",
      time: "2:36 PM",
      read: false,
    },
  ];

  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const timers = [];
    mockMessages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 800 + i * 1200));
    });
    timers.push(
      setTimeout(() => setShowTyping(true), 800 + mockMessages.length * 1200)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow effects behind the card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-2xl blur-lg" />

      {/* Chat window — keeping dark for contrast */}
      <div className="relative bg-gray-900 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">
                design-team
              </span>
            </div>
            <span className="text-xs text-gray-500">3 online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["S", "A", "M"].map((letter, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-gray-900"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4 min-h-[280px]">
          {mockMessages.map(
            (msg, i) =>
              i < visibleCount && (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${msg.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5`}
                  >
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {msg.user}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5 leading-relaxed">
                      {msg.text}
                    </p>
                    {msg.read && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCheck className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] text-gray-600">Read</span>
                      </div>
                    )}
                  </div>
                </div>
              )
          )}

          {/* Typing indicator */}
          {showTyping && (
            <div className="flex items-center gap-3 animate-slide-up">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                J
              </div>
              <div className="bg-white/5 rounded-2xl rounded-bl-sm px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 italic">
                Jake is typing...
              </span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4 pt-1">
          <div className="flex items-center gap-2 bg-white/5 border border-gray-700 rounded-xl px-4 py-3">
            <input
              type="text"
              placeholder="Message #design-team"
              className="flex-1 bg-transparent text-sm text-gray-400 placeholder-gray-600 outline-none"
              readOnly
            />
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Home Page — White / Light Theme
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Home() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const stats = [
    { label: "Messages Sent", value: 12400, suffix: "+", icon: MessageSquare },
    { label: "Active Rooms", value: 340, suffix: "+", icon: Hash },
    { label: "Online Users", value: 1800, suffix: "+", icon: Users },
    { label: "Uptime", value: 99.9, suffix: "%", decimals: 1, icon: Zap },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Messaging",
      desc: "Messages delivered in milliseconds through WebSocket connections — no refresh, no waiting.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Rooms & DMs",
      desc: "Create topic-based rooms for your team or have private 1-on-1 conversations. Your choice.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      desc: "JWT authentication, bcrypt hashing, Helmet headers, and rate limiting baked in from day one.",
      gradient: "from-red-500 to-rose-600",
    },
    {
      icon: <Radio className="w-6 h-6" />,
      title: "Live Presence",
      desc: "See who's online in real time. Know when teammates are typing before they even send a message.",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: <CheckCheck className="w-6 h-6" />,
      title: "Read Receipts",
      desc: "Double-check marks so you always know your message has been seen. No more guessing.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Scalable Infra",
      desc: "Redis Pub/Sub, Nginx load balancing, and Docker orchestration — built for horizontal scale.",
      gradient: "from-pink-500 to-fuchsia-600",
    },
  ];

  return (
    <div className="bg-white text-gray-900 font-sans antialiased overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              ChatLance
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a
              href="#features"
              className="hover:text-gray-900 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#stats"
              className="hover:text-gray-900 transition-colors duration-200"
            >
              Stats
            </a>
            <a
              href="#how-it-works"
              className="hover:text-gray-900 transition-colors duration-200"
            >
              How It Works
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 px-4 py-2"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-gray-500 hover:text-gray-900"
          >
            {mobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-6 py-4 space-y-3">
            <a
              href="#features"
              className="block text-sm text-gray-500 hover:text-gray-900 py-2"
            >
              Features
            </a>
            <a
              href="#stats"
              className="block text-sm text-gray-500 hover:text-gray-900 py-2"
            >
              Stats
            </a>
            <a
              href="#how-it-works"
              className="block text-sm text-gray-500 hover:text-gray-900 py-2"
            >
              How It Works
            </a>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 text-sm text-center py-2 border border-gray-200 rounded-xl text-gray-600"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex-1 text-sm text-center py-2 bg-indigo-500 rounded-xl text-white font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white">
        <ParticleField />

        {/* Radial gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-200/40 via-purple-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left – Copy */}
            <div className="space-y-8">
              <FadeInSection>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Real-time communication platform</span>
                </div>
              </FadeInSection>

              <FadeInSection delay={100}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                  <span className="text-gray-900">Where teams</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    connect & collaborate
                  </span>
                  <br />
                  <span className="text-gray-900">in real time.</span>
                </h1>
              </FadeInSection>

              <FadeInSection delay={200}>
                <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                  Rooms, direct messages, typing indicators, read receipts, and
                  live presence — all powered by WebSockets. Built for teams
                  that move fast.
                </p>
              </FadeInSection>

              <FadeInSection delay={300}>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Start chatting now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="border border-gray-200 text-gray-600 px-8 py-4 rounded-2xl font-semibold text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                  >
                    Sign in
                  </button>
                </div>
              </FadeInSection>

              <FadeInSection delay={400}>
                <div className="flex items-center gap-6 pt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> End-to-end secure
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Sub-second latency
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Free forever
                  </span>
                </div>
              </FadeInSection>
            </div>

            {/* Right – Live mockup */}
            <FadeInSection delay={300}>
              <LiveChatMockup />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section id="stats" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const counter = useCountUp(
                stat.decimals ? stat.value * 10 : stat.value
              );
              const Icon = stat.icon;
              return (
                <FadeInSection key={idx} delay={idx * 100}>
                  <div
                    ref={counter.ref}
                    className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-indigo-500 mx-auto mb-3" />
                    <div className="text-3xl md:text-4xl font-extrabold text-gray-900">
                      {stat.decimals
                        ? (counter.count / 10).toFixed(stat.decimals)
                        : counter.count.toLocaleString()}
                      <span className="text-indigo-500">{stat.suffix}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-24 relative bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Platform Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Everything your team needs
              </h2>
              <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
                From instant messaging to enterprise-grade infrastructure — built
                for real collaboration at any scale.
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <FadeInSection key={idx} delay={idx * 80}>
                <div className="group relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full">
                  {/* Hover glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`}
                  />
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}
                    >
                      {feat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Up and running in minutes
              </h2>
              <p className="text-gray-500 mt-4 text-lg">
                Three simple steps to start collaborating with your team.
              </p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create an account",
                desc: "Sign up in seconds. No credit card, no gimmicks — just your name, email, and password.",
                icon: <Sparkles className="w-6 h-6" />,
              },
              {
                step: "02",
                title: "Join or create rooms",
                desc: "Spin up topic-based chat rooms for your team or start a private direct message conversation.",
                icon: <Hash className="w-6 h-6" />,
              },
              {
                step: "03",
                title: "Collaborate live",
                desc: "Send messages, see who's typing, get read receipts, and track online presence — all in real time.",
                icon: <Radio className="w-6 h-6" />,
              },
            ].map((item, idx) => (
              <FadeInSection key={idx} delay={idx * 150}>
                <div className="relative text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
                  <div className="text-6xl font-black text-gray-100 absolute top-4 right-6 select-none group-hover:text-indigo-100 transition-colors duration-300">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-indigo-500/20">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Visual Showcase ─── */}
      <section className="py-24 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl blur-2xl opacity-60" />
                <img
                  src={heroCollabImg}
                  alt="Real-time team collaboration"
                  className="relative rounded-2xl shadow-xl border border-gray-100 w-full object-cover"
                />
              </div>
            </FadeInSection>
            <FadeInSection delay={150}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Built for teams</span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  Communication that
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    brings teams closer
                  </span>
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Whether you're brainstorming in a group room or sending a quick DM, ChatLance keeps your conversations organized, real-time, and always in sync across all your devices.
                </p>
                <ul className="space-y-3">
                  {[
                    "Create unlimited rooms for every topic",
                    "Instant 1-on-1 direct messaging",
                    "See who's online and typing in real time",
                    "Read receipts on every message",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <CheckCheck className="w-3 h-3 text-indigo-600" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ─── Tech Stack Showcase ─── */}
      <section className="py-20 relative bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Built with modern technology
              </h2>
              <p className="text-gray-400 mt-3">
                Production-grade stack for real-time communication at scale.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={100}>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "React",
                "Node.js",
                "Socket.IO",
                "MongoDB",
                "Redis",
                "Nginx",
                "Docker",
                "Express",
                "JWT",
                "Prometheus",
                "Grafana",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-5 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all duration-300 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 relative bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/60 via-purple-100/60 to-pink-100/60 rounded-3xl blur-3xl pointer-events-none" />

          <FadeInSection>
            <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100">
              <img
                src={teamRealtimeImg}
                alt="Team collaborating in real time"
                className="w-64 h-64 object-contain mx-auto mb-8 drop-shadow-lg"
              />
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 text-sm mb-6">
                <Bell className="w-3.5 h-3.5" />
                <span>Join the community</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Ready to transform how
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  your team communicates?
                </span>
              </h2>
              <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of teams who have already made the switch to
                faster, smarter, real-time collaboration.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Create free account
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 py-12 mt-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">ChatLance</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                A real-time communication and collaboration platform built for
                modern teams.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100 text-sm text-gray-400">
            <span>© 2025 ChatLance. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Global animation styles ─── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: var(--opacity, 0.2); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); opacity: calc(var(--opacity, 0.2) + 0.1); }
          75% { transform: translateY(-25px) translateX(15px); }
        }
        .animate-float {
          animation: float var(--duration, 20s) ease-in-out infinite;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Home;