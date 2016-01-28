import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';

import Radium, {Style} from 'radium';
import smoothScroll from '../../utils/smoothscroll';

const SelectionInputFields = [
	{title: 'index', type: 'selection', params: {}},
];

const SelectionConfig = {
	title: 'selection',
	inline: true,
	autocomplete: false
};

let styles;

const SelectionPlugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
		index: PropTypes.object,
	},
	getInitialState: function() {
		return {
			showContext: false,
		};
	},

	scrollToHighlight: function() {
		const destination = document.getElementsByClassName('selection-' + this.props.index._id)[0];
		if (!destination) {
			this.setState({showContext: !this.state.showContext});
		}
		const context = document.getElementsByClassName('centerBar')[0];
		smoothScroll(destination, 500, ()=>{}, context);
		smoothScroll(destination, 500, ()=>{}, null, -60);
	},

	hoverOn: function() {
		const items = document.getElementsByClassName('selection-' + this.props.index._id);
	
		for (let index = 0; index < items.length; index++) {
			items[index].className = items[index].className.replace('selection ', 'selection selection-active ');	
		}
		
	},
	hoverOff: function() {
		const items = document.getElementsByClassName('selection-' + this.props.index._id);

		for (let index = 0; index < items.length; index++) {
			items[index].className = items[index].className.replace('selection selection-active ', 'selection ');	
		}
	},

	calculateOffsets: function() {
		const contextString = this.props.index.context.substring(this.props.index.startOffset, this.props.index.endOffset);
		
		// If the substring based on our offsets does not match the selection text...
		if (contextString !== this.props.index.text) {
			const selectionRegex = new RegExp(this.props.index.text, 'g');
			const count = (this.props.index.context.match(selectionRegex) || []).length;

			// If there is more than one occurence of the selection string in the context,
			// we can't recover it right now - so just don't highlight anything
			if (count > 1) {
				return [null, null];
			}

			// otherwise, find where the string actually lives, and use those as offsets.
			const indexOf = this.props.index.context.indexOf(this.props.index.text);
			return [indexOf, indexOf + this.props.index.text.length];
		}

		// If the contextString matches, return our original offsets
		return [this.props.index.startOffset, this.props.index.endOffset];
			
	},

	render: function() {
		if (!this.props.index) {
			return null;
		}
		
		const offsets = this.calculateOffsets();
		return (
			<div 
				id={'selection-block-' + this.props.index._id}
				className={'selection-block'} 
				key={'selection-block-' + this.props.index._id}
				style={styles.selectionBlock} 
				onClick={this.scrollToHighlight}
				onMouseEnter={this.hoverOn}
				onMouseLeave={this.hoverOff}>

					<Style rules={{
						'.selection-block': {
							boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)',
							transition: '.05s linear box-shadow, .05s linear transform',
						},
						'.selection-block-active': {
							boxShadow: '0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)',
							transition: '.05s linear box-shadow, .05s linear transform',
							transform: 'translateX(-15px)'
						},
					}} />

					{/* <span style={styles.quotationMark}>“</span> */}
					{this.state.showContext
						? <div>
							<div style={styles.versionHeader}>Selection made on Version {this.props.index.version}</div>
							{offsets[0] === null
								? this.props.index.context
								: <span>
									{this.props.index.context.substring(0, offsets[0])}
									<span style={styles.highlight}>{this.props.index.text}</span>
									{this.props.index.context.substring(offsets[1], this.props.index.context.length)}
								</span>
							}

						</div>
						: this.props.index.text
					}

			</div>
		);
	}
});

styles = {
	selectionBlock: {
		backgroundColor: 'rgba(255,255,255,0.65)',
		borderRadius: '1px',
		padding: '10px 8px',
		color: '#5B5B5B',
		cursor: 'pointer',
		margin: '5px 0px 5px 15px',
		fontStyle: 'italic',
		fontSize: '0.9em',
	},
	highlight: {
		backgroundColor: 'rgba(195, 245, 185, 0.6)',
	},
	versionHeader: {
		textAlign: 'center',
		borderBottom: '1px dashed #ddd',
		paddingBottom: '8px',
		marginBottom: '8px',
		fontStyle: 'initial',
		color: '#777',
		fontSize: '0.85em',
	}
	// quotationMark: {
	// 	fontSize: '2em',
	// 	fontFamily: 'serif',
	// },
};

export default createPubPubPlugin(Radium(SelectionPlugin), SelectionConfig, SelectionInputFields);