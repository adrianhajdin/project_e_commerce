import React, { useState, useEffect } from "react";

import { createStyles, fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { commerce } from "../../lib/commerce";

const useStyles = makeStyles((theme) =>
	createStyles({
		search: {
			position: "relative",
			borderRadius: theme.shape.borderRadius,
			display: "flex",
			marginLeft: 0,
			width: "100%",
			cursor: "pointer",
			zIndex: "1",
			[theme.breakpoints.up("sm")]: {
				marginLeft: theme.spacing(2),
				width: "auto",
			},
		},
		searchIcon: {
			padding: theme.spacing(0, 2),
			position: "absolute",
			pointerEvents: "none",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			cursor: "pointer",
			zIndex: "1",
		},
		inputRoot: {
			color: "inherit",
			height: "30px",
			cursor: "pointer",
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 0),
			paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
			transition: theme.transitions.create("width"),
			cursor: "pointer",
			width: "100%",
			height: "30px",
			[theme.breakpoints.up("sm")]: {
				width: "0ch",
				"&:hover": {
					width: "200ch",
				},
			},
			position: "relative",

			backgroundColor: fade(theme.palette.common.white, 0.15),
			"&:hover": {
				backgroundColor: "rgba(0, 0, 0, 0.1)",
			},
			transition: "all 0.5s linear",
		},
		suggestionsContainer: {},
		suggestions: {
			display: "block",
			backgroundColor: "white",
			marginTop: "1.3rem",
			position: "absolute",
			left: "10%",
			padding: "1rem",
			minWidth: "80%",
			borderBottom: "1px solid black",
		},
	})
);

export default function Search() {
	// set state for the search bar
	const [items, setItems] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchItems = async () => {
		const { data } = await commerce.products.list();

		setItems(data);
	};

	useEffect(() => {
		fetchItems();
	}, []);

	// handle search bar change as user begins typing
	const onChangeHandler = (searchTerm) => {
		let matches = [];
		if (searchTerm.length > 0) {
			matches = items.filter((item) => {
				const regex = new RegExp(`${searchTerm}`, "gi");
				// come here
				return item.name.match(regex);
			});
		}

		console.log(matches);
		setSuggestions(matches);
		setSearchTerm(searchTerm);
	};

	// The suggestions bar structure
	const classes = useStyles();
	function copySuggestionText(e) {
		setSearchTerm(e.currentTarget.innerHTML);
		const suggestionsContainer = document.getElementById(
			"suggestionsContainer"
		);
		suggestionsContainer.innerHTML = "";
	}

	return (
		<div>
			<div className={classes.search}>
				<div className={classes.searchIcon}>
					<SearchIcon />
				</div>
				<div className={classes.grow}></div>
				<form id="form" onSubmit={(e) => handleSubmitSearch(e)}>
					<InputBase
						placeholder="Search..."
						autoComplete
						onChange={(e) => onChangeHandler(e.target.value)}
						value={searchTerm}
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{ "aria-label": "search " }}
					/>
				</form>
			</div>
			<div id="suggestionsContainer">
				{suggestions &&
					suggestions.map((suggestions, i) => (
						<div
							onClick={copySuggestionText}
							key={i}
							className={classes.suggestions}
							id="suggestions"
						>
							{suggestions.name}
						</div>
					))}
			</div>
		</div>
	);

	// handle search bar submit
	function handleSubmitSearch(e) {
		const contents = document.getElementById("content");
		contents.innerHTML = "submitte";
		return contents;
	}
}
