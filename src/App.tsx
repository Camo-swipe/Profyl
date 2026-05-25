import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Code, 
  CheckCircle, 
  ArrowRight, 
  Zap,
  Layout,
  User as UserIcon,
  LogOut,
  Mail,
  Lock,
  Loader2,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Plus,
  BookOpen,
  DollarSign,
  Sun,
  Moon
} from "lucide-react";

import { User, AuthState, PortfolioData } from "./types";
import LandingPage from "./components/LandingPage";
import Builder from "./components/Builder";
import RecruiterDashboard from "./components/RecruiterDashboard";
import AdminPanel from "./components/AdminPanel";
import TemplatesPreview from "./components/TemplatesPreview";
import FullLogo from "./components/Logo";
import { auth as firebaseAuth, googleProvider } from "./lib/firebase";
import { signInWithPopup } from "firebase/auth";


export default function App() {
  // Auth state management
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null
  });

  // Light/Dark Theme Preference State (v2)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem("profyl_theme") as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem("profyl_theme", theme);
  }, [theme]);

  // Navigation states: 'landing' | 'dashboard' | 'builder' | 'recruiter' | 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'builder' | 'recruiter' | 'admin'>('landing');

  // Auth Dialog parameters
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'forgot' | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<'user' | 'recruiter' | 'admin'>('user');
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Simulated OTP logic for forgot password
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState("");

  // User Dashboard Portfolio states
  const [userPortfolios, setUserPortfolios] = useState<PortfolioData[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Public Shared Portfolio Route state
  const [viewingShared, setViewingShared] = useState(false);
  const [sharedPortfolio, setSharedPortfolio] = useState<PortfolioData | null>(null);
  const [sharedPortfolioLoading, setSharedPortfolioLoading] = useState(false);
  const [sharedPortfolioError, setSharedPortfolioError] = useState("");

  // Simulated Payment gateway Dialog
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'plan' | 'payment_method' | 'card' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<'student_pro' | 'premium' | 'lifetime'>('premium');
  const [paymentError, setPaymentError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [creditCardNum, setCreditCardNum] = useState("4242 4242 4242 4242");
  const [creditCardExpiry, setCreditCardExpiry] = useState("12/28");
  const [creditCardCvc, setCreditCardCvc] = useState("123");

  // Load cookies or token on mount, while preserving shared portfolio routes
  useEffect(() => {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/p\/([a-zA-Z0-9-]+)/) || pathname.match(/^\/portfolio\/([a-zA-Z0-9-]+)/);
    const urlParams = new URLSearchParams(window.location.search);
    const slugQuery = urlParams.get("slug") || urlParams.get("p");
    const isSharedRoute = !!(match || slugQuery);

    const savedToken = localStorage.getItem("profyl_token");
    const savedUser = localStorage.getItem("profyl_user");
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setAuth({
          user: parsedUser,
          token: savedToken
        });
        // Direct to dashboard only if they aren't loading a dedicated shared portfolio link
        if (!isSharedRoute) {
          setCurrentView('dashboard');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Shared Portfolio Route Resolver Trigger Effect
  useEffect(() => {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/p\/([a-zA-Z0-9-]+)/) || pathname.match(/^\/portfolio\/([a-zA-Z0-9-]+)/);
    const urlParams = new URLSearchParams(window.location.search);
    const slugQuery = urlParams.get("slug") || urlParams.get("p");
    const slugToLoad = (match ? match[1] : null) || slugQuery;

    if (slugToLoad) {
      setViewingShared(true);
      setSharedPortfolioLoading(true);
      setSharedPortfolioError("");
      
      fetch(`/api/portfolios/slug/${slugToLoad}`)
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "This portfolio could not be retrieved, is offline, or under moderate review.");
          }
          return res.json();
        })
        .then((data) => {
          setSharedPortfolio(data);
        })
        .catch((err: any) => {
          setSharedPortfolioError(err.message || "Failed to fetch visual portfolio.");
        })
        .finally(() => {
          setSharedPortfolioLoading(false);
        });
    }
  }, []);

  // Fetch candidate pages lists for logged-in creator
  const loadPortfolios = async (userId: string) => {
    setDashboardLoading(true);
    try {
      const res = await fetch("/api/portfolios", {
        headers: { "Authorization": `Bearer mock-token-${userId}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUserPortfolios(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user) {
      loadPortfolios(auth.user.id);
    }
  }, [auth.user]);

  // Auth action handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authModal === 'register') {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authEmail,
            password: authPassword,
            name: authName,
            role: authRole
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setAuthError(data.error || "Failed to register user account.");
          return;
        }
        
        localStorage.setItem("profyl_token", data.token);
        localStorage.setItem("profyl_user", JSON.stringify(data.user));
        setAuth({ user: data.user, token: data.token });
        setAuthModal(null);
        setCurrentView(data.user.role === 'recruiter' ? 'recruiter' : 'dashboard');
        
      } else if (authModal === 'login') {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authEmail,
            password: authPassword
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setAuthError(data.error || "Credentials invalid.");
          return;
        }

        localStorage.setItem("profyl_token", data.token);
        localStorage.setItem("profyl_user", JSON.stringify(data.user));
        setAuth({ user: data.user, token: data.token });
        setAuthModal(null);
        setCurrentView(data.user.role === 'recruiter' ? 'recruiter' : 'dashboard');
      }
    } catch (err) {
      setAuthError("Failed to initiate connection to Express server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Failed to verify email.");
        return;
      }
      setOtpSent(true);
      alert("🔐 [OTP Security System] Generated recovery key: '123456'. Simulated on console.");
    } catch (err) {
      setAuthError("Email verification failure.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOtpVerify = () => {
    if (otpVal === "123456") {
      alert("Password verified! Toggling bypass registration session.");
      // Auto register or login default
      setAuthModal('login');
      setOtpSent(false);
      setOtpVal("");
    } else {
      setAuthError("Incorrect key code.");
    }
  };

  const handleGoogleAuthSubmit = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const googleUser = result.user;
      
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.displayName,
          uid: googleUser.uid,
          role: authRole
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Failed to sync Google Account credentials.");
        return;
      }

      localStorage.setItem("profyl_token", data.token);
      localStorage.setItem("profyl_user", JSON.stringify(data.user));
      setAuth({ user: data.user, token: data.token });
      setAuthModal(null);
      setCurrentView(data.user.role === 'recruiter' ? 'recruiter' : 'dashboard');
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setAuthError(err.message || "Failed to authenticate session with Google.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("profyl_token");
    localStorage.removeItem("profyl_user");
    setAuth({ user: null, token: null });
    setUserPortfolios([]);
    setCurrentView('landing');
  };

  // Upgrades plan via simulated checkout gateway
  const handleUpgradePaymentSimulated = async () => {
    if (!auth.user) return;
    try {
      const res = await fetch("/api/subs/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer mock-token-${auth.user.id}`
        },
        body: JSON.stringify({ plan: selectedPlan })
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...auth.user, plan: selectedPlan };
        localStorage.setItem("profyl_user", JSON.stringify(updated));
        setAuth(prev => ({ ...prev, user: updated }));
        setCheckoutStep('success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic script loader for Razorpay Checkout
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradeWithRazorpay = async () => {
    if (!auth.user) {
      setPaymentError("You must be logged in to buy a subscription.");
      return;
    }
    setPaymentLoading(true);
    setPaymentError("");

    try {
      // 1. Load Razorpay script on demand
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay payment gateway script. Please verify your internet connection.");
      }

      // 2. Fetch config
      const configRes = await fetch("/api/payments/razorpay/config");
      const configData = await configRes.json();
      const rzpKeyId = configData.keyId;

      // 3. Initiate order from backend (proxied securely)
      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer mock-token-${auth.user.id}`
        },
        body: JSON.stringify({ plan: selectedPlan })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initiate Razorpay transaction.");
      }

      const { orderId, amount, currency, isMock } = orderData;

      // 4. Configure Razorpay Interactive Options with UPI and Cards
      const options = {
        key: rzpKeyId,
        amount,
        currency,
        name: "Profyl SaaS",
        description: `Upgrade subscription to ${selectedPlan.replace('_', ' ').toUpperCase()}`,
        order_id: isMock ? undefined : orderId, // Only pass order_id if non-mock keys are set
        handler: async (response: any) => {
          setPaymentLoading(true);
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer mock-token-${auth.user.id}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
                razorpay_order_id: response.razorpay_order_id || orderId,
                razorpay_signature: response.razorpay_signature || "mock_signature_field",
                plan: selectedPlan,
                isMock
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const updated = { ...auth.user, plan: selectedPlan };
              localStorage.setItem("profyl_user", JSON.stringify(updated));
              setAuth(prev => ({ ...prev, user: updated }));
              setCheckoutStep('success');
            } else {
              throw new Error(verifyData.error || "Verification failed");
            }
          } catch (verifyErr: any) {
            console.error(verifyErr);
            setPaymentError(`Payment verification failed: ${verifyErr.message}`);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: auth.user.name,
          email: auth.user.email,
        },
        notes: {
          userId: auth.user.id,
          plan: selectedPlan,
        },
        theme: {
          color: "#4f46e5", // Theme Indigo matched
        },
      };

      if (isMock) {
        // Mock loading simulation for seamless visual feedback in preview
        setTimeout(() => {
          options.handler({
            razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
            razorpay_order_id: orderId,
            razorpay_signature: "mock_signature_completed"
          });
        }, 1200);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (failedResponse: any) {
          setPaymentError(`Payment failed: ${failedResponse.error.description}`);
        });
        rzp.open();
        setPaymentLoading(false);
      }
    } catch (err: any) {
      console.error("Razorpay workflow failed: ", err);
      setPaymentError(err.message || "Failed to trigger Razorpay checkout.");
      setPaymentLoading(false);
    }
  };

  if (viewingShared) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none scrollbar-none">
        {/* Floating return trigger */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => {
              window.history.pushState({}, "", "/");
              setViewingShared(false);
              setSharedPortfolio(null);
              const savedUser = localStorage.getItem("profyl_user");
              if (savedUser) {
                setCurrentView('dashboard');
              } else {
                setCurrentView('landing');
              }
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg font-bold text-xs uppercase transition flex items-center gap-1 cursor-pointer"
          >
            ← Back to Profyl
          </button>
        </div>

        {sharedPortfolioLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-950">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p className="text-sm font-semibold">Loading Custom Visual Portfolio Showcase...</p>
          </div>
        ) : sharedPortfolioError ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center bg-slate-950">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-extrabold text-white text-lg font-mono">PORTFOLIO OFFLINE</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm">{sharedPortfolioError}</p>
            <button
              onClick={() => {
                window.history.pushState({}, "", "/");
                setViewingShared(false);
                setSharedPortfolio(null);
                setCurrentView('landing');
              }}
              className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-705 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Go to Landing Page
            </button>
          </div>
        ) : sharedPortfolio ? (
          <div className="flex-1 min-h-screen w-full relative">
            <TemplatesPreview data={sharedPortfolio} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none scrollbar-none transition-colors duration-150 ${theme === 'light' ? 'theme-light' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* Platform Modern Header Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('landing')}
            className="cursor-pointer hover:opacity-85 transition"
          >
            <FullLogo size={28} />
          </div>

          {/* Quick links depending on logins */}
          {auth.user && (
            <div className="hidden md:flex gap-4 text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
              {auth.user.role !== 'recruiter' && (
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`duration-100 hover:text-white ${currentView === 'dashboard' ? 'text-indigo-400 border-b border-indigo-400 pb-0.5' : ''}`}
                >
                  My Portfolios
                </button>
              )}

              {auth.user?.email === 'kattikoustubh22@gmail.com' && (
                <button 
                  onClick={() => setCurrentView('admin')}
                  className={`duration-100 hover:text-white ${currentView === 'admin' ? 'text-indigo-400 border-b border-indigo-400 pb-0.5' : ''}`}
                >
                  Admin Panels
                </button>
              )}
            </div>
          )}
        </div>

        {/* Access controls profiles tabs */}
        <div className="flex items-center gap-2">
          {/* Light/Dark mode Toggle switch button */}
          <button
            type="button"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="p-2 border border-slate-800 hover:border-slate-705 bg-slate-950/20 hover:bg-slate-900/50 rounded-lg text-slate-400 hover:text-white transition duration-150 mr-2 flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {auth.user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white">{auth.user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono text-indigo-400 uppercase">{auth.user.plan} account</p>
              </div>

              {auth.user.plan === 'free' && auth.user.role !== 'recruiter' && (
                <button 
                  onClick={() => {
                    setCheckoutStep('plan');
                    setCheckoutModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:scale-105 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider transition"
                >
                  Upgrade Pro
                </button>
              )}

              <button 
                onClick={handleLogOut}
                className="p-2 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                title="Log out of app"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setAuthEmail("");
                  setAuthPassword("");
                  setAuthError("");
                  setAuthModal('login');
                }}
                className="px-4 py-2 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 duration-150 text-xs font-bold"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setAuthEmail("");
                  setAuthPassword("");
                  setAuthName("");
                  setAuthError("");
                  setAuthModal('register');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg duration-150 text-xs font-black uppercase tracking-wider shadow"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Container Views renders */}
      <main className="flex-1 overflow-y-auto">

        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage 
            onStartBuilding={() => {
              if (auth.user) {
                setCurrentView('dashboard');
              } else {
                setAuthModal('register');
              }
            }}
            onLoginClick={() => setAuthModal('login')}
          />
        )}

        {/* VIEW 2: VISUAL PORTFOLIO BUILDER */}
        {currentView === 'builder' && (
          <Builder 
            user={auth.user} 
            onBackToDashboard={() => {
              if (auth.user) {
                loadPortfolios(auth.user.id);
                setCurrentView('dashboard');
              }
            }}
            onUpgradePrompt={() => {
              setCheckoutStep('plan');
              setCheckoutModalOpen(true);
            }}
          />
        )}

        {/* VIEW 3: USER CENTRAL DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white">Your Deployment Dashboard</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Manage, edit, publish, or view telemetry stats of your developer showcase.</p>
              </div>

              {/* Action triggers */}
              <button 
                onClick={() => setCurrentView('builder')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Open Theme Builder
              </button>
            </div>

            {/* List user generated portfolio cards */}
            {dashboardLoading ? (
              <div className="text-center py-12 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
                <p className="text-xs">Loading candidate pages directories...</p>
              </div>
            ) : userPortfolios.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-800 rounded-3xl bg-slate-900/40 text-center space-y-4">
                <Layers className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white">No active candidate portfolio pages registered.</h4>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">Click 'Open Theme Builder' above to initialize your first automated Gemini-drafted layout.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userPortfolios.map((port) => (
                  <div 
                    key={port.id} 
                    className="bg-slate-900 border border-slate-805 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow hover:border-slate-700 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-white text-base">{port.title}</h4>
                          <span className="text-[10px] font-mono bg-indigo-950/85 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/30 uppercase">
                            Style: {port.templateId}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${port.isPublished ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                          {port.isPublished ? "Online" : "suspended"}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg text-xs leading-none font-mono flex items-center justify-between text-slate-400">
                        <span>Slug url:</span>
                        <a 
                          href={`/p/${port.slug}`}
                          target="_blank"
                          className="hover:text-indigo-400 underline flex items-center gap-1"
                        >
                          /{port.slug} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex justify-end gap-2">
                      <button 
                        onClick={() => setCurrentView('builder')}
                        className="px-4 py-2 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        Edit Layout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: RECRUITER MODE PORTAL */}
        {currentView === 'recruiter' && (
          <div className="max-w-5xl mx-auto px-6 py-10">
            <RecruiterDashboard />
          </div>
        )}

        {/* VIEW 5: SECURITY CONTROL PANEL */}
        {currentView === 'admin' && (
          <div className="max-w-5xl mx-auto px-6 py-10">
            {auth.user?.email === "kattikoustubh22@gmail.com" ? (
              <AdminPanel user={auth.user} />
            ) : (
              <div className="border border-red-900 bg-red-950/20 p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
                <ShieldCheck className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-black tracking-widest uppercase text-white">Strict Access Denied</h3>
                <p className="text-slate-400 text-xs">This panel is strictly restricted. Only Kattikoustubh22@gmail.com has cryptographic access.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER SYSTEM */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-600 shrink-0">
        <p>Profyl — Developed by K² Technologies under the owner Koustubh Katti. {/* Version: v2 */}</p>
      </footer>

      {/* AUTH MODAL DIALOGS BOXES */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm p-6 rounded-2xl shadow-2xl space-y-4 relative">
            
            <button 
              onClick={() => setAuthModal(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Heading depending on status */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white tracking-widest uppercase">
                {authModal === 'login' ? 'Login Portal' : authModal === 'register' ? 'Register SaaS Profile' : 'Reset Credentials'}
              </h3>
              <p className="text-slate-400 text-xs">Access modern candidate index databases.</p>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center rounded">
                {authError}
              </div>
            )}

            {/* OTP Form bypass indicator */}
            {otpSent ? (
              <div className="space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed text-center">We simulated sending an OTP recovery key to your inbox. Please enter the recovery key <strong>123456</strong> below:</p>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold tracking-wider font-mono uppercase text-[10px]">OTP Recovery Key</label>
                  <input 
                    type="text" 
                    value={otpVal}
                    placeholder="e.g. 123456"
                    onChange={(e) => setOtpVal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-center px-4 py-2.5 rounded focus:border-indigo-600 outline-none font-mono"
                  />
                </div>
                <button 
                  onClick={handleOtpVerify}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase transition"
                >
                  Confirm Key
                </button>
              </div>
            ) : (
              <form onSubmit={authModal === 'forgot' ? handleForgotPasswordSubmit : handleAuthSubmit} className="space-y-3 text-xs">
                
                {authModal === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-medium">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 text-slate-250 rounded focus:border-indigo-600 outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 text-slate-250 rounded focus:border-indigo-600 outline-none"
                  />
                </div>

                {authModal !== 'forgot' && (
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-medium">Password Secure key</label>
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 text-slate-250 rounded focus:border-indigo-600 outline-none"
                    />
                  </div>
                )}



                <button 
                  type="submit" 
                  disabled={authLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition pr-2"
                >
                  {authLoading ? "Synchronizing..." : authModal === 'login' ? 'Login Active Hub' : authModal === 'register' ? 'Register Free Accounts' : 'Request Password Reset'}
                </button>

                {authModal !== 'forgot' && (
                  <>
                    <div className="relative my-4 flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-850"></div>
                      <span className="flex-shrink mx-3 text-slate-500 font-mono text-[9px] uppercase">or continue with</span>
                      <div className="flex-grow border-t border-slate-850"></div>
                    </div>

                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={handleGoogleAuthSubmit}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 disabled:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition duration-150"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      {authModal === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                    </button>
                  </>
                )}

                {/* Sub dialog bypass selectors */}
                <div className="pt-2 text-center text-[10px] text-slate-400 space-y-2 border-t border-slate-850">
                  {authModal === 'login' ? (
                    <div className="flex justify-between">
                      <button type="button" onClick={() => setAuthModal('register')} className="hover:text-indigo-400">Join SaaS Plan</button>
                      <button type="button" onClick={() => setAuthModal('forgot')} className="hover:text-indigo-400">Forgot Password OTP?</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setAuthModal('login')} className="hover:text-indigo-400 text-center">Go back to Login</button>
                  )}
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* SAAS MONETIZATION SIMULATED CHECKOUT MODAL WINDOWS */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl relative space-y-6">
            
            <button 
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* STEP 1: PLAN COMPARISON OPTIONS */}
            {checkoutStep === 'plan' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded">SaaS Platform Checkout</span>
                  <h3 className="text-lg font-black text-white">Unlock Professional Tier</h3>
                  <p className="text-slate-400 text-xs">Select your preferred high-performance plan below</p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: 'student_pro', name: 'Student Pro', price: '₹99/mo', desc: 'Up to 3 Portfolios, custom domain & premium themes' },
                    { id: 'premium', name: 'Premium', price: '₹299/mo', desc: 'Unlimited portfolios, Recharts telemetry & CV PDF export' },
                    { id: 'lifetime', name: 'Lifetime', price: '₹1499 run', desc: 'Host forever, priority AI prompt keys & all updates' }
                  ].map((p) => {
                    const active = selectedPlan === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlan(p.id as any)}
                        className={`w-full text-left p-3.5 rounded-xl border flex justify-between items-center transition ${active ? "bg-indigo-600/25 border-indigo-500 text-white" : "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-800"}`}
                      >
                        <div className="space-y-1 text-xs">
                          <p className="font-extrabold text-sm">{p.name}</p>
                          <p className="text-slate-400 text-[10px] font-normal leading-relaxed">{p.desc}</p>
                        </div>
                        <span className="text-xs font-black text-indigo-400 shrink-0 font-mono ml-4">{p.price}</span>
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setCheckoutStep('payment_method')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shrink-0"
                >
                  Proceed with {selectedPlan === 'student_pro' ? 'Student Pro' : selectedPlan === 'lifetime' ? 'Lifetime' : 'Premium'}
                </button>
                
                <p className="text-[10px] text-center text-slate-500">For Indian Students, Student Pro @ ₹99/month works exceptionally well.</p>
              </div>
            )}

            {/* STEP 2: CHOOSE PAYMENT INTERFACE METHOD */}
            {checkoutStep === 'payment_method' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded">Payment Method Selection</span>
                  <h3 className="text-base font-black text-white">Choose Checkout Gateway</h3>
                  <p className="text-slate-400 text-xs text-center">Secure transactions supported through multiple gateways</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">Selected Subscription</p>
                    <p className="font-extrabold text-sm text-white capitalize">{selectedPlan.replace('_', ' ')}</p>
                  </div>
                  <span className="text-sm font-black text-indigo-400 font-mono">
                    {selectedPlan === 'student_pro' ? '₹99/mo' : selectedPlan === 'lifetime' ? '₹1499' : '₹299/mo'}
                  </span>
                </div>

                {paymentError && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-[11px] text-center font-medium">
                    {paymentError}
                  </div>
                )}

                <div className="space-y-3">
                  {/* Option 1: Razorpay UPI (Recommended) */}
                  <button
                    type="button"
                    disabled={paymentLoading}
                    onClick={handleUpgradeWithRazorpay}
                    className="w-full p-4 bg-gradient-to-r from-blue-700/10 to-indigo-700/10 hover:from-blue-700/15 hover:to-indigo-700/15 border border-indigo-500 text-left rounded-xl transition relative group overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-white">
                          <span className="font-extrabold text-sm">UPI, Netbanking & Cards (Razorpay)</span>
                          <span className="text-[9px] bg-indigo-500/25 text-indigo-300 px-1.5 py-0.2 rounded uppercase font-bold tracking-wide font-mono">India</span>
                        </div>
                        <p className="text-slate-400 text-[10px] leading-relaxed">Pay with Google Pay, PhonePe, Paytm, BHIM, or Indian Debit/Credit cards.</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-indigo-500 bg-indigo-600 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Stripe Sandbox (Card simulation) */}
                  <button
                    type="button"
                    disabled={paymentLoading}
                    onClick={() => setCheckoutStep('card')}
                    className="w-full p-4 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-left rounded-xl transition animate-fadeIn"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm text-slate-200 font-bold">International Credit Card (Stripe)</p>
                        <p className="text-slate-500 text-[10px] leading-relaxed">Direct standard global debit or credit card simulated system entry.</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-slate-800 shrink-0"></div>
                    </div>
                  </button>
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    disabled={paymentLoading}
                    onClick={() => setCheckoutStep('plan')}
                    className="flex-1 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs disabled:opacity-50 transition"
                  >
                    Back to Plans
                  </button>
                  {paymentLoading && (
                    <div className="flex-1 flex items-center justify-center gap-2 bg-indigo-600/10 text-indigo-400 text-xs font-bold rounded-xl border border-indigo-500/20">
                      <svg className="animate-spin h-3.5 w-3.5 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading UPI...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: STRIPIST SIMULATED INTERACTIVE PAY CREDIT FORM */}
            {checkoutStep === 'card' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <DollarSign className="w-5 h-5 text-indigo-400" /> Stripe Secure Checkout
                  </h3>
                  <p className="text-slate-400 text-xs">Simulated credentials values mapping.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">Simulated Card Token Number</label>
                    <input 
                      type="text" 
                      value={creditCardNum}
                      onChange={(e) => setCreditCardNum(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded font-mono outline-none text-center"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">Expiration</label>
                      <input 
                        type="text" 
                        value={creditCardExpiry}
                        onChange={(e) => setCreditCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded font-mono text-center outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">Secure CVC</label>
                      <input 
                        type="text" 
                        value={creditCardCvc}
                        onChange={(e) => setCreditCardCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded font-mono text-center outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setCheckoutStep('plan')}
                    className="flex-1 py-3 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleUpgradePaymentSimulated}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition"
                  >
                    Complete Pay
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONGRATULATIONS SUCCESS INDICATOR */}
            {checkoutStep === 'success' && (
              <div className="text-center space-y-4 py-4 animate-fadeIn">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-white">Payment Succeeded!</h3>
                  <p className="text-slate-400 text-xs text-center">Your account is successfully upgraded to the <strong className="text-indigo-400 capitalize">{selectedPlan.replace('_', ' ')}</strong> subscription. Access customized layouts, telemetry, and advanced properties.</p>
                </div>
                <button 
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase transition"
                >
                  Launch Premium Workspace
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
