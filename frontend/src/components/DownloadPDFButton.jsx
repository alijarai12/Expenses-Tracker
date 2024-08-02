import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // for creating tables
import api from '../api';

const DownloadPDFButton = ({ year, month }) => {
  const handleDownload = async () => {
    try {
      // Fetch expenses data from your API
      const tokenString = localStorage.getItem('token');
      if (!tokenString) {
        alert('No token found. Please log in.');
        return;
      }

      const token = JSON.parse(tokenString);
      const response = await api.get(`api/download_expenses_pdf/${year}/${month}`, {
        headers: {
          Authorization: `Bearer ${token.access}`,
          
        },
        responseType: 'arraybuffer',  // Important for handling binary data
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `expenses_${year}_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading or generating PDF:', error);
    }
  };

  return (
    <button onClick={handleDownload}>Download PDF</button>
  );
};

export default DownloadPDFButton;
