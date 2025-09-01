import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function ResponsiveAppBar() {
  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <img
          src="../public/smart-trash.png" // Replace with your icon's path
          alt="App Logo"
          style={{
            height: '24px', // Adjust the size as needed
            marginRight: '8px',
            display: 'flex',
          }}
        />
        <Typography
          variant="h6"
          noWrap
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
          }}
        >
          Full Bin Detection System
        </Typography>

        <Typography
          variant="h5"
          noWrap
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
          }}
        >
          F.B.D System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;