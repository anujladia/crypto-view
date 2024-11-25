import React from 'react';
import { Card, CardContent, Typography, Grid2, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CryptoDisplay({ crypto, onBack, currency }) {
  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Grid2 container spacing={3}>
          <Grid2 size={12} style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowBackIcon onClick={onBack} sx={{ marginRight: '8px' }} style={{ cursor: 'pointer' }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </Typography>
          </Grid2>
          
          <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Paper elevation={2} sx={{ padding: 2, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">
                Current Price ({currency.label})
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {currency.symbol}{crypto.market_data.current_price[currency.value].toLocaleString()}
              </Typography>
            </Paper>
          </Grid2>
          
          <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Paper elevation={2} sx={{ padding: 2, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">
                Market Cap
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {currency.symbol}{crypto.market_data.market_cap[currency.value].toLocaleString()}
              </Typography>
            </Paper>
          </Grid2>
          
          <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Paper elevation={2} sx={{ padding: 2, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">
                24h Change
              </Typography>
              <Typography variant="h5" style={{
                color: crypto.market_data.price_change_percentage_24h >= 0 ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {crypto.market_data.price_change_percentage_24h.toFixed(2)}%
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}

export default CryptoDisplay;