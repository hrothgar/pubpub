import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	ADD_DISCUSSION,
	ADD_DISCUSSION_SUCCESS,
	ADD_DISCUSSION_FAIL,

	ADD_SELECTION,

	DISCUSSION_VOTE,
	DISCUSSION_VOTE_SUCCESS,
	DISCUSSION_VOTE_FAIL,

	ARCHIVE_DISCUSSION_LOAD,
	ARCHIVE_DISCUSSION_SUCCESS,
	ARCHIVE_DISCUSSION_FAIL,


} from '../actions/discussions';

/*--------*/
// Initialize Default State
/*--------*/
export const defaultState = Immutable.Map({
	createPubData: {
		pubCreated: false,
		status: 'loaded',
		error: null,
		slug: null,
		title: undefined,
	},
	pubData: {
		assets: {},
		references: {},
		discussions: [],
		readNext: [],
		featuredIn: [],
		submittedTo: [],
		reviews: [],
		experts: {approved: []},
		history: [{}],
		pubErrorView: false,
	},
	activeModal: undefined,
	newDiscussionData: {
		selections: {},
		assets: {},
		references: {},
	},
	addDiscussionStatus: 'loaded',
	activeSaveID: null,
	status: 'loading',
	error: null,
	showPubHighlights: true,

});

/*--------*/
// Define reducing functions
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this.
/*--------*/

function addDiscussionLoad(state, activeSaveID) {
	return state.merge({
		addDiscussionStatus: 'loading',
		activeSaveID: activeSaveID,
	});
}

function addDiscussionSuccess(state, result, activeSaveID, inEditor) {
	if (inEditor) {return state;}
	function findParentAndAdd(discussions, parentID, newChild) {
		discussions.map((discussion)=>{
			if (discussion._id === parentID) {
				discussion.children.unshift(result);
			}
			if (discussion.children && discussion.children.length) {
				findParentAndAdd(discussion.children, parentID, newChild);
			}
		});
	}

	let discussionsObject = state.getIn(['pubData', 'discussions']);
	if (!result.parent) {
		discussionsObject = discussionsObject.unshift(result);
	} else {
		// We have a parent, we gotta go find it and then merge inside of it
		const discussionsArray = discussionsObject.toJS();
		findParentAndAdd(discussionsArray, result.parent, result);
		discussionsObject = discussionsArray;
	}
	const newState = state.mergeIn(['pubData', 'discussions'], discussionsObject);

	return newState.merge({
		addDiscussionStatus: 'loaded',
		activeSaveID: null,
		newDiscussionData: {
			selections: {},
			assets: {},
			references: {},
		},
	});
}

function addDiscussionFail(state, error, activeSaveID) {
	console.log(error);
	return state.merge({
		addDiscussionStatus: 'error',
		activeSaveID: activeSaveID,
	});
}

function addSelection(state, selection) {
	const selectionData = state.getIn(['newDiscussionData', 'selections']);
	return state.mergeIn(
		['newDiscussionData', 'selections'],
		selectionData.set(selectionData.size + 1, selection)
	);
}

function discussionVote(state, voteType, discussionID, userYay, userNay) {
	let scoreChange = 0;
	let newUserYay = undefined;
	let newUserNay = undefined;

	if (voteType === 'yay' && !userYay) {
		scoreChange = userNay ? 2 : 1;
		newUserYay = true;
	} else if (voteType === 'yay' && userYay) {
		scoreChange = -1;
		newUserYay = false;
	} else if (voteType === 'nay' && !userNay) {
		scoreChange = userYay ? 2 : 1;
		newUserNay = true;
	} else if (voteType === 'nay' && userNay) {
		scoreChange = -1;
		newUserNay = false;
	}
	// Find the discussion with result._id
	// update the yays
	// update the nays
	// update useryay
	// update usernay

	function findDiscussionAndChange(discussions) {
		discussions.map((discussion)=>{
			if (discussion._id === discussionID) {
				discussion[voteType === 'yay' ? 'yays' : 'nays'] += scoreChange;
				discussion.points += (voteType === 'yay' ? 1 : -1) * scoreChange;
				discussion.userYay = newUserYay;
				discussion.userNay = newUserNay;
			}
			if (discussion.children && discussion.children.length) {
				findDiscussionAndChange(discussion.children);
			}
		});
	}

	const discussionsArray = state.getIn(['pubData', 'discussions']).toJS();
	findDiscussionAndChange(discussionsArray);

	return state.mergeIn(['pubData', 'discussions'], discussionsArray);
}

function archiveDiscussion(state, discussionID) {

	function findDiscussionAndChange(discussions) {
		discussions.map((discussion)=>{
			if (discussion._id === discussionID) {
				discussion.archived = !discussion.archived;
			}
			if (discussion.children && discussion.children.length) {
				findDiscussionAndChange(discussion.children);
			}
		});
	}

	const discussionsArray = state.getIn(['pubData', 'discussions']).toJS();
	findDiscussionAndChange(discussionsArray);

	return state.mergeIn(['pubData', 'discussions'], discussionsArray);
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function readerReducer(state = defaultState, action) {

	switch (action.type) {
	case ADD_DISCUSSION:
		return addDiscussionLoad(state, action.activeSaveID);
	case ADD_DISCUSSION_SUCCESS:
		return addDiscussionSuccess(state, action.result, action.activeSaveID, action.inEditor);
	case ADD_DISCUSSION_FAIL:
		return addDiscussionFail(state, action.error, action.activeSaveID);

	case ADD_SELECTION:
		return addSelection(state, action.selection);

	case DISCUSSION_VOTE:
		return discussionVote(state, action.voteType, action.discussionID, action.userYay, action.userNay);
	case DISCUSSION_VOTE_SUCCESS:
		return state;
	case DISCUSSION_VOTE_FAIL:
		return state;

	case ARCHIVE_DISCUSSION_LOAD:
		return archiveDiscussion(state, action.objectID);
	case ARCHIVE_DISCUSSION_SUCCESS:
		return state;
	case ARCHIVE_DISCUSSION_FAIL:
		return state;


	default:
		return ensureImmutable(state);
	}
}
