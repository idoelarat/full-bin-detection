import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function ResponsiveAppBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#03A6A1', color: '#FFE3BB'}}>
      <Toolbar disableGutters>
        
        <img
<<<<<<< HEAD
          src="../public/smart-trash.png" 
          alt="App Logo"
          style={{
            height: '24px', 
=======
          src="../public/smart-trash.png" // Replace with your icon's path
          alt="App Logo"
          style={{
            height: '24px', // Adjust the size as needed
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
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
            fontFamily: 'Story Script, cursive',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            backgroundColor: '#03A6A1' 
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