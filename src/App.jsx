import React, { useState } from 'react';
import { DollarSign, Percent, Calendar } from 'lucide-react';
import './App.css';

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [downPayment, setDownPayment] = useState(60000);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Parse formatted number back to number
  const parseNumber = (str) => {
    const numericValue = str.replace(/\D/g, '');
    return numericValue ? Number(numericValue) : 0;
  };

  // Handle loan amount change with down payment validation
  const handleLoanAmountChange = (value) => {
    const numValue = typeof value === 'string' ? parseNumber(value) : value;
    const clampedValue = Math.max(10000, Math.min(10000000, numValue)); // $10k-$10M
    setLoanAmount(clampedValue);
    
    // If down payment exceeds new loan amount, adjust it
    if (downPayment > numValue) {
      setDownPayment(Math.floor(numValue * 0.2)); // Set to 20%
    }
  };

  // Handle down payment change with validation
  const handleDownPaymentChange = (value) => {
    const numValue = typeof value === 'string' ? parseNumber(value) : value;
    // Ensure down payment doesn't exceed loan amount
    const clampedValue = Math.min(numValue, loanAmount);
    setDownPayment(clampedValue);
  };

  // Handle interest rate change with validation
  const handleInterestRateChange = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    // Clamp between 0.1 and 20
    const clampedValue = Math.max(0.1, Math.min(20, numValue));
    setInterestRate(clampedValue);
  };

  // Safe calculations with validation
  const principal = Math.max(0, loanAmount - downPayment);
  const safeInterestRate = Math.max(0.1, interestRate);
  const monthlyRate = safeInterestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  let monthlyPayment = 0;
  if (principal > 0 && monthlyRate > 0) {
    monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - principal;

  const calculations = {
    monthlyPayment: isFinite(monthlyPayment) && monthlyPayment > 0 ? monthlyPayment : 0,
    totalPayment: isFinite(totalPayment) && totalPayment > 0 ? totalPayment : 0,
    totalInterest: isFinite(totalInterest) && totalInterest > 0 ? totalInterest : 0,
    principal: principal
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleViewSchedule = () => {
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = () => {
    if (email && email.includes('@')) {
      alert(`Thanks! Detailed amortization schedule would be sent to: ${email}`);
      setShowEmailCapture(false);
      setEmail('');
    }
  };

  const principalPercent = calculations.totalPayment > 0 
    ? (calculations.principal / calculations.totalPayment) * 100 
    : 50;
  const interestPercent = calculations.totalPayment > 0 
    ? (calculations.totalInterest / calculations.totalPayment) * 100 
    : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Mortgage Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate your monthly payments and see how much you'll pay over time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none">
                    $
                  </span>
                  <input
                    type="text"
                    value={formatNumber(loanAmount)}
                    onChange={(e) => handleLoanAmountChange(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => handleLoanAmountChange(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none">
                    $
                  </span>
                  <input
                    type="text"
                    value={formatNumber(downPayment)}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={loanAmount}
                  step="5000"
                  value={Math.min(downPayment, loanAmount)}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {loanAmount > 0 ? ((downPayment / loanAmount) * 100).toFixed(1) : 0}% down
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Percent className="w-4 h-4 mr-1" />
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="20"
                  value={interestRate}
                  onChange={(e) => handleInterestRateChange(e.target.value)}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value < 0.1 || isNaN(value)) {
                      setInterestRate(0.1);
                    } else if (value > 20) {
                      setInterestRate(20);
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                />
                <input
                  type="range"
                  min="0.1"
                  max="12"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => handleInterestRateChange(e.target.value)}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  Loan Term (years)
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Monthly Payment Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 md:p-8 text-white">
              <h2 className="text-xl font-semibold mb-2 opacity-90">Monthly Payment</h2>
              <div className="text-5xl md:text-6xl font-bold mb-4">
                {formatCurrency(calculations.monthlyPayment)}
              </div>
              <p className="text-blue-100">
                Principal & Interest only (excludes taxes & insurance)
              </p>
            </div>

            {/* Breakdown Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(calculations.principal)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold text-lg text-red-600">
                    {formatCurrency(calculations.totalInterest)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600 font-semibold">Total Payment</span>
                  <span className="font-bold text-xl text-gray-900">
                    {formatCurrency(calculations.totalPayment)}
                  </span>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="mt-6">
                <div className="flex text-sm font-semibold mb-2">
                  <span className="text-blue-600">Principal: {principalPercent.toFixed(1)}%</span>
                  <span className="ml-auto text-red-600">Interest: {interestPercent.toFixed(1)}%</span>
                </div>
                <div className="h-8 flex rounded-lg overflow-hidden">
                  <div 
                    className="bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${principalPercent}%` }}
                  >
                    {principalPercent > 15 && formatCurrency(calculations.principal)}
                  </div>
                  <div 
                    className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${interestPercent}%` }}
                  >
                    {interestPercent > 15 && formatCurrency(calculations.totalInterest)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleViewSchedule}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
              >
                View Full Amortization Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Email Capture Modal */}
        {showEmailCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your Detailed Report
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your email to receive a complete amortization schedule and save your calculation.
              </p>
              
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg mb-4"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEmailCapture(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmailSubmit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to Buy Your Dream Home?
          </h3>
          <p className="text-gray-600 mb-4">
            Connect with top-rated lenders and get pre-approved today
          </p>
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md">
            Compare Mortgage Rates
          </button>
        </div>
      </div>
    </div>
  );
}