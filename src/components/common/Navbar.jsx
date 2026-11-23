import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  History,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Keyboard,
  Star,
  Sliders,
  Menu
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const {
    activeTool,
    setActiveTool,
    theme,
    setTheme,
    precision,
    setPrecision,
    soundEnabled,
    setSoundEnabled,
    history,
    setHistoryOpen,
    setSearchOpen,
    setShortcutsOpen,
    favorites,
    toolsConfig
  } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200 dark:border-white/10 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTool('basic')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-0.5 shadow-glow-cyan flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-extrabold text-lg tracking-tight">U</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-sky-700 to-sky-600 dark:from-white dark:via-sky-100 dark:to-sky-300 bg-clip-text text-transparent">
                  UniCalc
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-sky-500/20 text-[10px] font-bold text-sky-600 dark:text-sky-400 border border-sky-400/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 hidden sm:inline">22-in-1 Suite</span>
            </div>
          </div>
        </div>

        {/* Center: Search trigger & Favorites */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-lg mx-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <span>Search 22 calculators...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-300/80 dark:bg-white/10 group-hover:bg-slate-300 dark:group-hover:bg-white/20 rounded border border-slate-400/40 dark:border-white/15 text-slate-700 dark:text-slate-300">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5 text-sky-500 dark:text-sky-400" />
          </button>

          {/* Precision Selector */}
          <div className="hidden sm:flex items-center bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-2 py-1 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-1.5" />
            <select
              value={precision}
              onChange={(e) => setPrecision(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer text-xs"
              title="Decimal Precision"
            >
              <option value="2" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">2 Decimals</option>
              <option value="4" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">4 Decimals</option>
              <option value="6" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">6 Decimals</option>
              <option value="8" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">8 Decimals</option>
              <option value="auto" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Auto Precision</option>
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-all ${
              soundEnabled
                ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10'
            }`}
            title={soundEnabled ? 'Tactile 3D Click Sound Enabled' : 'Click Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Shortcuts Modal Trigger */}
          <button
            onClick={() => setShortcutsOpen(true)}
            className="hidden sm:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={() => setHistoryOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            title="Calculation History (⌘H)"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-amber-500 dark:text-amber-400 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Favorites Strip */}
      {favorites.length > 0 && (
        <div className="hidden md:flex items-center gap-2 px-6 py-1.5 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-xs overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider shrink-0">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Favorites:
          </span>
          {favorites.map(favId => {
            const tool = toolsConfig.find(t => t.id === favId);
            if (!tool) return null;
            const isActive = activeTool === favId;
            return (
              <button
                key={favId}
                onClick={() => setActiveTool(favId)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10'
                }`}
              >
                <span>{tool.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
