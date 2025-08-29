export const themes = {
    default: {
        primary: '#3b82f6',
        secondary: '#1e293b',
        accent: '#60a5fa',
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
            accent: '#3b82f6'
        }
    },
    green: {
        primary: '#22c55e',
        secondary: '#064e3b',
        accent: '#4ade80',
        background: '#f0fdf4',
        surface: '#ffffff',
        border: '#dcfce7',
        text: {
            primary: '#064e3b',
            secondary: '#059669',
            accent: '#22c55e'
        }
    },
    purple: {
        primary: '#a855f7',
        secondary: '#581c87',
        accent: '#c084fc',
        background: '#faf5ff',
        surface: '#ffffff',
        border: '#f3e8ff',
        text: {
            primary: '#581c87',
            secondary: '#9333ea',
            accent: '#a855f7'
        }
    },
    orange: {
        primary: '#f97316',
        secondary: '#7c2d12',
        accent: '#fb923c',
        background: '#fff7ed',
        surface: '#ffffff',
        border: '#ffedd5',
        text: {
            primary: '#7c2d12',
            secondary: '#c2410c',
            accent: '#f97316'
        }
    }
};

export type ThemeType = keyof typeof themes;
