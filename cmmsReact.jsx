import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faCube, faClipboardList, faCalendarCheck, 
  faChartBar, faCog, faPlus, faSearch, faTools, 
  faFileInvoice, faBell, faSync 
} from '@fortawesome/free-solid-svg-icons';

const CMMS = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - replace with API calls in real implementation
  useEffect(() => {
    setAssets([
      { id: 1, name: 'AC Unit - Lab 3', category: 'HVAC', status: 'operational', lastMaintenance: '2024-03-15' },
      { id: 2, name: 'Server Rack 05', category: 'IT', status: 'critical', lastMaintenance: '2024-02-28' },
      { id: 3, name: 'Microscope X200', category: 'Lab', status: 'maintenance', lastMaintenance: '2024-03-20' },
    ]);
  }, []);

  const stats = {
    totalAssets: 1243,
    pendingWorkOrders: 27,
    preventiveMaintenance: 98,
    assetStatus: { operational: 85, maintenance: 10, critical: 5 }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || asset.category === selectedCategory)
  );

  return (
    <div className="cmms-app">
      <Sidebar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <StatsGrid stats={stats} />
        
        <div className="content-row">
          <AssetOverview 
            assets={filteredAssets}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <QuickActionsPanel />
        </div>
      </main>
    </div>
  );
};

const Sidebar = ({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) => (
  <nav className={`cmms-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
    <div className="sidebar-header">
      <img src="lens.jpeg" alt="Logo" />
      <h2>CMMS</h2>
      <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FontAwesomeIcon icon={faSync} rotation={90} />
      </button>
    </div>

    <div className="nav-menu">
      {[
        { id: 'dashboard', icon: faTachometerAlt, label: 'Dashboard' },
        { id: 'assets', icon: faCube, label: 'Asset Management' },
        { id: 'workorders', icon: faClipboardList, label: 'Work Orders' },
        { id: 'schedule', icon: faCalendarCheck, label: 'Schedule' },
        { id: 'reports', icon: faChartBar, label: 'Reports' },
        { id: 'settings', icon: faCog, label: 'Settings' },
      ].map(navItem => (
        <button
          key={navItem.id}
          className={`nav-item ${activeNav === navItem.id ? 'active' : ''}`}
          onClick={() => setActiveNav(navItem.id)}
        >
          <FontAwesomeIcon icon={navItem.icon} />
          <span>{navItem.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

const Header = ({ searchQuery, setSearchQuery, toggleSidebar }) => (
  <header className="main-header">
    <button className="mobile-menu-btn" onClick={toggleSidebar}>
      ☰
    </button>
    
    <div className="header-actions">
      <button className="btn-primary">
        <FontAwesomeIcon icon={faPlus} />
        New Work Order
      </button>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} />
      </div>
    </div>
  </header>
);

const StatsGrid = ({ stats }) => (
  <div className="stats-grid">
    <StatCard 
      title="Total Assets"
      value={stats.totalAssets}
      trend="5% increase"
      color="var(--primary-blue)"
    >
      <ProgressBar percentage={stats.assetStatus.operational} />
    </StatCard>

    <StatCard 
      title="Pending Work Orders"
      value={stats.pendingWorkOrders}
      trend="3 urgent"
      color="var(--status-red)"
    >
      <div className="priority-tags">
        <span className="high">High: 5</span>
        <span className="medium">Medium: 12</span>
        <span className="low">Low: 10</span>
      </div>
    </StatCard>

    <StatCard 
      title="Preventive Maintenance"
      value={`${stats.preventiveMaintenance}%`}
      trend="+2% from last month"
      color="var(--accent-green)"
    />

    <StatCard 
      title="Asset Health"
      color="var(--secondary-blue)"
    >
      <div className="asset-health">
        <div className="health-item operational">
          <div className="dot" />
          {stats.assetStatus.operational}% Operational
        </div>
        <div className="health-item maintenance">
          <div className="dot" />
          {stats.assetStatus.maintenance}% Maintenance
        </div>
        <div className="health-item critical">
          <div className="dot" />
          {stats.assetStatus.critical}% Critical
        </div>
      </div>
    </StatCard>
  </div>
);

const AssetOverview = ({ assets, selectedCategory, setSelectedCategory }) => (
  <div className="asset-overview">
    <div className="section-header">
      <h3>Asset Overview</h3>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="HVAC">HVAC Systems</option>
        <option value="IT">IT Equipment</option>
        <option value="Lab">Lab Equipment</option>
      </select>
    </div>

    <div className="asset-table">
      <table>
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Last Maintenance</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.category}</td>
              <td>
                <StatusBadge status={asset.status} />
              </td>
              <td>{asset.lastMaintenance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Additional components (QuickActionsPanel, StatCard, ProgressBar, StatusBadge) would follow...

export default CMMS;