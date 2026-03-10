import fs from 'fs';
import path from 'path';

const cssPath = path.join('e:', 'exam-seating-system', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Force High Contrast Text Colors
css = css.replace(/--text-main: #0f172a;/g, '--text-main: #ffffff;'); // Revert main text back to bright white
css = css.replace(/--text-muted: #475569;/g, '--text-muted: #e2e8f0;'); // Light slate for muted
css = css.replace(/--text-dim: #94a3b8;/g, '--text-dim: #cbd5e1;'); // Slate 300

// 2. Add stark, elegant drop-shadows to ALL text to prevent any background blending
css = css.replace(/--text-shadow-glow: none;/g, '--text-shadow-glow: 0 2px 4px rgba(0, 0, 0, 0.7);');
css = css.replace(/--text-shadow-[^;]+;/g, '--text-shadow-premium: 0 4px 6px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.5);');

// 3. Make the background deep and solid to contrast with the text
css = css.replace(/--background: #f8fafc;/g, '--background: #0f172a;'); // Slate 900
css = css.replace(/--surface: #ffffff;/g, '--surface: rgba(30, 41, 59, 0.7);'); // Frosted slate 800
css = css.replace(/--surface-hover: #f1f5f9;/g, '--surface-hover: rgba(51, 65, 85, 0.8);'); // Frosted slate 700
css = css.replace(/--glass-bg: rgba\(255, 255, 255, 0.8\);/g, '--glass-bg: rgba(15, 23, 42, 0.6);'); // Dark glass

// 4. Force specific elements that were blending to be white
css = css.replace(/color: rgba\(203, 213, 225, 0.8\);/g, 'color: #ffffff;');
css = css.replace(/color: rgba\(148, 163, 184, 0.7\);/g, 'color: #e2e8f0;');
css = css.replace(/color: #475569;/g, 'color: #f8fafc;'); // Kill any lingering dark gray text

// 5. Update typography font families for a modern aesthetic
css = css.replace(/font-family: 'Inter', system-ui, -apple-system, sans-serif;/g, "font-family: 'Outfit', 'Inter', system-ui, sans-serif;");
css = css.replace(/font-family: 'Inter', sans-serif;/g, "font-family: 'Outfit', sans-serif;");

// 6. Ensure global text shadow is applied
css = css.replace(/text-shadow: none !important;/g, 'text-shadow: 0 1px 3px rgba(0,0,0,0.8) !important;');
css = css.replace(/text-shadow: none;/g, 'text-shadow: 0 1px 3px rgba(0,0,0,0.8);');

// 7. Re-add a subtle, elegant text gradient for heroes
css = css.replace(/--gradient-text: none;/g, '--gradient-text: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);');

// Clean up specific overrides that I made previously which broke the dark mode text
css = css.replace(/color: var\(--text-main\) !important;/g, 'color: #ffffff !important;');

fs.writeFileSync(cssPath, css);
console.log('Typography Overhaul script completed.');
