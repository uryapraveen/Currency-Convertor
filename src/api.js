const EXCHANGE_API_KEY = "eb60514dafda2fb9fe6cbd4d";
const EXCHANGE_BASE_URI = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}`;
const COUNTRY_API_URI = "https://restcountries.com/v3.1/all?fields=name,currencies";

export const getCountriesCurrencyInfo = async () => {
  const response = await fetch(COUNTRY_API_URI);
  const countries = await response.json();

  return countries
    .map((country) => {
      const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : null;
      const currency = currencyCode ? country.currencies[currencyCode] : {};
      return {
        countryName: country.name?.common || "Unknown",
        currencyCode,
        currencySymbol: currency?.symbol || "",
      };
    })
    .filter((c) => c.currencyCode);
};

export const getCurrencyExchangeRates = async (baseCurrencyCode = "USD") => {
  const response = await fetch(`${EXCHANGE_BASE_URI}/latest/${baseCurrencyCode}`);
  const data = await response.json();

  if (data.result === "success") {
    return data.conversion_rates;
  } else {
    throw new Error("Failed to fetch exchange rates.");
  }
};
