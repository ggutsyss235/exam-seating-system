import fs from 'fs';
import path from 'path';

const cssPath = path.join('e:', 'exam-seating-system', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Sober Base Theme Colors - Dark Corporate/Sober look
css = css.replace(/--primary: #8b5cf6;/g, '--primary: #0f172a;'); // Slate 900
css = css.replace(/--primary-hover: #7c3aed;/g, '--primary-hover: #1e293b;'); // Slate 800
css = css.replace(/--primary-light: rgba\(139, 92, 246, 0.15\);/g, '--primary-light: rgba(15, 23, 42, 0.05);');

css = css.replace(/--secondary: #0ea5e9;/g, '--secondary: #475569;'); // Slate 600
css = css.replace(/--secondary-hover: #0284c7;/g, '--secondary-hover: #334155;'); // Slate 700
css = css.replace(/--secondary-light: rgba\(14, 165, 233, 0.15\);/g, '--secondary-light: rgba(71, 85, 105, 0.1);');

css = css.replace(/--accent: #f43f5e;/g, '--accent: #e2e8f0;'); // Slate 200
css = css.replace(/--accent-light: rgba\(244, 63, 94, 0.15\);/g, '--accent-light: rgba(226, 232, 240, 0.2);');

// Clean professional light background mode as default 
css = css.replace(/--background: #09090b;/g, '--background: #f8fafc;'); // Slate 50
css = css.replace(/--surface: #18181b;/g, '--surface: #ffffff;'); // Pure White
css = css.replace(/--surface-hover: #27272a;/g, '--surface-hover: #f1f5f9;'); // Slate 100

// Clean Dark Text
css = css.replace(/--text-main: #ffffff;/g, '--text-main: #0f172a;'); // Slate 900
css = css.replace(/--text-muted: #f1f5f9;/g, '--text-muted: #475569;'); // Slate 600
css = css.replace(/--text-dim: #e2e8f0;/g, '--text-dim: #94a3b8;'); // Slate 400
css = css.replace(/--border: rgba\(255, 255, 255, 0.15\);/g, '--border: #e2e8f0;'); // Slate 200

// Shadows and Text Shadows - remove neon
css = css.replace(/--text-shadow-glow: 0 0 15px rgba\(139, 92, 246, 0.3\), 0 2px 4px rgba\(0, 0, 0, 0.8\);/g, '--text-shadow-glow: none;');
css = css.replace(/--text-shadow-[^;]+;/g, 'none;');
css = css.replace(/text-shadow: [^;]+;/g, 'text-shadow: none;');

css = css.replace(/--shadow-sm: 0 4px 10px rgba\(0, 0, 0, 0.5\);/g, '--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);');
css = css.replace(/--shadow-md: [^;]+;/g, '--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);');
css = css.replace(/--shadow-lg: [^;]+;/g, '--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);');
css = css.replace(/--shadow-glow: [^;]+;/g, '--shadow-glow: none;');

css = css.replace(/--glass-bg: rgba\(24, 24, 27, 0.65\);/g, '--glass-bg: rgba(255, 255, 255, 0.8);');
css = css.replace(/--glass-border: rgba\(255, 255, 255, 0.08\);/g, '--glass-border: rgba(0, 0, 0, 0.05);');

// Fonts
css = css.replace(/font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;/g, "font-family: 'Inter', system-ui, -apple-system, sans-serif;");
css = css.replace(/font-family: 'Outfit', sans-serif;/g, "font-family: 'Inter', sans-serif;");
css = css.replace(/font-weight: 900;/g, 'font-weight: 600;');
css = css.replace(/font-weight: 950;/g, 'font-weight: 600;');
css = css.replace(/font-weight: 800;/g, 'font-weight: 600;');

// Fluid background kill
css = css.replace(/animation: fluidBackground 25s ease-in-out infinite alternate;/g, '/* animation removed */');
css = css.replace(/radial-gradient.+?,/g, '');
css = css.replace(/linear-gradient\(to bottom right.+?,/g, '');
css = css.replace(/linear-gradient\(to bottom left.+?;/g, 'none;');


// Color schemes fixes (removing gradients and clipping)
css = css.replace(/-webkit-background-clip: text;/g, '/* removed */');
css = css.replace(/background-clip: text;/g, '/* removed */');
css = css.replace(/-webkit-text-fill-color: transparent;/g, '/* removed */');
css = css.replace(/color: #ffffff;/g, 'color: var(--text-main);');
css = css.replace(/color: #fff;/g, 'color: var(--text-main);');
css = css.replace(/-webkit-text-fill-color: #f1f5f9;/g, '-webkit-text-fill-color: var(--text-main);');
css = css.replace(/-webkit-text-fill-color: #a5b4fc !important;/g, '-webkit-text-fill-color: var(--text-main) !important;');

// Text gradients 
css = css.replace(/background: linear-gradient[^;]+;/g, 'background: none;');
css = css.replace(/background: var\(--gradient-text\);/g, 'background: none;');
css = css.replace(/--gradient-text: [^;]+;/g, '--gradient-text: none;');
css = css.replace(/--gradient-neon: [^;]+;/g, '--gradient-neon: none;');

// Fix buttons
css = css.replace(/color: white;/g, 'color: var(--text-main);');
css = css.replace(/background-color: transparent;/g, 'background-color: transparent;');

// Fix forms
css = css.replace(/background-color: rgba\(15, 15, 25, 0.7\);/g, 'background-color: var(--surface);');
css = css.replace(/color: #a5b4fc !important;/g, 'color: var(--text-main) !important;');
css = css.replace(/background-color: rgba\(20, 15, 40, 0.9\);/g, 'background-color: var(--surface-hover);');

fs.writeFileSync(cssPath, css);
console.log('CSS Overhaul script completed.');
