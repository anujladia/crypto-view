import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Paper, 
  TextField, 
  List, 
  Grid2, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel ,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Snackbar,
} from '@mui/material';

import {
  ExpandMore,
  ErrorOutline
} from '@mui/icons-material';
import CryptoDisplay from './CryptoDisplay';
import SearchHistory from './SearchHistory';
import CryptoListItem from './CryptoListItem';

import { fetchTop50Cryptocurrencies, fetchCryptoData } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';

import { CURRENCY_DENOMINATIONS, DEFAULT_CURRENCY } from '../constants';

function CryptoTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [lastUpdatedOn, setLastUpdatedOn] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);
  const [currency, setCurrency] = useState(CURRENCY_DENOMINATIONS[DEFAULT_CURRENCY]);
  const [snackBar, setSnackBar] = useState({ show: false });

  useEffect(() => {
    loadTop50Cryptocurrencies();
  }, []);

  useEffect(() => {
    if (!selectedCrypto) {
      loadTop50Cryptocurrencies();
    }
  }, [currency]);

  const loadTop50Cryptocurrencies = async () => {
    try {
      setLoading(true);
      const data = await fetchTop50Cryptocurrencies(currency);
      setLastUpdatedOn(data.last_updated_on);
      setCryptocurrencies(data.list ?? []);
    } catch (error) {
      console.error('Error loading cryptocurrencies:', error);
    }
    setLoading(false);
  };

  const handleCryptoSelect = async (crypto) => {
    setLoading(true);
    try {
      const data = await fetchCryptoData(crypto.id, currency);

      if (!data || !Object.keys(data).length) {
        setSnackBar({ message: 'Error fetching crypto data', show: true });
        setLoading(false);
        return;
      }
      setSelectedCrypto(data);
      
      // Update search history
      const newHistory = [
        { id: crypto.id, name: crypto.name, timestamp: new Date().toISOString() },
        ...searchHistory.filter(item => item.id !== crypto.id)
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
    setLoading(false);
  };

  const handleBack = () => {
    setSelectedCrypto(null);
    setLoading(false);
  };

  const handleRefresh = () => {
    if (selectedCrypto) {
      handleCryptoSelect(selectedCrypto);
    } else {
      loadTop50Cryptocurrencies();
    }
  }

  const filteredCryptos = cryptocurrencies.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCurrencyChange = (event) => {
    const denomination = event.target.value;
    setCurrency(CURRENCY_DENOMINATIONS[denomination]);
  };

  return (
    <Box sx={{ backgroundColor: '#f0f4f8', maxHeight: '100vh', padding: 3 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #007bff 0%, #00bfff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 'bold' }}
          >
            Crypto Viewer
          </Typography>
          <FormControl variant="outlined" sx={{ minWidth: 120, marginLeft: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
            <InputLabel id="currency-select-label">Currency</InputLabel>
            <Select
              labelId="currency-select-label"
              value={currency.label}
              onChange={handleCurrencyChange}
              label="Currency"
              sx={{ '& .MuiSelect-select': { padding: '10px 14px' } }}
            >
              {Object.values(CURRENCY_DENOMINATIONS).map((denomination) => (
                <MenuItem key={denomination.value} value={denomination.label}>
                  {denomination.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRefresh} 
            sx={{ marginLeft: 2 }}
          >
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      <Grid2 sx={{ display: { md: 'none', sm: 'none' } }} >
        <HistoryComponent searchHistory={searchHistory} handleCryptoSelect={handleCryptoSelect} />
      </Grid2>
      
      <Grid2 style={{ width: '100%' }} container spacing={3} sx={{ marginTop: 3, height: 'calc(100vh - 136px)', overflow: 'hidden' }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 8 }} style={{ height: '100%' }}>
          <Paper elevation={3} sx={{ padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)', height: '100%' }}>
            {!selectedCrypto
              ? <TextField
                fullWidth
                label="Search cryptocurrencies"
                value={searchTerm}
                type="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              : <></>
            }

            <Typography variant="subtitle2" gutterBottom>
              Last updated on: {lastUpdatedOn}
            </Typography>
            
            {loading ? (
              <ShowProgress selectedCrypto={selectedCrypto} />
            ) : selectedCrypto ? (
              <CryptoDisplay 
                crypto={selectedCrypto} 
                onBack={handleBack}
                currency={currency}
              />
            ) : (
              <List sx={{ overflowY: 'scroll', height: '586px' }}>
                {filteredCryptos.length
                  ? filteredCryptos.map(crypto => (
                    <CryptoListItem 
                      key={crypto.id}
                      crypto={crypto}
                      onSelect={() => handleCryptoSelect(crypto)}
                      currency={currency}
                    />
                  ))
                  : <FailedLoading message='Unable to fetch data right now' />
                }
              </List>
            )}
          </Paper>
        </Grid2>

        <Grid2 sx={{ display: { sm: 'block', xs: 'none' }, height: 'calc(100vh - 136px)' }} size={{ xs: 6, sm: 6, md: 4 }}>
          <HistoryComponent
          searchHistory={searchHistory}
          handleCryptoSelect={handleCryptoSelect}
          expanded={true}
        />
        </Grid2>
      </Grid2>

      <Snackbar
        open={snackBar.show}
        autoHideDuration={2000}
        onClose={() => setSnackBar({ show: false })}
        message={snackBar.message ?? 'Somethign went wrong'}
      />
    </Box>
  );
}

function HistoryComponent({ handleCryptoSelect, searchHistory, expanded }) {
  return (
    <Grid2>
      <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} defaultExpanded={expanded ? true : false}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="search-history-content"
          id="search-history-header"
        >
          <Typography variant="h6" component="h2">
            Search History
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SearchHistory 
            history={searchHistory}
            onHistoryItemClick={(crypto) => handleCryptoSelect(crypto)}
          />
        </AccordionDetails>
      </Accordion>
    </Grid2>
  )
}

function ShowProgress({ selectedCrypto }) {
  return (
    <>
      {!selectedCrypto
        ? new Array(15).fill(0).map((a, i) => i + 1)
          .map((key) => <Skeleton key={key} variant="rectangular" width={'100%'} height={76} style={{ margin: '16px 0' }} />) 
        : <Skeleton variant="rectangular" width={'100%'} height={200} style={{ margin: '16px 0' }} />
      }
    </>
  );
}

function FailedLoading({ message }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <ErrorOutline sx={{ fontSize: 50, color: 'red' }} />
      <Typography variant="h6" sx={{ marginTop: 2, textAlign: 'center', color: 'black' }}>
        {message || 'Failed to load data. Please try again.'}
      </Typography>
    </Box>
  );
};

export default CryptoTracker;