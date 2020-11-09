import React from 'react';
import { Drawer, List, Divider, ListItem, ListItemIcon, ListItemText, Hidden, Typography } from '@material-ui/core';
import MoveToInbox from '@material-ui/icons/MoveToInbox';
import Mail from '@material-ui/icons/Mail';
import { useTheme } from '@material-ui/core/styles';

import useStyles from './styles';

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const classes = useStyles();
  const theme = useTheme();

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <ListItem>
        <Typography variant="h6" noWrap>Categories</Typography>
      </ListItem>
      <List>
        {['All', "Men's Tees", "Woman's Tees", 'Long Sleeve Tees', 'Hoodies', 'Stickers', 'Socks'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <MoveToInbox /> : <Mail />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem>
        <Typography variant="h6" noWrap>Price</Typography>
      </ListItem>
      <List>
        {['$0.00 - $20.00', '$20.00 - $40.00', '$40.00 - $50.00', '$50.00 - $60.00', '$60.00 +'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <MoveToInbox /> : <Mail />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer variant="temporary" anchor={theme.direction === 'rtl' ? 'right' : 'left'} open={mobileOpen} onClose={handleDrawerToggle} classes={{ paper: classes.drawerPaper }} ModalProps={{ keepMounted: true }}>
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default Sidebar;
