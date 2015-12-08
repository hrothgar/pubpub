import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {PubSelectionPopup} from '../';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		title: PropTypes.string,
		abstract: PropTypes.string,
		htmlTree: PropTypes.array,
		authors: PropTypes.array,
		addSelectionHandler: PropTypes.func,
	},
	getDefaultProps: function() {
		return {
			htmlTree: [],
			authors: [],
		};
	},

	getInitialState() {
		return {
			htmlTree: [],
			TOC: [],
		};
	},
	
	render: function() {
		// console.log(this.props.htmlTree);
		return (
			<div style={styles.container}>
				
				<Style rules={{
					'.marking': {
						backgroundColor: 'rgba(124, 235, 124, 0.7)',
					},
					'.tempHighlight': {
						backgroundColor: 'rgba(200,200,200, 0.7)',
					},
					'.selection': {
						backgroundColor: 'rgba(195, 245, 185, 0.7)',
					}
				}}/>

				<div style={[styles.contentContainer, styles[this.props.status]]}>
					
					<h1 style={styles.pubTitle}>{this.props.title}</h1>
					<div style={styles.authors}>
						{
							this.props.authors.map((author, index)=>{
								return (<Link to={'/profile/' + author.username} key={'pubAuthorLink-' + index} style={globalStyles.link}>
									<span key={'pubAuthor-' + index} style={styles.author}>{author.name} </span>
								</Link>);
							})
						}
					</div>
					<div style={styles.pubAbstract}>{this.props.abstract}</div>
					<div style={styles.headerDivider}></div>

					<div id="pubBodyContent">
						<PubSelectionPopup addSelectionHandler={this.props.addSelectionHandler}/>
						{this.props.htmlTree}
					</div>

				</div>
				
			</div>
		);
	}
});


styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		borderRadius: 1,
		// minHeight: 'calc(100vh - 2 * ' + globalStyles.headerHeight + ' + 2px)',
	},
	contentContainer: {
		transition: '.3s linear opacity .25s',
		padding: '0px 10px',
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	pubTitle: {
		textAlign: 'center',
		fontSize: '40px',
		margin: '50px 0px',
	},
	pubAbstract: {
		textAlign: 'center',
		fontSize: '20px',
		margin: '30px 0px',
	},
	headerDivider: {
		height: 1,
		width: '80%',
		margin: '0 auto',
		backgroundColor: '#DDD',
	},

};

export default Radium(PubBody);
