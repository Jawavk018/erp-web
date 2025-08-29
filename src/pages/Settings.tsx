import { useThemeStore } from '@/store/themeStore';
import { useState } from 'react';

export function Settings() {
  const { theme, setTheme } = useThemeStore();
  const [companyName, setCompanyName] = useState('TEXTiPRO');
  const [email, setEmail] = useState('admin@textialerp.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [address, setAddress] = useState('123 Business Ave, Suite 100, New York, NY 10001');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input mt-1"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="input mt-1"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="input mt-1"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              
              {saveSuccess && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
                  Settings saved successfully!
                </div>
              )}
              
              <div className="pt-4">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
            
            <div className="space-y-4">
              <p className="text-secondary-600">Choose a theme for your ERP system:</p>
              
              <div className="space-y-3">
                <ThemeOption
                  id="default"
                  name="Blue Theme"
                  color="#3b82f6"
                  selected={theme === 'default'}
                  onChange={() => setTheme('default')}
                />
                
                <ThemeOption
                  id="green"
                  name="Green Theme"
                  color="#22c55e"
                  selected={theme === 'green'}
                  onChange={() => setTheme('green')}
                />
                
                <ThemeOption
                  id="purple"
                  name="Purple Theme"
                  color="#a855f7"
                  selected={theme === 'purple'}
                  onChange={() => setTheme('purple')}
                />
                
                <ThemeOption
                  id="orange"
                  name="Orange Theme"
                  color="#f97316"
                  selected={theme === 'orange'}
                  onChange={() => setTheme('orange')}
                />
              </div>
              
              <div className="mt-6 p-4 bg-secondary-50 rounded-md">
                <h3 className="font-medium text-secondary-800 mb-2">Preview</h3>
                <div 
                  className="h-20 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: getThemeColor(theme) }}
                >
                  <span className="text-white font-medium">Theme Preview</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-secondary-500">Version</p>
                <p className="font-medium">TEXTiPRO v1.0.0</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">Last Updated</p>
                <p className="font-medium">June 15, 2025</p>
              </div>
              
              <div>
                <p className="text-sm text-secondary-500">License</p>
                <p className="font-medium">Enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ThemeOptionProps {
  id: string;
  name: string;
  color: string;
  selected: boolean;
  onChange: () => void;
}

function ThemeOption({ id, name, color, selected, onChange }: ThemeOptionProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="radio"
        className="hidden"
        checked={selected}
        onChange={onChange}
      />
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary-600' : 'border-secondary-300'}`}>
        {selected && <div className="w-3 h-3 rounded-full bg-primary-600"></div>}
      </div>
      <div className="flex items-center">
        <span 
          className="w-4 h-4 mr-2 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <span>{name}</span>
      </div>
    </label>
  );
}

function getThemeColor(theme: string): string {
  switch (theme) {
    case 'green':
      return '#22c55e';
    case 'purple':
      return '#a855f7';
    case 'orange':
      return '#f97316';
    default:
      return '#3b82f6';
  }
}