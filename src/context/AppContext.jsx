import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const TOOLS_CONFIG = [
  { id: 'basic', name: 'Basic Calculator', category: 'General', icon: 'Calculator', desc: 'Standard arithmetic, BODMAS, powers, brackets & memory' },
  { id: 'scientific', name: 'Scientific Calculator', category: 'General', icon: 'Atom', desc: 'Trigonometry, hyperbolic, logs, permutations & radians/degrees' },
  { id: 'simple_interest', name: 'Simple Interest', category: 'Finance', icon: 'Percent', desc: 'Calculate SI, Principal, Rate, Time & visual breakdowns' },
  { id: 'compound_interest', name: 'Compound Interest', category: 'Finance', icon: 'TrendingUp', desc: 'Annual, quarterly, monthly compounding & SI vs CI comparison' },
  { id: 'profit_loss', name: 'Profit & Loss', category: 'Finance', icon: 'BadgeDollarSign', desc: 'Profit/Loss %, CP, SP, multi-item margin calculations' },
  { id: 'discount', name: 'Discount Calculator', category: 'Finance', icon: 'Tag', desc: 'Marked price, single & successive discounts, comparison deals' },
  { id: 'percentage', name: 'Percentage Calculator', category: 'Mathematics', icon: 'PercentSquare', desc: 'X% of Y, % increase/decrease, difference, exam marks' },
  { id: 'mensuration_2d', name: '2D Mensuration', category: 'Geometry', icon: 'Square', desc: '16 plane shapes: Area, perimeter, diagonal, sector, annulus' },
  { id: 'mensuration_3d', name: '3D Mensuration', category: 'Geometry', icon: 'Box', desc: '11 solid shapes: Volume, CSA, TSA, cone, frustum, sphere' },
  { id: 'data_storage', name: 'Data Storage Converter', category: 'Converters', icon: 'HardDrive', desc: 'Bits to Yottabytes, Decimal (SI) vs Binary (IEC) & transfer time' },
  { id: 'unit_converter', name: 'Unit Converter', category: 'Converters', icon: 'ArrowLeftRight', desc: '15 categories: Length, weight, temp, speed, pressure & energy' },
  { id: 'ratio_proportion', name: 'Ratio & Proportion', category: 'Mathematics', icon: 'Scale', desc: 'Simplification, comparison, direct/inverse & divide amounts' },
  { id: 'average', name: 'Average Calculator', category: 'Mathematics', icon: 'BarChart2', desc: 'Simple, weighted, dataset list, combined & missing value' },
  { id: 'hcf_lcm', name: 'HCF & LCM Calculator', category: 'Mathematics', icon: 'Network', desc: 'HCF/GCD, LCM, Euclidean algorithm & prime factor breakdown' },
  { id: 'fraction', name: 'Fraction Calculator', category: 'Mathematics', icon: 'Divide', desc: 'Add/sub/mul/div, mixed/improper conversion & decimal to fraction' },
  { id: 'number_system', name: 'Number System Converter', category: 'Computing', icon: 'Binary', desc: 'Binary, Octal, Decimal, Hex & custom base 2–36 conversion' },
  { id: 'age_date', name: 'Age & Date Calculator', category: 'Daily Life', icon: 'Calendar', desc: 'Age in Y/M/D, date difference, countdown, leap year & working days' },
  { id: 'time_calc', name: 'Time Calculator', category: 'Daily Life', icon: 'Clock', desc: 'Add/subtract time, duration, HH:MM:SS & working hours tracker' },
  { id: 'bmi', name: 'BMI Calculator', category: 'Health', icon: 'HeartPulse', desc: 'Body mass index, healthy weight range, metric & imperial' },
  { id: 'math_tools', name: 'Math Tools & Stats', category: 'Advanced Math', icon: 'Sigma', desc: 'Primes, factorials, AP/GP sequences, stats, probability & nCr' },
  { id: 'formula_library', name: 'Formula Library', category: 'Reference', icon: 'BookOpen', desc: 'Curated algebra, geometry, finance & trigonometry formulas' }
];

export function AppProvider({ children }) {
  const [activeTool, setActiveToolState] = useState(() => {
    return localStorage.getItem('unicalc_last_tool') || 'basic';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('unicalc_theme') || 'dark';
  });

  const [precision, setPrecision] = useState(() => {
    return localStorage.getItem('unicalc_precision') || '4';
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('unicalc_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('unicalc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('unicalc_favorites');
      return saved ? JSON.parse(saved) : ['basic', 'scientific', 'percentage', 'unit_converter'];
    } catch {
      return ['basic', 'scientific', 'percentage', 'unit_converter'];
    }
  });

  const [recentlyUsed, setRecentlyUsed] = useState(() => {
    try {
      const saved = localStorage.getItem('unicalc_recent');
      return saved ? JSON.parse(saved) : ['basic', 'scientific'];
    } catch {
      return ['basic', 'scientific'];
    }
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('unicalc_theme', theme);
  }, [theme]);

  // Set active tool and track recent
  const setActiveTool = (toolId) => {
    setActiveToolState(toolId);
    localStorage.setItem('unicalc_last_tool', toolId);

    setRecentlyUsed(prev => {
      const filtered = prev.filter(id => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 8);
      localStorage.setItem('unicalc_recent', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle favorite
  const toggleFavorite = (toolId) => {
    setFavorites(prev => {
      const exists = prev.includes(toolId);
      const updated = exists ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('unicalc_favorites', JSON.stringify(updated));
      showToast(exists ? 'Removed from Favorites' : 'Added to Favorites', 'info');
      return updated;
    });
  };

  // Add history record
  const addHistory = (item) => {
    const record = {
      id: Date.now() + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...item
    };
    setHistory(prev => {
      const updated = [record, ...prev].slice(0, 100); // keep last 100
      localStorage.setItem('unicalc_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('unicalc_history');
    showToast('Calculation history cleared', 'info');
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('unicalc_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Toast notifier
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Global keyboard shortcuts (Cmd+K / Ctrl+K for search, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setHistoryOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider value={{
      activeTool,
      setActiveTool,
      theme,
      setTheme,
      precision,
      setPrecision: (p) => {
        setPrecision(p);
        localStorage.setItem('unicalc_precision', p);
      },
      soundEnabled,
      setSoundEnabled: (s) => {
        setSoundEnabled(s);
        localStorage.setItem('unicalc_sound', String(s));
      },
      history,
      addHistory,
      clearHistory,
      deleteHistoryItem,
      favorites,
      toggleFavorite,
      recentlyUsed,
      searchOpen,
      setSearchOpen,
      historyOpen,
      setHistoryOpen,
      shortcutsOpen,
      setShortcutsOpen,
      toast,
      setToast,
      showToast,
      toolsConfig: TOOLS_CONFIG
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
