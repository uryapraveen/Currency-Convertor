import React, { useState, useEffect } from 'react';
import './App.css';
import { getCountriesCurrencyInfo, getCurrencyExchangeRates } from './api';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [convertedValue, setConvertedValue] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  const [selectedCode, setSelectedCode] = useState('USD');
  const [selectedCode1, setSelectedCode1] = useState('USD');

  // Fetch all currency info once
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCountriesCurrencyInfo();
        setCurrencies(data);
      } catch (error) {
        console.error("Failed to fetch currency list:", error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleChange1 = (e) => {
    setSelectedCode(e.target.value);
  };

  const handleChange2 = (e) => {
    setSelectedCode1(e.target.value);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConvert = async () => {
    const amount = parseFloat(inputValue);
    try {
      const rates = await getCurrencyExchangeRates(selectedCode); // No substring
      const rate = rates[selectedCode1]; // No substring
      if (rate) {
        const converted = amount * rate;
        setConvertedValue(
          <strong>
            Congratulations!!! You have {converted.toFixed(2)} {selectedCode1} for {amount} {selectedCode}
          </strong>
        );
      } else {
        console.log(`Conversion rate for ${selectedCode1} not found.`);
      }
    } catch (err) {
      console.error("Error fetching rate:", err);
    }
  };


  // Trigger convert on Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        handleConvert();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue]);

  return (
    <div className="app-container">
      <header className="app-header">Currency Converter</header>
      <p className="Head1">Original Value</p>
      <p className="Head2">Converted Value</p>

      <select value={selectedCode} onChange={handleChange1} className="Original">
        <option value="" disabled>Select a currency</option>
        {currencies.map((currency) => (
          <option key={currency.currencyCode} value={currency.currencyCode}>
            {currency.currencyCode} - {currency.countryName}
          </option>
        ))}
      </select>

      <select value={selectedCode1} onChange={handleChange2} className="Converted">
        <option value="" disabled>Select a currency</option>
        {currencies.map((currency) => (
          <option key={currency.currencyCode} value={currency.currencyCode}>
            {currency.currencyCode} - {currency.countryName}
          </option>
        ))}
      </select>


      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter the amount"
        className="currency-input"
      />

      <button className="convert-button" onClick={handleConvert}>
        Convert
      </button>

      {convertedValue && <p className="result">{convertedValue}</p>}
    </div>
  );
};

export default App;
