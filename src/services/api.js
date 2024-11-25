import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTop50Cryptocurrencies = async (currency) => {
  const { value } = currency;

  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets`, {
        params: {
          vs_currency: value || 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false
        }
      }
    );

    const data = {
      last_updated_on: new Date().toLocaleString(),
      list: response.data
    };

    window.localStorage.setItem(`crypto_list_${value}`, JSON.stringify(data));
    return data;
  } catch (err) {
    const cached_crypto_data = window.localStorage.getItem(`crypto_list_${value}`);
    return JSON.parse(cached_crypto_data ?? '{}');
  }
};

export const fetchCryptoData = async (id, currency) => {
  const { value } = currency;

  try {
    const response = await axios.get(
      `${BASE_URL}/coins/${id}`, {
        params: {
          vs_currency: value || 'usd',
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      }
    );

    console.log(response);
    return response.data;
  } catch (err) {
    return JSON.parse('{}');
  }
};