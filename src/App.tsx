import { useState } from 'react';
import { Download, Plus, Trash2, Printer, Hexagon, AlignRight } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number | '';
  rate: number | '';
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  projectName: string;
  logo: string | null;
  logoBgColor: string;
  items: InvoiceItem[];
  discount: number | '';
  taxRate: number | '';
  downPayment: number | '';
  notes: string;
  currency: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const formatCurrencyValue = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'IDR' || currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'IDR' || currency === 'JPY' ? 0 : 2,
  }).format(amount);
};

export default function App() {
  const [data, setData] = useState<InvoiceData>({
    invoiceNumber: 'INV-2026-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromName: 'Hastler Studio',
    fromEmail: 'hello@hastler.io',
    fromAddress: '90210 Beverly Hills\nCalifornia, USA',
    toName: 'Acme Corp',
    toEmail: 'billing@acmecorp.com',
    toAddress: '123 Business Avenue\nNew York, NY 10001',
    projectName: 'E-commerce Redesign',
    logo: null,
    logoBgColor: '#000000',
    items: [
      { id: 'item-1', description: 'UI/UX Design', quantity: 40, rate: 85 },
      { id: 'item-2', description: 'Frontend Development', quantity: 60, rate: 95 }
    ],
    discount: 0,
    taxRate: 10,
    downPayment: 0,
    notes: 'Please send payment within 30 days of receiving this invoice. There will be a 5% interest charge per month on late invoices.',
    currency: 'USD'
  });

  const CURRENCIES = [
    { code: 'USD', label: 'USD ($)' },
    { code: 'EUR', label: 'EUR (€)' },
    { code: 'GBP', label: 'GBP (£)' },
    { code: 'IDR', label: 'IDR (Rp)' },
    { code: 'SGD', label: 'SGD (S$)' },
    { code: 'AUD', label: 'AUD (A$)' },
    { code: 'JPY', label: 'JPY (¥)' },
    { code: 'CAD', label: 'CAD (C$)' },
  ];

  const handleInputChange = (field: keyof InvoiceData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { id: generateId(), description: '', quantity: 1, rate: 0 }],
    }));
  };

  const removeItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Calculations
  const subtotal = data.items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );
  const discountAmount = Number(data.discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * (Number(data.taxRate) || 0)) / 100;
  const total = taxableAmount + taxAmount;
  const downPaymentAmount = Number(data.downPayment) || 0;
  const totalDue = Math.max(0, total - downPaymentAmount);

  const formatCurrency = (amount: number) => formatCurrencyValue(amount, data.currency);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#F3F4F6] text-[#111827] font-sans overflow-hidden">
      {/* Left Column: Editor Form */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white border-r border-gray-200 p-6 md:p-8 flex flex-col overflow-y-auto print-hide">
        <div className="flex items-center justify-between mb-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">H</div>
            <span className="text-xl font-bold tracking-tight uppercase">Hastler</span>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Save PDF / Print
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Project Calculator</h2>
          
          <div className="space-y-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Essentials</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Project Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                        value={data.projectName}
                        onChange={(e) => handleInputChange('projectName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Currency</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer"
                        value={data.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Invoice No.</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                        value={data.invoiceNumber}
                        onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                        value={data.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Parties */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">From & To</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                  {/* From */}
                  <div className="space-y-3">
                    <p className="block text-xs font-medium text-gray-500 uppercase mb-2">Your Details (From)</p>
                    <div className="flex gap-3">
                      <div className="relative w-12 h-12 shrink-0 group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        {data.logo ? (
                          <img src={data.logo} alt="Logo" className="w-full h-full object-contain bg-white" />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: data.logoBgColor }}
                          >
                            {(data.fromName || 'H').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                handleInputChange('logo', e.target?.result as string);
                              };
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:flex">
                            <span className="text-white text-[9px] font-bold uppercase tracking-wider">Logo</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <input
                          type="text"
                          placeholder="Company Name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                          value={data.fromName}
                          onChange={(e) => handleInputChange('fromName', e.target.value)}
                        />
                      </div>
                    </div>
                    {!data.logo && (
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Initials Color:</label>
                        <input 
                          type="color" 
                          value={data.logoBgColor} 
                          onChange={(e) => handleInputChange('logoBgColor', e.target.value)}
                          className="h-5 w-5 rounded cursor-pointer border-0 p-0 hover:scale-110 transition-transform"
                        />
                      </div>
                    )}
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      value={data.fromEmail}
                      onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                    />
                    <textarea
                      placeholder="Address"
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                      value={data.fromAddress}
                      onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                    />
                  </div>

                  {/* To */}
                  <div className="space-y-3">
                    <p className="block text-xs font-medium text-gray-500 uppercase mb-2">Client Details (To)</p>
                    <input
                      type="text"
                      placeholder="Client Name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      value={data.toName}
                      onChange={(e) => handleInputChange('toName', e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      value={data.toEmail}
                      onChange={(e) => handleInputChange('toEmail', e.target.value)}
                    />
                    <textarea
                      placeholder="Address"
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                      value={data.toAddress}
                      onChange={(e) => handleInputChange('toAddress', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Line Items */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Service Items</h3>
                  <button
                    onClick={addItem}
                    className="text-xs font-semibold text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    + Add Service
                  </button>
                </div>

                <div className="space-y-3">
                  {data.items.map((item, idx) => (
                    <div key={item.id} className="flex gap-3 relative group">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute -left-6 top-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <input
                        type="text"
                        placeholder="Description"
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Qty"
                        className="w-16 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center outline-none focus:border-blue-500"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value !== '' ? Number(e.target.value) : '')}
                      />
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Rate"
                        className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right outline-none focus:border-blue-500"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, 'rate', e.target.value !== '' ? Number(e.target.value) : '')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Totals Setup */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Totals Setup</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Discount</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      value={data.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value !== '' ? Number(e.target.value) : '')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      value={data.taxRate}
                      onChange={(e) => handleInputChange('taxRate', e.target.value !== '' ? Number(e.target.value) : '')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Down Payment / Deposit</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    value={data.downPayment}
                    onChange={(e) => handleInputChange('downPayment', e.target.value !== '' ? Number(e.target.value) : '')}
                  />
                </div>
              </div>

              {/* Section 5: Notes */}
              <div className="space-y-4 pt-4 border-t border-gray-100 pb-8">
                <h3 className="block text-xs font-medium text-gray-500 uppercase mb-2">Additional Terms</h3>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                  value={data.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-4">
                <div className="flex justify-between items-center bg-black text-white p-4 rounded-xl shadow-lg">
                  <span className="text-sm font-medium">Amount Due</span>
                  <span className="text-xl font-bold">{formatCurrency(totalDue)}</span>
                </div>
              </div>
            </div>
          </div>

        {/* Right Column: Invoice Preview */}
        <div className="invoice-paper-wrapper w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          {/* This wrapper limits max width on desktop but lets print grow */}
          <div className="invoice-paper w-full max-w-[440px] h-auto min-h-[600px] bg-white shadow-2xl rounded-sm p-10 flex flex-col relative transition-all">
            
            {/* Header: Logo & Branding */}
            <div className="flex justify-between items-start mb-12">
              <div className="flex gap-3 items-center">
                {data.logo ? (
                  <img src={data.logo} alt="Logo" className="w-10 h-10 object-contain rounded" />
                ) : (
                  <div 
                    className="w-10 h-10 rounded flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: data.logoBgColor }}
                  >
                    {(data.fromName || 'H').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-1">{data.fromName || 'Hastler'}</h1>
                  <p className="text-[10px] text-gray-400">{data.fromEmail}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Invoice</p>
                <p className="text-xs font-medium">{data.invoiceNumber || '-'}</p>
              </div>
            </div>

            {/* Project & Client */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-[9px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Billed To</p>
                <p className="text-xs font-bold whitespace-pre-wrap">{data.toName || 'Client Name'}</p>
                <p className="text-[10px] text-gray-500 mt-1 whitespace-pre-wrap">{data.toAddress}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Date</p>
                <p className="text-xs">{data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</p>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 mb-12">
              <div className="grid grid-cols-4 border-b border-gray-900 pb-2 mb-4">
                <p className="col-span-3 text-[9px] font-bold uppercase tracking-wider">Description</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-right">Amount</p>
              </div>
              
              <div className="space-y-4">
                {data.items.length === 0 ? (
                  <p className="py-8 text-center text-gray-400 text-[10px] font-medium">No items added yet.</p>
                ) : (
                  data.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-4 group">
                      <div className="col-span-3">
                        <p className="text-xs font-medium">{item.description || '-'}</p>
                        <p className="text-[10px] text-gray-400">{item.quantity} Qty @ {formatCurrency(Number(item.rate) || 0)}</p>
                      </div>
                      <p className="text-xs text-right font-medium">
                        {formatCurrency((Number(item.quantity) || 0) * (Number(item.rate) || 0))}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Summary Box */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Subtotal</span>
                <span className="text-xs font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Discount</span>
                  <span className="text-xs font-medium">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Tax ({(Number(data.taxRate) || 0)}%)</span>
                  <span className="text-xs font-medium">{formatCurrency(taxAmount)}</span>
                </div>
              )}
              {downPaymentAmount > 0 && (
                <div className="flex justify-between items-center mb-4 border-t border-gray-100 pt-4">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Total</span>
                  <span className="text-xs font-medium">{formatCurrency(total)}</span>
                </div>
              )}
              {downPaymentAmount > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Down Payment (DP)</span>
                  <span className="text-xs font-medium text-red-500">-{formatCurrency(downPaymentAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-gray-900 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{downPaymentAmount > 0 ? 'Amount Due' : 'Total Due'}</span>
                <span className="text-lg font-bold">{formatCurrency(totalDue)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8">
              <p className="text-[8px] text-gray-300 text-center uppercase tracking-[0.3em]">{data.notes || 'Payment expected within 14 days'}</p>
            </div>

          </div>
        </div>
    </div>
  );
}
