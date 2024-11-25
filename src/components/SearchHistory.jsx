import React from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Typography 
} from '@mui/material';

function SearchHistory({ history, onHistoryItemClick }) {
  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" gutterBottom>
        Recent Searches
      </Typography>
      <List>
        {history.map((item) => (
          <ListItem 
            key={item.id + item.timestamp}
            onClick={() => onHistoryItemClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <ListItemText 
              primary={item.name}
              secondary={new Date(item.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default SearchHistory;