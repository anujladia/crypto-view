import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  styled
} from '@mui/material';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
      backgroundColor: theme.palette.action.hover,
  },
  cursor: 'pointer',
}));
  
const PriceInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const PriceChange = styled(Typography)(({ theme, isPositive }) => ({
  marginLeft: theme.spacing(1),
  color: isPositive ? theme.palette.success.main : theme.palette.error.main,
}));

function CryptoListItem({ crypto, onSelect, currency }) {
  return (
    <StyledListItem button onClick={onSelect}>
      <ListItemAvatar>
        <Avatar src={crypto.image} alt={crypto.name}>
          {crypto.symbol.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Typography variant="subtitle1">
            {crypto.name} ({crypto.symbol.toUpperCase()})
          </Typography>
        }
        secondary={
          <PriceInfo>
            <Typography component="span" variant="body2">
              {currency.symbol}{crypto.current_price.toLocaleString()}
            </Typography>
            <PriceChange
              component="span"
              variant="body2"
              isPositive={crypto.price_change_percentage_24h >= 0}
            >
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </PriceChange>
          </PriceInfo>
        }
      />
    </StyledListItem>
  );
}

export default CryptoListItem;
