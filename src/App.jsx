import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import SearchModal from './components/common/SearchModal';
import HistoryDrawer from './components/common/HistoryDrawer';
import ShortcutsModal from './components/common/ShortcutsModal';
import Toast from './components/common/Toast';

// 21 Calculators & Tools
import BasicCalculator from './components/calculators/1_BasicCalculator/BasicCalculator';
import ScientificCalculator from './components/calculators/2_ScientificCalculator/ScientificCalculator';
import SimpleInterestCalculator from './components/calculators/3_SimpleInterest/SimpleInterestCalculator';
import CompoundInterestCalculator from './components/calculators/4_CompoundInterest/CompoundInterestCalculator';
import ProfitLossCalculator from './components/calculators/5_ProfitLoss/ProfitLossCalculator';
import DiscountCalculator from './components/calculators/6_Discount/DiscountCalculator';
import PercentageCalculator from './components/calculators/7_Percentage/PercentageCalculator';
import Mensuration2DCalculator from './components/calculators/8_Mensuration2D/Mensuration2DCalculator';
import Mensuration3DCalculator from './components/calculators/9_Mensuration3D/Mensuration3DCalculator';
import DataStorageCalculator from './components/calculators/10_DataStorage/DataStorageCalculator';
import UnitConverterCalculator from './components/calculators/11_UnitConverter/UnitConverterCalculator';
import RatioProportionCalculator from './components/calculators/12_RatioProportion/RatioProportionCalculator';
import AverageCalculator from './components/calculators/13_Average/AverageCalculator';
import HcfLcmCalculator from './components/calculators/14_HcfLcm/HcfLcmCalculator';
import FractionCalculator from './components/calculators/15_Fraction/FractionCalculator';
import NumberSystemCalculator from './components/calculators/16_NumberSystem/NumberSystemCalculator';
import AgeDateCalculator from './components/calculators/17_AgeDate/AgeDateCalculator';
import TimeCalculator from './components/calculators/18_Time/TimeCalculator';
import BmiCalculator from './components/calculators/19_Bmi/BmiCalculator';
import MathToolsCalculator from './components/calculators/20_MathTools/MathToolsCalculator';
import FormulaLibrary from './components/calculators/21_FormulaLibrary/FormulaLibrary';

function MainLayout() {
  const { activeTool } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveCalculator = () => {
    switch (activeTool) {
      case 'basic': return <BasicCalculator />;
      case 'scientific': return <ScientificCalculator />;
      case 'simple_interest': return <SimpleInterestCalculator />;
      case 'compound_interest': return <CompoundInterestCalculator />;
      case 'profit_loss': return <ProfitLossCalculator />;
      case 'discount': return <DiscountCalculator />;
      case 'percentage': return <PercentageCalculator />;
      case 'mensuration_2d': return <Mensuration2DCalculator />;
      case 'mensuration_3d': return <Mensuration3DCalculator />;
      case 'data_storage': return <DataStorageCalculator />;
      case 'unit_converter': return <UnitConverterCalculator />;
      case 'ratio_proportion': return <RatioProportionCalculator />;
      case 'average': return <AverageCalculator />;
      case 'hcf_lcm': return <HcfLcmCalculator />;
      case 'fraction': return <FractionCalculator />;
      case 'number_system': return <NumberSystemCalculator />;
      case 'age_date': return <AgeDateCalculator />;
      case 'time_calc': return <TimeCalculator />;
      case 'bmi': return <BmiCalculator />;
      case 'math_tools': return <MathToolsCalculator />;
      case 'formula_library': return <FormulaLibrary />;
      default: return <BasicCalculator />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      {/* Main Content Area: Sidebar + Active Tool Viewport */}
      <div className="flex-1 flex max-w-[100rem] w-full mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveCalculator()}
        </main>
      </div>

      {/* Floating Overlays */}
      <SearchModal />
      <HistoryDrawer />
      <ShortcutsModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
