import React from 'react';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';
import { useTheme } from './ThemeContext';

// Array of dynamic design variations with glassmorphism effects
const designVariations = [
  {
    headerGradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(217, 70, 239, 0.85) 100%)",
    accentColor: "#8b5cf6",
    securityNoticeBg: "rgba(255, 255, 255, 0.7)",
    securityNoticeBorder: "linear-gradient(to bottom, rgba(239, 68, 68, 0.8) 0%, rgba(248, 113, 113, 0.8) 100%)",
    securityNoticeColor: "#dc2626",
    tableBg: "linear-gradient(90deg, rgba(79, 70, 229, 0.85) 0%, rgba(124, 58, 237, 0.85) 100%)",
    tableRowBg1: "rgba(255, 255, 255, 0.6)",
    tableRowBg2: "rgba(255, 255, 255, 0.8)",
    headerEmojis: ["🌐", "👤", "🔑"],
    vaultEmoji: "🔐",
    securityEmoji: "⚠️",
    
    footerEmoji: "🛡️",
   
    footerBg: "rgba(243, 244, 246, 0.7)"
  },
  {
    headerGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.85) 0%, rgba(5, 150, 105, 0.85) 50%, rgba(4, 120, 87, 0.85) 100%)",
    accentColor: "#059669",
    securityNoticeBg: "rgba(255, 255, 255, 0.7)",
    securityNoticeBorder: "linear-gradient(to bottom, rgba(22, 163, 74, 0.8) 0%, rgba(74, 222, 128, 0.8) 100%)",
    securityNoticeColor: "#16a34a",
    tableBg: "linear-gradient(90deg, rgba(4, 120, 87, 0.85) 0%, rgba(16, 185, 129, 0.85) 100%)",
    tableRowBg1: "rgba(255, 255, 255, 0.6)",
    tableRowBg2: "rgba(255, 255, 255, 0.8)",
    headerEmojis: ["🔗", "📧", "🔒"],
    vaultEmoji: "🏛️",
    securityEmoji: "🔰",
    footerEmoji: "🔰",
   
    footerBg: "rgba(240, 253, 244, 0.7)"
  },
  {
    headerGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.85) 0%, rgba(234, 88, 12, 0.85) 50%, rgba(194, 65, 12, 0.85) 100%)",
    accentColor: "#ea580c",
    securityNoticeBg: "rgba(255, 255, 255, 0.7)",
    securityNoticeBorder: "linear-gradient(to bottom, rgba(234, 88, 12, 0.8) 0%, rgba(251, 146, 60, 0.8) 100%)",
    securityNoticeColor: "#c2410c",
    tableBg: "linear-gradient(90deg, rgba(194, 65, 12, 0.85) 0%, rgba(234, 88, 12, 0.85) 100%)",
    tableRowBg1: "rgba(255, 255, 255, 0.6)",
    tableRowBg2: "rgba(255, 255, 255, 0.8)",
    headerEmojis: ["📱", "🔤", "🗝️"],
    vaultEmoji: "💎",
    securityEmoji: "⚡",
    footerEmoji: "🔶",
   
    footerBg: "rgba(255, 247, 237, 0.7)"
  },
  {
    headerGradient: "linear-gradient(135deg, rgba(14, 165, 233, 0.85) 0%, rgba(2, 132, 199, 0.85) 50%, rgba(3, 105, 161, 0.85) 100%)",
    accentColor: "#0284c7",
    securityNoticeBg: "rgba(255, 255, 255, 0.7)",
    securityNoticeBorder: "linear-gradient(to bottom, rgba(2, 132, 199, 0.8) 0%, rgba(56, 189, 248, 0.8) 100%)",
    securityNoticeColor: "#0369a1",
    tableBg: "linear-gradient(90deg, rgba(3, 105, 161, 0.85) 0%, rgba(14, 165, 233, 0.85) 100%)",
    tableRowBg1: "rgba(255, 255, 255, 0.6)",
    tableRowBg2: "rgba(255, 255, 255, 0.8)",
    headerEmojis: ["🌊", "📩", "🔑"],
    vaultEmoji: "🗄️",
    securityEmoji: "🚨",
    footerEmoji: "🌊",
  
    footerBg: "rgba(240, 249, 255, 0.7)"
  },
  {
    headerGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.85) 0%, rgba(219, 39, 119, 0.85) 50%, rgba(190, 24, 93, 0.85) 100%)",
    accentColor: "#db2777",
    securityNoticeBg: "rgba(255, 255, 255, 0.7)",
    securityNoticeBorder: "linear-gradient(to bottom, rgba(219, 39, 119, 0.8) 0%, rgba(244, 114, 182, 0.8) 100%)",
    securityNoticeColor: "#be185d",
    tableBg: "linear-gradient(90deg, rgba(190, 24, 93, 0.85) 0%, rgba(236, 72, 153, 0.85) 100%)",
    tableRowBg1: "rgba(255, 255, 255, 0.6)",
    tableRowBg2: "rgba(255, 255, 255, 0.8)",
    headerEmojis: ["🔖", "👩‍💻", "🗂️"],
    vaultEmoji: "👑",
    securityEmoji: "🛑",
    footerEmoji: "💗",
    
    footerBg: "rgba(253, 242, 248, 0.7)"
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
    
    // Generate unique background pattern elements for glassmorphism effect
    let patternElements = '';
    if (patternId === 1) {
      patternElements = `
        <div style="position: absolute; top: -50px; right: -50px; width: 300px; height: 300px; border-radius: 50%; opacity: 0.06; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: -100px; left: -100px; width: 400px; height: 400px; border-radius: 50%; opacity: 0.04; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; top: 40%; left: -30px; width: 120px; height: 120px; border-radius: 50%; opacity: 0.08; background: ${randomDesign.accentColor};"></div>
      `;
    } else if (patternId === 2) {
      patternElements = `
        <div style="position: absolute; top: -30px; right: 10%; width: 200px; height: 200px; transform: rotate(45deg); opacity: 0.05; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: 20%; left: -50px; width: 250px; height: 250px; transform: rotate(30deg); opacity: 0.04; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; top: 60%; right: -30px; width: 150px; height: 150px; transform: rotate(15deg); opacity: 0.06; background: ${randomDesign.accentColor};"></div>
      `;
    } else if (patternId === 3) {
      patternElements = `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(45deg, ${randomDesign.accentColor}, ${randomDesign.accentColor} 1px, transparent 1px, transparent 20px); opacity: 0.03;"></div>
        <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; border-radius: 50%; opacity: 0.05; background: ${randomDesign.accentColor};"></div>
        <div style="position: absolute; bottom: -50px; left: 20%; width: 200px; height: 200px; border-radius: 50%; opacity: 0.04; background: ${randomDesign.accentColor};"></div>
      `;
    } else if (patternId === 4) {
      patternElements = `
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 20%, ${randomDesign.accentColor} 0%, transparent 40%); opacity: 0.03;"></div>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 80% 80%, ${randomDesign.accentColor} 0%, transparent 40%); opacity: 0.03;"></div>
      `;
    } else {
      patternElements = `
        <div style="position: absolute; top: -50px; left: -50px; width: 40%; height: 40%; background: linear-gradient(45deg, ${randomDesign.accentColor}, transparent); opacity: 0.03;"></div>
        <div style="position: absolute; bottom: -50px; right: -50px; width: 40%; height: 40%; background: linear-gradient(225deg, ${randomDesign.accentColor}, transparent); opacity: 0.03;"></div>
        <div style="position: absolute; top: 30%; right: -30px; width: 150px; height: 150px; border-radius: 50%; opacity: 0.05; background: ${randomDesign.accentColor};"></div>
      `;
    }
    
    // Generate a unique document ID for security tracking
    const documentId = `VLT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    content.innerHTML = `
      <div style="padding: 40px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; 
        background: linear-gradient(135deg, rgba(250, 250, 250, 0.9) 0%, rgba(245, 245, 245, 0.9) 100%); 
        position: relative; overflow: hidden;">
        ${patternElements}
        
        <!-- Header section with glassmorphic effect -->
        <div style="text-align: center; margin-bottom: 35px; background: ${randomDesign.headerGradient}; 
          border-radius: 16px; padding: 25px; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2); 
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); 
          border: 1px solid rgba(255, 255, 255, 0.18);">
          <h1 style="color: white; font-size: 32px; margin: 0; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${randomDesign.vaultEmoji} Shivam's Vault
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 15px; font-size: 16px; font-weight: 400;">
            Password Backup • Generated on ${formattedDate}
          </p>
          <div style="width: 60px; height: 4px; background-color: rgba(255,255,255,0.5); margin: 0 auto;"></div>
        </div>

        <!-- Glassmorphic Security Notice -->
        <div style="margin: 0 auto 30px; background: ${randomDesign.securityNoticeBg}; 
          border-radius: 12px; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1); 
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); 
          border: 1px solid rgba(255, 255, 255, 0.2); overflow: hidden; display: flex;">
          <div style="width: 5px; background: ${randomDesign.securityNoticeBorder};"></div>
          <div style="padding: 16px 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 18px; margin-right: 8px;">${randomDesign.securityEmoji}</span>
              <h3 style="color: ${randomDesign.securityNoticeColor}; font-size: 16px; margin: 0; font-weight: 600;">SECURITY NOTICE</h3>
            </div>
            <ul style="color: ${randomDesign.securityNoticeColor}; opacity: 0.9; font-size: 13px; margin: 5px 0 0; padding-left: 18px; line-height: 1.4;">
              ${randomSecurityNotice.map(notice => `<li>${notice}</li>`).join('')}
            </ul>
            <div style="margin-top: 8px; background: rgba(255, 255, 255, 0.3); border-radius: 8px; 
              padding: 6px 10px; font-size: 12px; color: ${randomDesign.securityNoticeColor}; 
              backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
              border: 1px solid rgba(255, 255, 255, 0.2);">
              Document ID: <strong>${documentId}</strong>
            </div>
          </div>
        </div>

        <!-- Glassmorphic table -->
        <div style="margin-bottom: 30px; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15); 
          border-radius: 16px; overflow: hidden; backdrop-filter: blur(6px); 
          -webkit-backdrop-filter: blur(6px); border: 1px solid rgba(255, 255, 255, 0.18);">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
            <thead>
              <tr style="background: ${randomDesign.tableBg};">
                <th style="padding: 16px 20px; text-align: left; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; color: white;">
                  <div style="display: flex; align-items: center;">
                    <span style="font-size: 18px; margin-right: 8px;">${randomDesign.headerEmojis[0]}</span>Platform
                  </div>
                </th>
                <th style="padding: 16px 20px; text-align: left; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; color: white;">
                  <div style="display: flex; align-items: center;">
                    <span style="font-size: 18px; margin-right: 8px;">${randomDesign.headerEmojis[1]}</span>Username
                  </div>
                </th>
                <th style="padding: 16px 20px; text-align: left; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; color: white;">
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
                  categoryBg = 'rgba(234, 67, 53, 0.05)';
                } else if (siteLower.includes('facebook') || siteLower.includes('meta')) {
                  categoryColor = '#1877f2';
                  categoryBg = 'rgba(24, 119, 242, 0.05)';
                } else if (siteLower.includes('apple') || siteLower.includes('icloud')) {
                  categoryColor = '#555555';
                  categoryBg = 'rgba(85, 85, 85, 0.05)';
                } else if (siteLower.includes('amazon')) {
                  categoryColor = '#ff9900';
                  categoryBg = 'rgba(255, 153, 0, 0.05)';
                } else if (siteLower.includes('microsoft') || siteLower.includes('outlook')) {
                  categoryColor = '#00a4ef';
                  categoryBg = 'rgba(0, 164, 239, 0.05)';
                } else if (siteLower.includes('twitter') || siteLower.includes('x.com')) {
                  categoryColor = '#1da1f2';
                  categoryBg = 'rgba(29, 161, 242, 0.05)';
                } else if (siteLower.includes('instagram')) {
                  categoryColor = '#c13584';
                  categoryBg = 'rgba(193, 53, 132, 0.05)';
                } else if (siteLower.includes('linkedin')) {
                  categoryColor = '#0077b5';
                  categoryBg = 'rgba(0, 119, 181, 0.05)';
                } else if (index % 5 === 0) {
                  categoryColor = '#10b981'; // Green
                  categoryBg = 'rgba(16, 185, 129, 0.05)';
                } else if (index % 5 === 1) {
                  categoryColor = '#6366f1'; // Indigo
                  categoryBg = 'rgba(99, 102, 241, 0.05)';
                } else if (index % 5 === 2) {
                  categoryColor = '#f59e0b'; // Amber
                  categoryBg = 'rgba(245, 158, 11, 0.05)';
                } else if (index % 5 === 3) {
                  categoryColor = '#8b5cf6'; // Purple
                  categoryBg = 'rgba(139, 92, 246, 0.05)';
                } else {
                  categoryColor = '#ec4899'; // Pink
                  categoryBg = 'rgba(236, 72, 153, 0.05)';
                }
                
                return `
                  <tr style="background: ${index % 2 === 0 ? randomDesign.tableRowBg1 : randomDesign.tableRowBg2};">
                    <td style="padding: 14px 20px; font-size: 14px; color: ${categoryColor}; font-weight: 500; 
                      background: ${categoryBg}; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); 
                      border-bottom: 1px solid rgba(255, 255, 255, 0.3);">
                      ${item.site}
                    </td>
                    <td style="padding: 14px 20px; font-size: 14px; color: #374151; 
                      border-bottom: 1px solid rgba(255, 255, 255, 0.3);">
                      ${item.username}
                    </td>
                    <td style="padding: 14px 20px; font-size: 14px; font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace; 
                      color: #111827; background-color: rgba(249, 250, 251, 0.7); letter-spacing: 0.5px; font-weight: 500;
                      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                      border-bottom: 1px solid rgba(255, 255, 255, 0.3);">
                      ${item.password}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Glassmorphic footer -->
        <div style="margin-top: 30px; padding: 22px 20px; text-align: center; background: ${randomDesign.footerBg}; 
          border-radius: 16px; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1); 
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); 
          border: 1px solid rgba(255, 255, 255, 0.18);">
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
