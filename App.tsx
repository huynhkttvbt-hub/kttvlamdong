
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HydroDashboard from './components/HydroDashboard';
import HydroSummary from './components/HydroSummary';
import HydroGroupSummary from './components/HydroGroupSummary';
import SetupGuide from './components/SetupGuide';
import { MenuType, SubMenuType, StationMetadata, FilterState } from './types';
import { fetchMetadata } from './services/dataService';
import { isConfigured } from './supabaseClient';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<MenuType>(MenuType.THUY_VAN);
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuType>(SubMenuType.CHI_TIET);
  const [metadata, setMetadata] = useState<StationMetadata[]>([]);
  const [hasConfig, setHasConfig] = useState(isConfigured());

  // State lọc chung để quản lý đồng bộ dropdown
  const [filters, setFilters] = useState<FilterState>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    stationName: '',
    stationGroup: ''
  });

  useEffect(() => {
    if (hasConfig) {
      const load = async () => {
        try {
          const data = await fetchMetadata();
          setMetadata(data);
          
          // Khi mới load xong, nếu chưa có đài/trạm thì chọn cái đầu tiên
          if (data.length > 0 && !filters.stationGroup) {
            const firstItem = data[0];
            setFilters(prev => ({
              ...prev,
              stationGroup: firstItem.TenDai || '',
              stationName: firstItem.TenTram || ''
            }));
          }
        } catch (e) {
          console.error("Lỗi khi tải metadata:", e);
        }
      };
      load();
    }
  }, [hasConfig]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 1. Tính toán danh sách Đài (TenDai) duy nhất
  const availableGroups = useMemo(() => 
    Array.from(new Set(metadata.map(m => m.TenDai).filter(Boolean))).sort() as string[]
  , [metadata]);

  // 2. TÍNH TOÁN TRẠM THEO ĐÀI ĐÃ CHỌN (Yêu cầu chính của bạn)
  const filteredStations = useMemo(() => {
    if (!filters.stationGroup) {
      // Nếu chưa chọn đài, hiện tất cả trạm (unique)
      return Array.from(new Set(metadata.map(m => m.TenTram).filter(Boolean))).sort() as string[];
    }
    // Lọc các trạm thuộc về Đài đang chọn
    return metadata
      .filter(m => m.TenDai === filters.stationGroup)
      .map(m => m.TenTram)
      .filter(Boolean)
      .sort() as string[];
  }, [metadata, filters.stationGroup]);

  // Hàm xử lý khi thay đổi filter (bao gồm logic reset trạm khi đổi đài)
  const handleFilterChange = (newFilters: FilterState) => {
    // Nếu đổi Đài, cần kiểm tra xem Trạm hiện tại có thuộc Đài mới không
    if (newFilters.stationGroup !== filters.stationGroup) {
      const stationsForNewGroup = metadata
        .filter(m => m.TenDai === newFilters.stationGroup)
        .map(m => m.TenTram);
      
      // Chọn trạm đầu tiên của đài mới
      const defaultStation = stationsForNewGroup.length > 0 ? stationsForNewGroup[0] : '';
      setFilters({ ...newFilters, stationName: defaultStation });
    } else {
      setFilters(newFilters);
    }
  };

  const renderContent = () => {
    if (!hasConfig) {
      return <SetupGuide />;
    }

    if (activeSubMenu === SubMenuType.CHI_TIET) {
      return <HydroDashboard 
        activeMenu={activeMenu} 
        stations={filteredStations} 
        groups={availableGroups}
        filters={filters}
        onFilterChange={handleFilterChange}
      />;
    }
    if (activeSubMenu === SubMenuType.DAC_TRUNG) {
      return <HydroSummary />;
    }
    if (activeSubMenu === SubMenuType.TONG_HOP) {
      return <HydroGroupSummary />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 m-6">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-600 uppercase tracking-tight">Tính năng đang phát triển</h2>
        <p className="text-sm">Mục {activeMenu} hiện đang được cập nhật dữ liệu.</p>
      </div>
    );
  };

  const getMenuInfo = () => {
    const names: Record<string, string> = {
      [MenuType.THUY_VAN]: 'THUỶ VĂN',
      [MenuType.KHI_TUONG]: 'KHÍ TƯỢNG',
      [MenuType.MUA]: 'MƯA',
      [MenuType.PHU_QUY]: 'PHÚ QUÝ',
      [MenuType.HAI_VAN]: 'HẢI VĂN'
    };
    const subNames: Record<string, string> = {
      [SubMenuType.CHI_TIET]: 'Số liệu chi tiết',
      [SubMenuType.DAC_TRUNG]: 'Đặc trưng tháng',
      [SubMenuType.TONG_HOP]: 'Tổng hợp đài'
    };
    return { 
      menu: names[activeMenu] || activeMenu, 
      sub: subNames[activeSubMenu] || 'Dữ liệu' 
    };
  };

  const info = getMenuInfo();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeMenu={activeMenu} 
        activeSubMenu={activeSubMenu}
        onMenuSelect={(menu, sub) => {
          setActiveMenu(menu);
          setActiveSubMenu(sub);
        }}
        onToggle={toggleSidebar}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header 
          activeMenuName={info.menu} 
          activeSubMenuName={info.sub}
          isConfigured={hasConfig}
        />
        
        {/* Main scroll container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 pb-12">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
