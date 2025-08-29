import { BarChart, Users, Package, Truck, DollarSign } from 'lucide-react';

export function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard 
          title="Total Customers" 
          value="256" 
          icon={<Users className="w-8 h-8 text-blue-500" />} 
          change="+12%" 
          trend="up" 
        />
        <DashboardCard 
          title="Total Products" 
          value="1,204" 
          icon={<Package className="w-8 h-8 text-green-500" />} 
          change="+5%" 
          trend="up" 
        />
        <DashboardCard 
          title="Total Vendors" 
          value="48" 
          icon={<Truck className="w-8 h-8 text-purple-500" />} 
          change="+3%" 
          trend="up" 
        />
        <DashboardCard 
          title="Revenue" 
          value="$24,500" 
          icon={<DollarSign className="w-8 h-8 text-amber-500" />} 
          change="+18%" 
          trend="up" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start pb-4 border-b border-secondary-100 last:border-0">
                <div className="bg-primary-100 p-2 rounded-full mr-3">
                  <BarChart className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">New order placed</p>
                  <p className="text-sm text-secondary-500">Order #ORD-{2023 + i} was created</p>
                  <p className="text-xs text-secondary-400 mt-1">{i} hour{i !== 1 ? 's' : ''} ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Stats</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">Total Orders</span>
              <span className="font-semibold">1,245</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-secondary-600">Pending Orders</span>
              <span className="font-semibold">42</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-secondary-600">Inventory Status</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-secondary-600">Customer Satisfaction</span>
              <span className="font-semibold">92%</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
}

function DashboardCard({ title, value, icon, change, trend }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between">
        <div>
          <p className="text-secondary-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change} {trend === 'up' ? '↑' : '↓'}
        </span>
        <span className="text-secondary-500 text-sm ml-1">vs last month</span>
      </div>
    </div>
  );
}