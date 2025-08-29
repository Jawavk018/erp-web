import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@lib/utils';
import { ThemeSelector } from '@components/ui/ThemeSelector';
import {
  ChevronDown,
  LayoutDashboard,
  FileText,
  Settings,
  Menu,
  X,
  BadgeIndianRupee,
} from 'lucide-react';

interface SidebarItemProps {
  to?: string;
  icon?: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  collapsed: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  activeSubmenu?: string;
  setActiveSubmenu?: (menu: string) => void;
  onExpandSidebar?: () => void;
}

function SidebarItem({
  to,
  icon,
  label,
  children,
  collapsed,
  isOpen,
  onToggle,
  activeSubmenu,
  setActiveSubmenu,
  onExpandSidebar,
}: SidebarItemProps) {
  const location = useLocation();
  const isChildActive = to && location.pathname.startsWith(to);

  const handleClick = () => {
    if (collapsed && children && onExpandSidebar) {
      // If sidebar is collapsed and this is a submenu item, expand the sidebar
      onExpandSidebar();
      // Set a small delay to allow the sidebar to expand before opening the submenu
      setTimeout(() => {
        onToggle?.();
        setActiveSubmenu?.(isOpen ? '' : label);
      }, 100);
    } else {
      // Normal behavior
      onToggle?.();
      setActiveSubmenu?.(isOpen ? '' : label);
    }
  };

  if (children) {
    return (
      <div className="mb-1 relative group ">
        <button
          onClick={handleClick}
          className={cn(
            "w-full flex items-center px-3 py-2.5 rounded-md transition-all duration-200",
            "text-text-primary hover:bg-accent/5",
            (isOpen || activeSubmenu === label) && "bg-accent/5 text-primary font-medium",
            collapsed ? "justify-center" : "justify-between",
            activeSubmenu === label &&
            "bg-primary text-white font-medium",
          )}
        >
          <div className="flex items-center">
            {icon && (
              <span className={cn(
                "sidebar-icon transition-transform",
                !collapsed && "mr-3",
                (isOpen || activeSubmenu === label) && "text-primary"
              )}>{icon}</span>
            )}
            {!collapsed && <span className="font-medium">{label}</span>}
          </div>
          {!collapsed && (
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-200",
                isOpen ? "rotate-180" : "rotate-0"
              )}
            />
          )}
        </button>

        {collapsed && (
          <div className="absolute left-full top-0 ml-2 pl-1 hidden group-hover:block z-50">
            <div className="bg-surface py-1 px-3 rounded-md shadow-lg border border-border whitespace-nowrap">
              {label}
            </div>
          </div>
        )}

        <div className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen && !collapsed ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="ml-1 mt-1 space-y-1 border-border pl-2 max-h-[60vh] overflow-y-scroll no-scrollbar custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <NavLink
        to={to || '#'}
        className={({ isActive }) => cn(
          "flex items-center px-3 py-2.5 rounded-md transition-all duration-200",
          "text-primary hover:bg-accent/5",
          isActive && "bg-primary text-white font-medium ",
          collapsed ? "justify-center" : ""
        )}
        onClick={() => {
          if (collapsed && onExpandSidebar) {
            onExpandSidebar();
          }
        }}
      >
        {icon && (
          <span className={cn(
            "sidebar-icon transition-transform",
            !collapsed && "mr-3"
          )}>{icon}</span>
        )}
        {!collapsed && <span className="font-medium">{label}</span>}
      </NavLink>

      {collapsed && (
        <div className="absolute left-full top-0 ml-2 pl-1 hidden group-hover:block z-50">
          <div className="bg-surface py-1 px-3 rounded-md shadow-lg border border-border whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapse }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/masters/')) {
      setActiveSubmenu('Masters');
    } else if (location.pathname.includes('/location-masters/')) {
      setActiveSubmenu('Location Masters');
    }
  }, [location.pathname]);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapse(value);
  };

  const expandSidebar = () => {
    if (collapsed) {
      handleCollapse(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-20 md:hidden p-2 rounded-md bg-surface shadow-md hover:bg-accent/5 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-surface border-r border-border transition-all duration-300 z-40 shadow-lg",
          collapsed ? "w-16" : "w-68",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!collapsed && (
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text drop-shadow-md flex items-center">
              TEXT
              <span className="relative text-blue-500">
                I
                <span className="absolute -top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </span>
              <span className="text-red-500">PRO</span>
            </h1>
          )}

          <div className="flex items-center gap-2">
            <ThemeSelector />

            <button
              onClick={() => handleCollapse(!collapsed)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                "hover:bg-accent/10 bg-gray-200 text-blue-500",
                "absolute ml-8",
                collapsed ? "rotate-180" : ""
              )}
            >
              <ChevronLeft
                className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  collapsed && "rotate-180"
                )}
              />
            </button>

            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-text-primary hover:bg-accent/5 transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
          <SidebarItem
            to="/"
            icon={<LayoutDashboard />}
            label="Dashboard"
            collapsed={collapsed}
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
            onExpandSidebar={expandSidebar}
          />

          <SidebarItem
            icon={<FileText />}
            label="Masters"
            collapsed={collapsed}
            isOpen={activeSubmenu === 'Masters'}
            onToggle={() => setActiveSubmenu(activeSubmenu === 'Masters' ? '' : 'Masters')}
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
            onExpandSidebar={expandSidebar}
          >
            <SidebarItem
              to="/masters/location-management"
              // icon={<Home />}
              label="Location Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/fabric-management"
              // icon={<Home />}
              label="Fabric Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/currency-master"
              // icon={<CircleDollarSign />}
              label="Currency"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/shipment-mode-master"
              // icon={<Plane />}
              label="Shipment Mode"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/shipment-terms-master"
              // icon={<Ship />}
              label="Shipment Terms"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/payment-terms-master"
              // icon={<Wallet />}
              label="Payment Terms"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/category"
              // icon={<Layers />}
              label="Categories"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/sub-category"
              // icon={<FolderTree />}
              label="Sub Categories"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/fabric-type"
              // icon={<Shirt />}
              label="Fabric Type"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/fabric-category"
              // icon={<Shirt />}
              label="Fabric Category"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/finishFabric-master"
              // icon={<Shirt />}
              label="Finish Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/yarn-master"
              label="Yarn Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/customer-management"
              // icon={<UserCircle />}
              label="Customers"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/vendor"
              // icon={<Briefcase />}
              label="Vendors"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/consignee"
              // icon={<Briefcase />}
              label="Consignee"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/uom-master"
              // icon={<Shirt />}
              label="Uom Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/gst-master"
              // icon={<Shirt />}
              label="GST Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/flange-master"
              // icon={<Shirt />}
              label="Flange Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/warehouse"
              // icon={<Home />}
              label="Warehouse"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/grade-master"
              // icon={<Home />}
              label="Grade Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/defect-master"
              // icon={<Home />}
              label="Defect Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/masters/process-master"
              // icon={<Home />}
              label="Process Master"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
          </SidebarItem>

          <SidebarItem
            icon={<BadgeIndianRupee />}
            label="Transaction"
            collapsed={collapsed}
            isOpen={activeSubmenu === 'Transaction'}
            onToggle={() => setActiveSubmenu(activeSubmenu === 'Transaction' ? '' : 'Transaction')}
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
            onExpandSidebar={expandSidebar}
          >
            <SidebarItem
              to="/transaction/sales-order-management"
              // icon={<ClipboardList />}
              label="Sales Order Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/purchase-order-details"
              // icon={<FileText />}
              label="Purchase Order"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/purchase-inward-details"
              // icon={<Package />}
              label="Purchase Inward"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/weaving-contract-details"
              // icon={<Package />}
              label="Weaving Contract"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/weaving-issue-details"
              // icon={<Package />}
              label="Weaving Yarn Issue"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/sizing-management"
              // icon={<Package />}
              label="Sizing Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/beam-management"
              // icon={<Package />}
              label="Beam Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/jobwork-fabric-receive-details"
              // icon={<Package />}
              label="Jobwork Fabric Receive"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/fabric-inspection-details"
              // icon={<Package />}
              label="Fabric Inspection"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />

            <SidebarItem
              to="/transaction/packing-list-mamagement"
              // icon={<Package />}
              label="Packing List Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/invoice-management"
              // icon={<Package />}
              label="Generate Invoice"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/process-contract-managemant"
              // icon={<Package />}
              label="Process Contract Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/processing-issue-management"
              // icon={<Package />}
              label="Processing Issue Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
            <SidebarItem
              to="/transaction/processing-receive-management"
              // icon={<Package />}
              label="Processing Receive Management"
              collapsed={collapsed}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              onExpandSidebar={expandSidebar}
            />
          </SidebarItem>
          <SidebarItem
            to="/settings"
            icon={<Settings />}
            label="Settings"
            collapsed={collapsed}
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
            onExpandSidebar={expandSidebar}
          />
        </nav>
      </aside>
    </>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
