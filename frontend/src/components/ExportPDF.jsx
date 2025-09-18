import jsPDF from 'jspdf';

const ExportPDF = ({ passwords }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Set up the document
    doc.setFontSize(20);
    doc.text('SecureVault - Password Export', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Total Entries: ${passwords.length}`, 20, 55);
    
    // Add a line
    doc.line(20, 65, 190, 65);
    
    let yPosition = 80;
    
    passwords.forEach((password, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${password.website}`, 20, yPosition);
      
      doc.setFontSize(10);
      doc.text(`Username: ${password.username}`, 25, yPosition + 10);
      doc.text(`Password: ${password.password}`, 25, yPosition + 20); // Changed from '*'.repeat() to actual password
      
      yPosition += 35;
    });
    
    doc.save('passwords.pdf');
  };

  return (
    <button
      onClick={exportToPDF}
      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-source-code"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      Export PDF
    </button>
  );
};

export default ExportPDF;