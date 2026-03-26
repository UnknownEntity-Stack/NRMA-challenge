/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { 
  Menu, 
  ShieldCheck, 
  Info, 
  CheckCircle, 
  XCircle, 
  QrCode, 
  Clock, 
  HelpCircle, 
  LayoutDashboard, 
  ScanLine, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  Filter,
  Download,
  MoreVertical,
  ChevronDown,
  Printer,
  CheckCircle2,
  Bus,
  Train,
  TramFront,
  TrainFront,
  User,
  Building2,
  LogOut,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, HistoryItem, PassStatus } from './types';

const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', passId: 'AT-992-XC8', time: '10:45', date: 'Tonight — Friday, Oct 24', result: 'OVER LIMIT', bac: 0.07, status: 'ACTIVE' },
  { id: '2', passId: 'BR-104-QL2', time: '09:12', date: 'Tonight — Friday, Oct 24', result: 'OVER LIMIT', bac: 0.06, status: 'REDEEMED' },
  { id: '3', passId: 'NM-221-PT9', time: '08:44', date: 'Tonight — Friday, Oct 24', result: 'OVER LIMIT', bac: 0.08, status: 'DENIED' },
  { id: '4', passId: 'XK-440-LM1', time: '11:30', date: 'Thursday, Oct 23', result: 'UNDER LIMIT', bac: 0.00, status: 'EXPIRED' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('DASHBOARD');
  const [bacScore, setBacScore] = useState<string>('0.00');
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);
  const [timeLeft, setTimeLeft] = useState(7198); // 1:59:58 in seconds
  const [venueName, setVenueName] = useState('Atlas Hospitality');
  const [currentPassId, setCurrentPassId] = useState<string>('');

  const generatePassId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 2; i++) result += chars.charAt(Math.floor(Math.random() * 26));
    result += '-';
    for (let i = 0; i < 3; i++) result += chars.charAt(Math.floor(Math.random() * 10) + 26);
    result += '-';
    for (let i = 0; i < 3; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  useEffect(() => {
    if (currentScreen === 'SUCCESS' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentScreen, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGeneratePass = () => {
    const score = parseFloat(bacScore);
    if (score < 0.05) {
      alert("Patron is within legal driving limits (BAC < 0.05). Safe Home Pass is only issued to those exceeding the limit to ensure safe transit.");
      return;
    }
    
    const newPassId = generatePassId();
    setCurrentPassId(newPassId);
    
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      passId: newPassId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Tonight — Friday, Oct 24',
      result: 'OVER LIMIT',
      bac: score,
      status: 'ACTIVE'
    };
    
    setHistory([newHistoryItem, ...history]);
    setCurrentScreen('SUCCESS');
    setTimeLeft(7200); // Reset timer to 2 hours
  };

  const renderHeader = () => (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full shadow-[0_10px_30px_rgba(7,30,39,0.06)]">
      <div className="flex items-center gap-4">
        <Menu className="text-on-surface-variant cursor-pointer" size={24} />
        <h1 className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">DriveSure</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Staff Terminal</p>
          <p className="text-xs text-on-surface-variant">{venueName}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-primary-fixed">
          <img 
            alt="Staff Profile" 
            className="w-full h-full object-cover" 
            src="https://picsum.photos/seed/staff-member/100/100"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );

  const renderBottomNav = () => (
    <nav className="bg-surface-container-lowest w-full h-20 px-4 flex justify-around items-center fixed bottom-0 z-50 rounded-t-xl md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <NavItem 
        icon={<LayoutDashboard size={24} />} 
        label="Dashboard" 
        active={currentScreen === 'DASHBOARD'} 
        onClick={() => setCurrentScreen('DASHBOARD')} 
      />
      <NavItem 
        icon={<ScanLine size={24} />} 
        label="Verify" 
        active={currentScreen === 'VERIFY' || currentScreen === 'SUCCESS'} 
        onClick={() => setCurrentScreen('VERIFY')} 
      />
      <NavItem 
        icon={<HistoryIcon size={24} />} 
        label="History" 
        active={currentScreen === 'HISTORY'} 
        onClick={() => setCurrentScreen('HISTORY')} 
      />
      <NavItem 
        icon={<SettingsIcon size={24} />} 
        label="Settings" 
        active={currentScreen === 'SETTINGS'} 
        onClick={() => setCurrentScreen('SETTINGS')} 
      />
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {renderHeader()}
      
      <main className="flex-grow container max-w-md mx-auto px-6 py-8 pb-32">
        <AnimatePresence mode="wait">
          {currentScreen === 'DASHBOARD' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <section>
                <h2 className="font-headline font-black text-3xl text-on-surface mb-1 tracking-tight">DriveSure</h2>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Breathe. Check. Get home safe.</p>
                <p className="text-on-surface-variant text-sm">Safe Home Pass Program Monitor</p>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-b-2 border-primary-fixed">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Passes Issued</p>
                  <p className="text-2xl font-black text-primary">24</p>
                  <p className="text-[10px] text-secondary font-bold mt-1">+12% from last shift</p>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-b-2 border-tertiary-fixed">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Avg. BAC</p>
                  <p className="text-2xl font-black text-on-surface">0.02</p>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">Within safe limits</p>
                </div>
              </div>

              <div className="bg-primary-gradient p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline font-bold text-lg">Multimodal Integration</h3>
                    <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">One-Trip Only</span>
                  </div>
                  <p className="text-xs text-on-primary-container leading-relaxed mb-4">
                    The Safe Home Pass is valid across all government-regulated public transport systems for a single journey.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <TrainFront size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase">Metro</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Bus size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase">Bus</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <TramFront size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase">Tram</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <ScanLine size={120} />
                </div>
              </div>

              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-primary shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">System Status: Operational</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Terminal linked to Transport Authority Digital Ecosystem. Last sync: Just now.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-primary shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-on-surface mb-1">Hardware-Light Protocol</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Verify the patron's score using on-site equipment. Use this terminal to generate the unique QR code for the patron's digital transit ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('VERIFY')}
                className="w-full py-4 bg-surface-container-highest text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-fixed transition-all"
              >
                Start New Verification <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {currentScreen === 'VERIFY' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <section className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-fixed mb-6">
                  <ShieldCheck className="text-on-primary-fixed-variant" size={36} />
                </div>
                <h2 className="font-headline font-black text-3xl text-on-surface mb-2 tracking-tight">New Pass Verification</h2>
                <p className="text-on-surface-variant text-sm px-4">Safe Home Pass Program</p>
              </section>

              <div className="bg-surface-container-low p-5 rounded-xl relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-surface-tint"></div>
                <div className="flex gap-4">
                  <Info className="text-primary shrink-0" size={20} />
                  <div>
                    <h3 className="font-headline font-bold text-sm uppercase tracking-wider mb-1">Privacy Disclaimer</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Your results are not recorded nor linked to anything; we only generate a one-time QR code.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 border-primary-fixed">
                <label className="block font-label text-xs font-bold uppercase tracking-[0.05rem] text-on-surface-variant mb-4">
                  Breathalyzer Score (BAC %)
                </label>
                <div className="flex flex-col items-center">
                  <input 
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-center text-5xl font-headline font-black py-4 transition-all"
                    value={bacScore}
                    onChange={(e) => setBacScore(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                  <div className="flex gap-4 mt-6 w-full">
                    <button 
                      onClick={() => setBacScore('0.02')}
                      className="flex-1 py-3 px-4 rounded-lg bg-secondary-container text-on-secondary-container font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> UNDER LIMIT
                    </button>
                    <button 
                      onClick={() => setBacScore('0.06')}
                      className="flex-1 py-3 px-4 rounded-lg bg-error-container text-on-error-container font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> OVER LIMIT
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGeneratePass}
                  className="w-full py-5 rounded-lg bg-primary-gradient text-white font-headline font-bold text-lg shadow-lg active:scale-95 duration-150 transition-all flex items-center justify-center gap-3"
                >
                  Generate Safe Home Pass
                  <QrCode size={24} />
                </button>
                <div className="flex items-center justify-center gap-2 text-on-surface-variant py-2">
                  <Clock size={16} />
                  <span className="text-xs font-medium uppercase tracking-widest">QR code will expire in 2 hours</span>
                </div>
              </div>

              <div className="text-center">
                <button className="text-primary font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-1 mx-auto py-2 px-4 hover:bg-surface-container-high rounded-full transition-colors">
                  Need Help?
                  <HelpCircle size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'SUCCESS' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="font-headline font-extrabold text-on-surface text-3xl mb-2">Pass Generated Successfully</h2>
                <p className="text-on-surface-variant font-medium">Safe Home Pass Program • {venueName}</p>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-center border-l-4 border-surface-tint shadow-sm">
                <span className="font-label text-xs uppercase tracking-[0.05rem] text-on-surface-variant mb-2">Validity Remaining</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline font-black text-4xl text-primary">{formatTime(timeLeft)}</span>
                  <span className="text-on-surface-variant font-bold">HRS</span>
                </div>
                <div className="mt-4 w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${(timeLeft / 7200) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Info className="text-primary shrink-0" size={20} />
                  <div>
                    <h3 className="font-bold text-on-surface mb-1">Staff Instruction</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Please ask the patron to scan this code with their transit app (e.g. Opal). This pass grants a <strong>one-trip entitlement</strong> (value-capped) for emergency transport.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
                <div className="p-4 rounded-xl qr-gradient-border relative mb-6">
                  <div className="bg-white p-3 rounded-lg">
                    <img 
                      alt="QR Code" 
                      className="w-48 h-48" 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentPassId}-${Date.now()}`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-on-surface tracking-tight mb-1">PASS ID: {currentPassId}</p>
                  <p className="font-label text-xs text-outline uppercase tracking-widest">One-Trip Entitlement Token</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setCurrentScreen('DASHBOARD')}
                  className="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> Done
                </button>
                <button className="w-full py-4 bg-primary-fixed text-on-primary-fixed-variant font-bold rounded-lg hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Printer size={20} /> Print Receipt
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'HISTORY' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2">
                <p className="font-label text-xs text-primary font-bold tracking-[0.1rem] uppercase">Audit Trail</p>
                <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">Verification History</h2>
              </div>

              <div className="flex gap-2">
                <button className="bg-surface-container-highest px-4 py-2 rounded font-bold text-xs text-on-surface-variant flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                  <Filter size={16} /> Filter
                </button>
                <button className="bg-surface-container-highest px-4 py-2 rounded font-bold text-xs text-on-surface-variant flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                  <Download size={16} /> Export CSV
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-4 py-2 mb-4">
                    <span className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">Tonight — Friday, Oct 24</span>
                    <div className="flex-grow h-[1px] bg-outline-variant opacity-15"></div>
                  </div>
                  <div className="space-y-4">
                    {history.filter(item => item.date.includes('Tonight')).map(item => (
                      <HistoryCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-4 py-2 mb-4">
                    <span className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">Thursday, Oct 23</span>
                    <div className="flex-grow h-[1px] bg-outline-variant opacity-15"></div>
                  </div>
                  <div className="space-y-4">
                    {history.filter(item => item.date.includes('Thursday')).map(item => (
                      <HistoryCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button className="bg-primary px-8 py-3 rounded-md text-on-primary font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-3">
                  Load More History
                  <ChevronDown size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'SETTINGS' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <section>
                <h2 className="font-headline font-black text-3xl text-on-surface mb-2 tracking-tight">Settings</h2>
                <p className="text-on-surface-variant text-sm">Terminal Configuration</p>
              </section>

              <div className="space-y-4">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 border-primary-fixed">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Building2 size={16} /> Venue Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Venue Name</label>
                      <input 
                        type="text" 
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-2 font-bold text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Terminal ID</label>
                      <p className="font-mono text-sm text-on-surface">ATH-SYD-042</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Pass Value Cap</label>
                      <p className="font-bold text-on-surface">$25.00 AUD <span className="text-[10px] font-normal text-on-surface-variant">(Standard One-Trip)</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-2 border-secondary-fixed">
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={16} /> Staff Profile
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden">
                      <img src="https://picsum.photos/seed/staff-member/100/100" alt="Staff" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Alex Thompson</p>
                      <p className="text-xs text-on-surface-variant">Senior Concierge</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-error-container text-on-error-container font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-error transition-all hover:text-white">
                  <LogOut size={18} /> Log Out Terminal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {renderBottomNav()}
    </div>
  );
}

const NavItem: React.FC<{ icon: ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-4 py-2 transition-all rounded-xl ${active ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'text-on-surface-variant hover:text-primary'}`}
    >
      {icon}
      <span className="font-body text-[10px] font-bold uppercase tracking-[0.05rem] mt-1">{label}</span>
    </button>
  );
};

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
  const getStatusColor = (status: PassStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-secondary-container text-on-secondary-container';
      case 'REDEEMED': return 'bg-surface-container-highest text-on-surface-variant';
      case 'DENIED': return 'bg-tertiary-container text-on-tertiary-container';
      case 'EXPIRED': return 'bg-error-container text-on-error-container';
      default: return 'bg-surface-container-highest text-on-surface-variant';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 relative group hover:shadow-md transition-all duration-300">
      {item.status === 'ACTIVE' && (
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-surface-tint rounded-r-full"></div>
      )}
      <div className="flex flex-col items-center justify-center w-16 shrink-0">
        <span className="text-on-surface font-black text-lg">{item.time}</span>
        <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">PM</span>
      </div>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <div className="flex flex-col">
          <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-wider">Pass ID</span>
          <span className="font-headline font-bold text-on-surface text-lg">{item.passId}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.result === 'OVER LIMIT' ? 'bg-error-container/30 text-error' : 'bg-secondary-container/30 text-secondary'}`}>
            {item.result === 'OVER LIMIT' ? <XCircle size={20} fill="currentColor" fillOpacity={0.2} /> : <CheckCircle size={20} fill="currentColor" fillOpacity={0.2} />}
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-wider">Result</span>
            <span className="font-bold text-on-surface">{item.result} ({item.bac.toFixed(2)})</span>
          </div>
        </div>
        <div className="flex sm:justify-end">
          <span className={`${getStatusColor(item.status)} px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider`}>
            {item.status}
          </span>
        </div>
      </div>
      <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors shrink-0">
        <MoreVertical size={20} />
      </button>
    </div>
  );
};
