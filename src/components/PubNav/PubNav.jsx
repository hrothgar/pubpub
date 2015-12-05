import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubNav = React.createClass({
	propTypes: {
		height: PropTypes.number,
		setQueryHandler: PropTypes.func,
		status: PropTypes.string,
		slug: PropTypes.string,
		meta: PropTypes.string, 
		isAuthor: PropTypes.bool,
	},

	handlePrint: function() {
		window.print();
	},

	navClickFunction: function(mode) {
		return ()=> {
			this.props.setQueryHandler({mode: mode});
		};
	},

	render: function() {
		return (
			<div>
				{
					this.props.meta 
						? <ul style={[styles.pubNav, styles[this.props.status]]}>
							<Link to={'/pub/' + this.props.slug}><li key="pubNav8"style={[styles.pubNavItem, styles.pubNavRight]}>Read Pub</li></Link>
							<li style={[styles.pubNavSeparator, styles.pubNavMobileOnly, styles.pubNavRight]}></li>
						</ul>

						: <ul style={[styles.pubNav, styles[this.props.status]]}>

							<li key="pubNav0"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.navClickFunction('tableOfContents')}>Table of Contents</li>
							<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
							<li key="pubNav1"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.navClickFunction('history')}>History</li>
							<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
							<li key="pubNav2"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.navClickFunction('source')}>Source</li>
							<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
							<li key="pubNav3"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.handlePrint}>Print</li>
							<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
							<li key="pubNav4"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.navClickFunction('cite')}>Cite</li>


							<Link to={'/pub/' + this.props.slug + '/edit'}><li key="pubNav7"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavDesktopOnly, styles.pubNavAuthorOnly, styles.pubAuthor[this.props.isAuthor]]}>Edit Pub</li></Link>
							<li style={[styles.pubNavSeparator, styles.pubNavRight, styles.pubNavDesktopOnly, styles.pubNavAuthorOnly, styles.pubAuthor[this.props.isAuthor]]}></li>

							<li key="pubNav5"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavMobileOnly]} onClick={this.navClickFunction('discussions')}>Discussions</li>
							<li style={[styles.pubNavSeparator, styles.pubNavMobileOnly, styles.pubNavRight]}></li>
							
							<li key="pubNav6"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavMobileOnly]} onClick={this.navClickFunction('status')}>Draft</li>
							<li style={[styles.pubNavSeparator, styles.pubNavMobileOnly, styles.pubNavRight]}></li>

							<li key="pubNav8"style={[styles.pubNavItem, styles.pubNavRight]}>Follow</li>
							
						</ul>
				}
				
			</div>
		);
	}
});

export default Radium(PubNav);

styles = {
	navContainer: {

	},
	pubNav: {
		listStyle: 'none',
		pointerEvents: 'auto',
		height: globalStyles.headerHeight,
		width: '100%',
		margin: 0,
		padding: 0,
		color: '#888',
		fontFamily: 'Lato',
		transition: '.3s linear opacity .25s',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
		},
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	pubNavItem: {
		height: '100%',
		padding: '0px 10px',
		lineHeight: globalStyles.headerHeight,
		fontSize: '14px',
		float: 'left',
		color: '#888',
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			width: 'calc(33% - 1px)',
			lineHeight: globalStyles.headerHeightMobile,
			padding: 0,
			textAlign: 'center',
			fontSize: '20px'
		},
	},
	pubNavRight: {
		float: 'right',
	},
	pubNavMobileOnly: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'block',
		},
	},
	pubNavDesktopOnly: {
		display: 'block',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
	},
	pubNavSeparator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 30px)',
			margin: '15px 0px',
		},
	},
	pubNavAuthorOnly: {
		display: 'none',
	},
	pubAuthor: {
		true: {
			display: 'block',
		},
	},

};
