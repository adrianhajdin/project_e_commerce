import React, { useState } from "react";

// to customize search bar
// import {
// 	createStyles,
// 	fade,
// 	Theme,
// 	makeStyles,
// } from "@material-ui/core/styles";

import {
	AppBar,
	Toolbar,
	IconButton,
	Badge,
	MenuItem,
	Menu,
	Typography,

	// import for search bar
	InputBase,
} from "@material-ui/core";
import {
	ShoppingCart,

	// import for search bar
	SearchIcon,
} from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";

// components
import Search from "../SearchBar/SearchBar";

import logo from "../../assets/commerce.png";
import useStyles from "./styles";

const PrimarySearchAppBar = ({ totalItems }) => {
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const classes = useStyles();
	const location = useLocation();

	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

	const mobileMenuId = "primary-search-account-menu-mobile";

	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem>
				<IconButton
					component={Link}
					to="/cart"
					aria-label="Show cart items"
					color="inherit"
				>
					<Badge badgeContent={totalItems} color="secondary">
						<ShoppingCart />
					</Badge>
				</IconButton>
				<p>Cart</p>
			</MenuItem>
		</Menu>
	);

	return (
		<>
			<AppBar
				position="fixed"
				className={classes.appBar}
				color="inherit"
			>
				<Toolbar className={classes.toolBar}>
					<Typography
						component={Link}
						to="/"
						variant="h6"
						className={classes.title}
						color="inherit"
					>
						<img
							src={logo}
							alt="commerce.js"
							height="25px"
							className={classes.image}
						/>{" "}
						Commerce.js
						<Search />
					</Typography>
					{/*
               ----------------------------------------------------
               ADDED THE SEARCH BAR
               -------------------------------------------------------
               */}
					{/* <div className={classes.grow} /> */}
					{location.pathname === "/" && (
						<div className={classes.button}>
							<IconButton
								component={Link}
								to="/cart"
								aria-label="Show cart items"
								color="inherit"
							>
								<Badge
									badgeContent={totalItems}
									color="secondary"
								>
									<ShoppingCart />
								</Badge>
							</IconButton>
						</div>
					)}
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
		</>
	);
};

export default PrimarySearchAppBar;
