import React from 'react';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';
import { useTheme } from './ThemeContext';

// Array of dynamic design variations
const designVariations = [
  {
    headerGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
    accentColor: "#8b5cf6",
    securityNoticeBg: "linear-gradient(to right, #fff5f5 0%, #fff 100%)",
    securityNoticeBorder: "linear-gradient(to bottom, #ef4444 0%, #f87171 100%)",
    securityNoticeColor: "#dc2626",
    tableBg: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
    headerEmojis: ["🌐", "👤", "🔑"],
    vaultEmoji: "🔐",
    securityEmoji: "⚠️",
    tipEmoji: "💡",
    footerEmoji: "🛡️",
    bestPracticesBg: "linear-gradient(to right, #f0f9ff 0%, #fff 100%)",
    bestPracticesColor: "#075985",
    footerBg: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
  },
  {
    headerGradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    accentColor: "#059669",
    securityNoticeBg: "linear-gradient(to right, #f0fdf4 0%, #fff 100%)",
    securityNoticeBorder: "linear-gradient(to bottom, #16a34a 0%, #4ade80 100%)",
    securityNoticeColor: "#16a34a",
    tableBg: "linear-gradient(90deg, #047857 0%, #10b981 100%)",
    headerEmojis: ["🔗", "📧", "🔒"],
    vaultEmoji: "🏛️",
    securityEmoji: "🔰",
    tipEmoji: "📝",
    footerEmoji: "🔰",
    bestPracticesBg: "linear-gradient(to right, #ecfdf5 0%, #fff 100%)",
    bestPracticesColor: "#065f46",
    footerBg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
  },
  {
    headerGradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
    accentColor: "#ea580c",
    securityNoticeBg: "linear-gradient(to right, #fff7ed 0%, #fff 100%)",
    securityNoticeBorder: "linear-gradient(to bottom, #ea580c 0%, #fb923c 100%)",
    securityNoticeColor: "#c2410c",
    tableBg: "linear-gradient(90deg, #c2410c 0%, #ea580c 100%)",
    headerEmojis: ["📱", "🔤", "🗝️"],
    vaultEmoji: "💎",
    securityEmoji: "⚡",
    tipEmoji: "📌",
    footerEmoji: "🔶",
    bestPracticesBg: "linear-gradient(to right, #fff7ed 0%, #fff 100%)",
    bestPracticesColor: "#9a3412",
    footerBg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
  },
  {
    headerGradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
    accentColor: "#0284c7",
    securityNoticeBg: "linear-gradient(to right, #f0f9ff 0%, #fff 100%)",
    securityNoticeBorder: "linear-gradient(to bottom, #0284c7 0%, #38bdf8 100%)",
    securityNoticeColor: "#0369a1",
    tableBg: "linear-gradient(90deg, #0369a1 0%, #0ea5e9 100%)",
    headerEmojis: ["🌊", "📩", "🔑"],
    vaultEmoji: "🗄️",
    securityEmoji: "🚨",
    tipEmoji: "🔍",
    footerEmoji: "🌊",
    bestPracticesBg: "linear-gradient(to right, #ecfeff 0%, #fff 100%)",
    bestPracticesColor: "#0c4a6e",
    footerBg: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
  },
  {
    headerGradient: "linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)",
    accentColor: "#db2777",
    securityNoticeBg: "linear-gradient(to right, #fdf2f8 0%, #fff 100%)",
    securityNoticeBorder: "linear-gradient(to bottom, #db2777 0%, #f472b6 100%)",
    securityNoticeColor: "#be185d",
    tableBg: "linear-gradient(90deg, #be185d 0%, #ec4899 100%)",
    headerEmojis: ["🔖", "👩‍💻", "🗂️"],
    vaultEmoji: "👑",
    securityEmoji: "🛑",
    tipEmoji: "✨",
    footerEmoji: "💗",
    bestPracticesBg: "linear-gradient(to right, #fdf2f8 0%, #fff 100%)",
    bestPracticesColor: "#9d174d",
    footerBg: "linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)"
  }
];

// Array of security tips variants
const securityTipsVariants = [
  [
    "Use a minimum of 12 characters mixing letters, numbers, and symbols",
    "Avoid using the same password for multiple accounts",
    "Consider using a password manager to generate and store complex passwords",
    "Enable two-factor authentication wherever possible"
  ],
  [
    "Create unique passwords for all important accounts, especially financial ones",
    "Avoid using personal information in your passwords that could be easily guessed",
    "Update critical passwords every 3-6 months for optimal security",
    "Consider using passkeys where available for enhanced security"
  ],
  [
    "Use password phrases instead of single words for better security",
    "Check if your accounts have been compromised on haveibeenpwned.com",
    "Keep your password manager software updated to the latest version",
    "Avoid storing passwords in plaintext files or unsecured notes"
  ],
  [
    "Consider using a hardware security key for critical accounts",
    "Use different email addresses for critical vs casual accounts",
    "Be cautious about saving passwords in browsers on shared computers",
    "Remember that length matters more than complexity for password strength"
  ],
  [
    "Never share passwords via email, text, or messaging platforms",
    "Avoid connecting to sensitive accounts on public WiFi networks",
    "Use biometric authentication alongside passwords when available",
    "Create a secure backup strategy for your password manager"
  ]
];

// Array of security notice variants
const securityNoticeVariants = [
  [
    "Store this document in a protected, encrypted location",
    "Never share this file via unsecured channels",
    "Consider using a hardware key or password manager for enhanced security"
  ],
  [
    "This document contains sensitive information - keep it secure",
    "Use encrypted storage for this backup file",
    "Delete this file when no longer needed"
  ],
  [
    "Treat this document with the same security as your financial records",
    "Consider password-protecting this PDF file for added security",
    "Avoid printing this document unless absolutely necessary"
  ],
  [
    "Store this backup only on devices with full-disk encryption",
    "Regularly check for unauthorized access to your storage locations",
    "Consider using an air-gapped device for highest security needs"
  ],
  [
    "This file contains your digital identity credentials",
    "Use secure cloud storage with 2FA for backups",
    "Review this document periodically to remove obsolete accounts"
  ]
];

const ExportPDF = ({ passwords }) => {
  const { currentTheme } = useTheme();

  const generatePDF = () => {
    if (!passwords || passwords.length === 0) {
      toast.warning('No passwords to export!', {
        description: 'Add some passwords first',
        duration: 3000
      });
      return;
    }

    // Select a random design variation
    const randomDesign = designVariations[Math.floor(Math.random() * designVariations.length)];
    
    // Select random security tips and notices
    const randomSecurityTips = securityTipsVariants[Math.floor(Math.random() * securityTipsVariants.length)];
    const randomSecurityNotice = securityNoticeVariants[Math.floor(Math.random() * securityNoticeVariants.length)];
    
    // Generate a pattern ID to make the design unique
    const patternId = Math.floor(Math.random() * 5) + 1;
    
    const content = document.createElement('div');
    
    // Get current date in a nicer format
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Generate unique background pattern elements
    let patternElements = '';
    if (patternId === 1) {
      patternElements = `
        <div style="position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; border-radius: 50%; opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 50px; left: 10px; width: 150px; height: 150px; border-radius: 50%; opacity: 0.05; background: ${randomDesign.accentColor};"></div>
      `;
    } else if (patternId === 2) {
      patternElements = `
        <div style="position: absolute; top: 10px; right: 10px; width: 200px; height: 3px; opacity: 0.2; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; top: 20px; right: 10px; width: 150px; height: 3px; opacity: 0.2; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; top: 30px; right: 10px; width: 100px; height: 3px; opacity: 0.2; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 30px; left: 10px; width: 100px; height: 3px; opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 20px; left: 10px; width: 150px; height: 3px; opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 10px; left: 10px; width: 200px; height: 3px; opacity: 0.1; background: ${randomDesign.accentColor};"></div>
      `;
    } else if (patternId === 3) {
      patternElements = `
        <div style="position: absolute; top: 20px; left: 20px; width: 20px; height: 20px; transform: rotate(45deg); opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; top: 60px; left: 40px; width: 15px; height: 15px; transform: rotate(45deg); opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; top: 90px; left: 20px; width: 10px; height: 10px; transform: rotate(45deg); opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 20px; right: 20px; width: 20px; height: 20px; transform: rotate(45deg); opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 60px; right: 40px; width: 15px; height: 15px; transform: rotate(45deg); opacity: 0.1; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 90px; right: 20px; width: 10px; height: 10px; transform: rotate(45deg); opacity: 0.1; background: ${randomDesign.accentColor};"></div>
      `;
    } else if (patternId === 4) {
      patternElements = `
        <div style="position: absolute; top: 10px; left: 0; width: 100%; height: 5px; opacity: 0.05; background: repeating-linear-gradient(90deg, ${randomDesign.accentColor}, ${randomDesign.accentColor} 10px, transparent 10px, transparent 20px);"></div>
        <div style="position: absolute; bottom: 10px; left: 0; width: 100%; height: 5px; opacity: 0.05; background: repeating-linear-gradient(90deg, ${randomDesign.accentColor}, ${randomDesign.accentColor} 10px, transparent 10px, transparent 20px);"></div>
      `;
    } else {
      patternElements = `
        <div style="position: absolute; top: 20px; left: 20px; width: 40px; height: 40px; border-radius: 50%; border: 3px solid ${randomDesign.accentColor}; opacity: 0.1;"></div>
        <div style="position: absolute; top: 80px; left: 40px; width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${randomDesign.accentColor}; opacity: 0.1;"></div>
        <div style="position: absolute; bottom: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; border: 3px solid ${randomDesign.accentColor}; opacity: 0.1;"></div>
        <div style="position: absolute; bottom: 80px; right: 40px; width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${randomDesign.accentColor}; opacity: 0.1;"></div>
      `;
    }
    
    // Generate a unique document ID for security tracking
    const documentId = `VLT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    content.innerHTML = `
      <div style="padding: 40px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%); position: relative; overflow: hidden;">
        ${patternElements}
        
        <!-- Header section with a modern gradient card look -->
        <div style="text-align: center; margin-bottom: 35px; background: ${randomDesign.headerGradient}; border-radius: 12px; padding: 25px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);">
          <h1 style="color: white; font-size: 32px; margin: 0; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${randomDesign.vaultEmoji} Shivam's Vault
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 15px; font-size: 16px; font-weight: 400;">
            Password Backup • Generated on ${formattedDate}
          </p>
          <div style="width: 60px; height: 4px; background-color: rgba(255,255,255,0.5); margin: 0 auto;"></div>
        </div>

        <!-- Enhanced Security Notice with modern design -->
        <div style="margin: 0 auto 35px; background: ${randomDesign.securityNoticeBg}; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); overflow: hidden; display: flex;">
          <div style="width: 8px; background: ${randomDesign.securityNoticeBorder};"></div>
          <div style="padding: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 24px; margin-right: 10px;">${randomDesign.securityEmoji}</span>
              <h3 style="color: ${randomDesign.securityNoticeColor}; font-size: 18px; margin: 0; font-weight: 600;">SECURITY NOTICE</h3>
            </div>
            <ul style="color: ${randomDesign.securityNoticeColor}; font-size: 14px; margin: 10px 0 0; padding-left: 20px; line-height: 1.5;">
              ${randomSecurityNotice.map(notice => `<li>${notice}</li>`).join('')}
            </ul>
            <div style="margin-top: 10px; background: rgba(0,0,0,0.03); border-radius: 6px; padding: 8px; font-size: 13px; color: ${randomDesign.securityNoticeColor};">
              Document ID: <strong>${documentId}</strong>
            </div>
          </div>
        </div>

        <!-- Stylized table with multiple colors for categories -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); border-radius: 12px; overflow: hidden;">
          <thead>
            <tr style="background: ${randomDesign.tableBg}; color: white;">
              <th style="padding: 16px 20px; text-align: left; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 18px; margin-right: 8px;">${randomDesign.headerEmojis[0]}</span>Platform
                </div>
              </th>
              <th style="padding: 16px 20px; text-align: left; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 18px; margin-right: 8px;">${randomDesign.headerEmojis[1]}</span>Username
                </div>
              </th>
              <th style="padding: 16px 20px; text-align: left; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 18px; margin-right: 8px;">${randomDesign.headerEmojis[2]}</span>Password
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${passwords.map((item, index) => {
              // Determine category color based on site name (keeping consistent branding for sites)
              let categoryColor, categoryBg;
              const siteLower = item.site.toLowerCase();
              
              if (siteLower.includes('google') || siteLower.includes('gmail')) {
                categoryColor = '#ea4335';
                categoryBg = 'rgba(234, 67, 53, 0.07)';
              } else if (siteLower.includes('facebook') || siteLower.includes('meta')) {
                categoryColor = '#1877f2';
                categoryBg = 'rgba(24, 119, 242, 0.07)';
              } else if (siteLower.includes('apple') || siteLower.includes('icloud')) {
                categoryColor = '#555555';
                categoryBg = 'rgba(85, 85, 85, 0.07)';
              } else if (siteLower.includes('amazon')) {
                categoryColor = '#ff9900';
                categoryBg = 'rgba(255, 153, 0, 0.07)';
              } else if (siteLower.includes('microsoft') || siteLower.includes('outlook')) {
                categoryColor = '#00a4ef';
                categoryBg = 'rgba(0, 164, 239, 0.07)';
              } else if (siteLower.includes('twitter') || siteLower.includes('x.com')) {
                categoryColor = '#1da1f2';
                categoryBg = 'rgba(29, 161, 242, 0.07)';
              } else if (siteLower.includes('instagram')) {
                categoryColor = '#c13584';
                categoryBg = 'rgba(193, 53, 132, 0.07)';
              } else if (siteLower.includes('linkedin')) {
                categoryColor = '#0077b5';
                categoryBg = 'rgba(0, 119, 181, 0.07)';
              } else if (index % 5 === 0) {
                categoryColor = '#10b981'; // Green
                categoryBg = 'rgba(16, 185, 129, 0.07)';
              } else if (index % 5 === 1) {
                categoryColor = '#6366f1'; // Indigo
                categoryBg = 'rgba(99, 102, 241, 0.07)';
              } else if (index % 5 === 2) {
                categoryColor = '#f59e0b'; // Amber
                categoryBg = 'rgba(245, 158, 11, 0.07)';
              } else if (index % 5 === 3) {
                categoryColor = '#8b5cf6'; // Purple
                categoryBg = 'rgba(139, 92, 246, 0.07)';
              } else {
                categoryColor = '#ec4899'; // Pink
                categoryBg = 'rgba(236, 72, 153, 0.07)';
              }
              
              return `
                <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#fafafa'}; border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 14px 20px; font-size: 14px; color: ${categoryColor}; font-weight: 500; background: ${categoryBg}; border-right: 1px solid #f3f4f6;">${item.site}</td>
                  <td style="padding: 14px 20px; font-size: 14px; color: #374151; border-right: 1px solid #f3f4f6;">${item.username}</td>
                  <td style="padding: 14px 20px; font-size: 14px; font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace; color: #111827; background-color: #f9fafb; letter-spacing: 0.5px; font-weight: 500;">${item.password}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Password strength legend -->
        <div style="margin: 0 auto 35px; background: ${randomDesign.bestPracticesBg}; border-radius: 12px; padding: 15px 20px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);">
          <div style="font-weight: 600; color: ${randomDesign.bestPracticesColor}; margin-bottom: 10px; display: flex; align-items: center;">
            <span style="font-size: 18px; margin-right: 8px;">${randomDesign.tipEmoji}</span>Password Best Practices
          </div>
          <ul style="color: ${randomDesign.bestPracticesColor}; font-size: 13px; margin: 0; padding-left: 25px; line-height: 1.6;">
            ${randomSecurityTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>

        <!-- Footer with branding -->
        <div style="margin-top: 30px; padding: 25px 20px; text-align: center; background: ${randomDesign.footerBg}; border-radius: 12px;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            <span style="font-size: 24px; margin-right: 10px;">${randomDesign.footerEmoji}</span>
            <p style="color: #4b5563; font-size: 16px; font-weight: 600; margin: 0;">
              Shivam's Vault • Your Secure Password Manager
            </p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin: 0; max-width: 400px; margin: 0 auto;">
            For security purposes, please update your passwords regularly and enable two-factor authentication where available.
          </p>
          <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
            Generated: ${formattedDate} • ID: ${documentId.slice(0, 6)}
          </p>
        </div>
      </div>
    `;

    const opt = {
      margin: [10, 10],
      filename: `vault_passwords_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
        logging: false, 
        useCORS: true,
        letterRendering: true,
        allowTaint: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        hotfixes: ["px_scaling"]
      }
    };

    // Show generating toast
    const loadingToast = toast.loading('Generating your password backup...', {
      description: 'Please wait while we prepare your vault backup',
      duration: 10000
    });
    
    html2pdf().set(opt).from(content).save()
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success('Vault backup created! ✅', {
          description: 'Your passwords have been securely exported to PDF',
          duration: 5000,
          icon: '🔐'
        });
      })
      .catch(error => {
        toast.dismiss(loadingToast);
        console.error('PDF generation failed:', error);
        toast.error('Export failed', {
          description: 'Unable to create your vault backup. Please try again.',
          duration: 5000,
          icon: '❌'
        });
      });
  };

  return (
    <button
      onClick={generatePDF}
      className={`flex items-center gap-2 px-5 py-2.5 ${currentTheme.colors.buttonBg} text-white 
        rounded-lg ${currentTheme.colors.buttonHover} ${currentTheme.animation.transition} 
        ${currentTheme.animation.button} shadow-md hover:shadow-lg`}
      aria-label="Export passwords to PDF"
    >
      <span className="flex items-center">
        <span className="mr-2 text-lg">🔐</span>
        <span>Export Passwords [PDF]</span>
      </span>
    </button>
  );
};

export default ExportPDF;
