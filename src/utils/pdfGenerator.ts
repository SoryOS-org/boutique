import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

export const generateOrderReceiptPDF = (order: Order) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text('Reçu de Commande - SoryOS', 14, 22);
  
  doc.setFontSize(10);
  doc.text(`ID Commande: ${order.id}`, 14, 30);
  doc.text(`Date: ${order.date}`, 14, 35);
  doc.text(`Suivi: ${order.trackingNumber}`, 14, 40);

  // Customer Info
  doc.text('Informations client:', 14, 50);
  doc.text(`${order.customer.fullName}`, 14, 55);
  doc.text(`${order.customer.email}`, 14, 60);
  doc.text(`${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}`, 14, 65);

  // Items Table
  const tableData = order.items.map(item => [
    item.product.name,
    item.quantity.toString(),
    `${item.product.priceEUR.toFixed(2)} €`
  ]);

  autoTable(doc, {
    startY: 75,
    head: [['Produit', 'Quantité', 'Prix']],
    body: tableData,
    foot: [['', 'Total', `${order.totalEUR.toFixed(2)} €`]],
  });

  // Footer
  doc.text('Merci pour votre confiance !', 14, (doc as any).lastAutoTable.finalY + 10);

  doc.save(`reçu_${order.id}.pdf`);
};
