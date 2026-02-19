import React, { useState, useMemo, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Settings,
  Droplets,
  ShieldCheck,
  Truck,
  Menu,
  X,
  ChevronRight,
  User,
  Wrench,
  Sparkles,
  BrainCircuit,
  MessageSquare,
  Copy,
  Loader2,
  RefreshCcw,
  Award
} from 'lucide-react';

// --- Gemini API Configuration ---
const apiKey = ""; // You can provide a key manually if you deploy this

const callGemini = async (prompt, systemInstruction = "") => {
  if (!apiKey) {
    return "The AI system is running in demo mode without an API key provided. Please contact the team directly for immediate assistance.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };

  const maxRetries = 5;
  let delay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

// --- Data Models ---

const TEAM_MEMBERS = [
  {
    name: "Soju Panayil",
    role: "Operations Management",
    description: "Process logistics, client relationship management, and digital engagement.",
    icon: <User className="w-6 h-6 text-blue-800" />
  },
  {
    name: "Abdul Kabeer",
    role: "Management / Technical Sales",
    description: "Technical specifications, managerial oversight, and field service coordination.",
    icon: <User className="w-6 h-6 text-blue-800" />
  }
];

const PRODUCT_CATEGORIES = [
  "All Products",
  "Hydraulic Hoses",
  "Fittings & Adapters",
  "Industrial Hoses",
  "Stainless Steel Bellows",
  "Quick Release Couplings"
];

const CATALOG_ITEMS = [
  {
    id: 1,
    name: "6-Wire Spiral Hydraulic Hose",
    category: "Hydraulic Hoses",
    spec: "1/4\" to 2\" ID",
    pressure: "High Pressure (6000+ PSI)",
    description: "Extreme duty hose for rig operations and heavy excavators. EN 10204 3.1 Certified.",
    features: ["6-wire reinforcement", "UV Resistant", "Abrasion Resistant"]
  },
  {
    id: 2,
    name: "Stainless Steel 316 Fitting",
    category: "Fittings & Adapters",
    spec: "JIC / BSP / NPT",
    pressure: "Corrosion Resistant",
    description: "Precision-engineered SS316 adapters for oilfield and chemical processing.",
    features: ["Metallurgical Compliance", "Custom Fabrication", "Leak-free Seal"]
  },
  {
    id: 3,
    name: "Industrial Suction Hose",
    category: "Industrial Hoses",
    spec: "up to 16\" ID",
    pressure: "Vacuum Rated",
    description: "Oil & Water resistant hoses for construction dewatering and fuel bunkering.",
    features: ["Heavy Duty", "Reinforced Helix", "Flexible"]
  },
  {
    id: 4,
    name: "SS Flexible Bellows",
    category: "Stainless Steel Bellows",
    spec: "Custom Lengths",
    pressure: "High Temp Exhausts",
    description: "Flexible joints for marine engines designed to withstand thermal expansion.",
    features: ["Multi-ply construction", "Vibration damping", "Thermal stability"]
  },
  {
    id: 5,
    name: "ISO-B Quick Release Coupling",
    category: "Quick Release Couplings",
    spec: "1/4\" to 1\" sizes",
    pressure: "Rapid Connection",
    description: "Leak-free couplings for industrial pumping and mobile fluid transfer.",
    features: ["Poppet Valve", "Zinc Plated Steel", "Safety locking"]
  },
  {
    id: 6,
    name: "High-Pressure Water Hose",
    category: "Industrial Hoses",
    spec: "2-wire braid",
    pressure: "Medium Pressure",
    description: "Standard industrial grade hose for high-pressure washing and fluid delivery.",
    features: ["Flexible", "Lightweight", "Durable outer cover"]
  }
];

// --- Sub-components for AI Features ---

const AIChatAdvisor = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");

    const systemPrompt = "You are a senior Hydraulic Systems Engineer at Smart Fluid Hydraulic Trading LLC in Dubai. Provide concise, professional, and technically accurate advice. Emphasize our 24/7 mobile van service in Ras Al Khor.";

    try {
      const result = await callGemini(input, systemPrompt);
      setResponse(result);
    } catch (err) {
      setError("Technical advisor is temporarily offline. Please call our 24/7 support line.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-800 p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BrainCircuit size={28} />
            <div>
              <h3 className="font-bold text-lg leading-none">✨ AI Technical Advisor</h3>
              <p className="text-blue-200 text-xs mt-1 uppercase tracking-wider">Expert Fluid Power Support</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-50">
          {!response && !loading && !error && (
            <div className="text-center py-8">
              <Sparkles className="mx-auto text-blue-500 mb-4" size={40} />
              <p className="text-gray-600 font-medium">Ask about pressure ratings, hose failure causes, or metallurgy standards.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="animate-spin text-blue-800 mb-2" size={32} />
              <p className="text-gray-500 text-sm italic">Analyzing technical data...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-sm flex items-start space-x-3">
              <Phone size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {response && (
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. What causes high-pressure hose blisters?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              className="flex-grow px-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <button
              onClick={handleAsk}
              disabled={loading || !input.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors shadow-lg shadow-red-600/20"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmartQuoteDrafter = ({ product, isOpen, onClose }) => {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && product) {
      generateDraft();
    }
  }, [isOpen, product]);

  const generateDraft = async () => {
    setLoading(true);
    const prompt = `Draft a professional business inquiry email for ${product.name}. Request bulk pricing and EN 10204 3.1 certification.`;

    try {
      const result = await callGemini(prompt);
      setDraft(result);
    } catch (err) {
      setDraft("Failed to generate draft. Please contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    const original = draft;
    setDraft("COPIED TO CLIPBOARD!\n\n" + draft);
    setTimeout(() => setDraft(original), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
          <div className="flex items-center space-x-2 text-blue-800">
            <Sparkles size={20} />
            <h3 className="font-bold uppercase tracking-tight">Smart Inquiry Drafter</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>Crafting professional RFQ email...</p>
            </div>
          ) : (
            <div className="relative group">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 bg-white p-6 rounded-xl border border-gray-200 shadow-inner min-h-[300px]">
                {draft}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 hover:bg-red-600 transition-colors"
              >
                <Copy size={14} />
                <span>Copy Draft</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 font-bold text-gray-500 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-800 p-2 rounded text-white font-bold text-xl flex items-center justify-center w-12 h-12 shadow-inner border border-white/10">
              SF
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase leading-none text-white">Smart Fluid Hydraulic</h1>
              <p className="text-[10px] text-blue-400 tracking-widest uppercase font-black">Trading LLC</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8 text-sm font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-red-500 text-gray-300 transition-colors">Home</a>
            <a href="#" className="hover:text-red-500 text-gray-300 transition-colors">About</a>
            <a href="#" className="hover:text-red-500 text-gray-300 transition-colors">Products</a>
            <a href="#" className="hover:text-red-500 text-gray-300 transition-colors">Services</a>
            <a href="#" className="hover:text-red-500 text-gray-300 transition-colors">Contact</a>
            <button className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-md flex items-center space-x-2 transition-all shadow-lg shadow-red-900/40 text-white">
              <Phone size={16} />
              <span>24/7 Support</span>
            </button>
          </div>

          <div className="lg:hidden text-gray-300">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 pt-2 pb-6 space-y-2">
          <a href="#" className="block py-3 border-b border-gray-800 font-bold uppercase tracking-wide text-gray-300">Home</a>
          <a href="#" className="block py-3 border-b border-gray-800 font-bold uppercase tracking-wide text-gray-300">Products</a>
          <button className="w-full bg-red-600 text-white py-4 rounded-md flex items-center justify-center space-x-2 font-black uppercase mt-4">
            <Phone size={16} />
            <span>Call 24/7 Support</span>
          </button>
        </div>
      )}
    </nav>
  );
};

const TeamSection = () => (
  <section className="bg-gray-50 py-16 border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
        {TEAM_MEMBERS.map((member, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group flex items-start space-x-6">
            <div className="bg-blue-50 p-5 rounded-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors duration-300">
              {member.icon}
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-xl tracking-tight">{member.name}</h3>
              <p className="text-red-600 text-xs font-black uppercase tracking-widest mb-3">{member.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductCatalog = ({ onDraftQuote }) => {
  const [filter, setFilter] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return CATALOG_ITEMS.filter(item => {
      const matchesFilter = filter === "All Products" || item.category === filter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <section id="catalog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-amber-100">
            <Award size={14} />
            <span>EN 10204 3.1 Certified Suppliers</span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Product Portfolio</h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-xl font-medium">
            High-specification fluid power components for the most demanding oilfield and marine environments in the Middle East.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 bg-gray-50 p-6 rounded-3xl border border-gray-200">
          <div className="flex flex-wrap gap-3">
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat
                  ? "bg-blue-800 text-white shadow-lg shadow-blue-900/30"
                  : "bg-white text-gray-600 hover:bg-gray-200 border border-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search technical specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-medium shadow-inner text-gray-800"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1">
              <div className="bg-gray-100 border-b border-gray-200 h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 group-hover:scale-125 transition-transform duration-1000 flex items-center justify-center">
                  {item.category.includes('Hose') ? <Droplets size={140} className="text-blue-800" /> : <Settings size={140} className="text-blue-800" />}
                </div>
                <div className="z-10 bg-white/95 backdrop-blur px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-red-600 shadow-lg border border-red-100">
                  {item.category}
                </div>
              </div>

              <div className="p-8 flex-grow bg-white">
                <h3 className="font-black text-2xl text-gray-900 mb-3 group-hover:text-blue-800 transition-colors leading-tight">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed font-medium">{item.description}</p>

                <div className="space-y-3 border-t border-gray-100 pt-6">
                  <div className="flex items-center text-sm font-bold text-gray-700">
                    <ArrowRight size={16} className="mr-3 text-red-600" />
                    <span className="text-gray-400 font-medium mr-2">Spec:</span> {item.spec}
                  </div>
                  <div className="flex items-center text-sm font-bold text-gray-700">
                    <ShieldCheck size={16} className="mr-3 text-amber-500" />
                    <span className="text-gray-400 font-medium mr-2">Rating:</span> {item.pressure}
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 mt-auto space-y-3 bg-white">
                <button
                  onClick={() => onDraftQuote(item)}
                  className="w-full bg-blue-50 text-blue-800 border border-blue-100 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-blue-800 hover:text-white transition-all group/btn"
                >
                  <Sparkles size={16} className="group-hover/btn:animate-pulse" />
                  <span>Draft AI Inquiry ✨</span>
                </button>
                <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
                  <span>Enquire for Price</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => (
  <section className="py-24 bg-gray-900 text-white overflow-hidden relative border-y border-white/5">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600 -skew-x-12 translate-x-1/2 opacity-20 pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <span className="text-red-500 font-black tracking-[0.3em] uppercase text-xs mb-6 block">24/7 Rapid Response</span>
          <h2 className="text-5xl font-black mt-4 mb-8 leading-[1.1] tracking-tight">Industrial Mobile <br /><span className="text-blue-500">Service Units</span></h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed font-medium">
            Minimizing downtime in Ras Al Khor and across the Emirates. Our units are equipped with high-pressure swaging technology for immediate onsite repairs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {[
              "Onsite Crimping",
              "Pressure Testing",
              "Pipe Bending",
              "System Diagnosis"
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Wrench size={20} className="text-white" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wide text-gray-200">{text}</span>
              </div>
            ))}
          </div>

          <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-sm flex items-center justify-center space-x-4 transition-all transform hover:-translate-y-1 shadow-2xl shadow-red-900/50">
            <Truck size={24} />
            <span>Request Mobile Service</span>
          </button>
        </div>

        <div className="relative group">
          <div className="bg-blue-800 p-10 rounded-[3rem] shadow-2xl relative border border-blue-700/50">
            <div className="absolute -top-4 -left-4 bg-red-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Emergency Unit</div>
            <div className="bg-gray-900 p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
              <h4 className="text-xl font-black mb-6 flex items-center text-blue-400 uppercase tracking-tight">
                <Clock className="mr-3 text-red-600" />
                Response Window
              </h4>
              <div className="text-7xl font-black text-white mb-4 tracking-tighter">45<span className="text-3xl ml-2 text-gray-500">MIN</span></div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Guaranteed Ras Al Khor Coverage</p>

              <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-red-500 font-black text-4xl mb-1 tracking-tighter">12k+</div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-gray-500">Assemblies</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-500 font-black text-4xl mb-1 tracking-tighter">24H</div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-gray-500">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-950 text-gray-500 py-20 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
      <div className="col-span-1 lg:col-span-1">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-800 p-2.5 rounded text-white font-black text-xl">SF</div>
          <span className="text-white font-black text-xl tracking-tighter">SMART FLUID</span>
        </div>
        <p className="text-sm leading-relaxed mb-8 font-medium">
          The UAE's specialized hub for high-pressure hydraulic components and emergency onsite hose repairs. Driven by precision and certified quality.
        </p>
      </div>

      <div>
        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Technical Expertise</h4>
        <ul className="space-y-5 text-sm font-bold text-gray-400">
          <li className="hover:text-red-500 transition-colors cursor-pointer flex items-center"><ChevronRight size={14} className="mr-2 text-blue-800" /> Hose Assemblies</li>
          <li className="hover:text-red-500 transition-colors cursor-pointer flex items-center"><ChevronRight size={14} className="mr-2 text-blue-800" /> Bellows Fabrication</li>
          <li className="hover:text-red-500 transition-colors cursor-pointer flex items-center"><ChevronRight size={14} className="mr-2 text-blue-800" /> System Diagnosis</li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Fiscal Standing</h4>
        <div className="space-y-4">
          <div className="bg-gray-900 p-5 rounded-2xl border border-white/5 shadow-inner">
            <div className="text-[10px] uppercase tracking-[0.2em] font-black text-red-500 mb-2">VAT Registration</div>
            <div className="font-mono text-white text-sm font-bold">100515283800003</div>
          </div>
          <div className="bg-gray-900 p-5 rounded-2xl border border-white/5 shadow-inner">
            <div className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-500 mb-2">Trade License</div>
            <div className="font-mono text-white text-sm font-bold">704175</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Get In Touch</h4>
        <ul className="space-y-6 text-sm font-bold text-gray-400">
          <li className="flex items-start space-x-4">
            <MapPin size={20} className="text-red-600 shrink-0" />
            <span className="leading-relaxed">Ras Al Khor Industrial 1,<br />Dubai, UAE</span>
          </li>
          <li className="flex items-center space-x-4">
            <Mail size={20} className="text-blue-500" />
            <span>smartfluidhydraulic@gmail.com</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
      &copy; 2024 Smart Fluid Hydraulic Trading LLC. Established 2014.
    </div>
  </footer>
);

export default function App() {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [selectedProductForDraft, setSelectedProductForDraft] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-red-600 selection:text-white">
      <Navbar />

      {/* Floating AI Advisor Button */}
      <button
        onClick={() => setIsAdvisorOpen(true)}
        className="fixed bottom-10 right-10 z-[40] bg-blue-800 text-white p-5 rounded-full shadow-2xl shadow-blue-900/40 hover:scale-110 active:scale-95 transition-all flex items-center space-x-3 group border border-white/10"
      >
        <div className="relative">
          <BrainCircuit size={32} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
          </span>
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black uppercase tracking-widest text-xs whitespace-nowrap">
          Technical AI ✨
        </span>
      </button>

      <main>
        <TeamSection />

        <ProductCatalog
          onDraftQuote={(product) => setSelectedProductForDraft(product)}
        />

        <ServicesSection />

        {/* Secondary CTA Banner */}
        <section className="bg-red-600 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="text-white text-center md:text-left">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Technical Consultancy Required?</h3>
              <p className="text-red-100 font-bold opacity-80">Access our AI Advisor or speak directly with our senior engineers.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsAdvisorOpen(true)}
                className="bg-white text-red-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center space-x-3 shadow-xl"
              >
                <Sparkles size={18} />
                <span>Launch AI Advisor</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* AI Modals */}
      <AIChatAdvisor
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />

      <SmartQuoteDrafter
        product={selectedProductForDraft}
        isOpen={!!selectedProductForDraft}
        onClose={() => setSelectedProductForDraft(null)}
      />
    </div>
  );
}
