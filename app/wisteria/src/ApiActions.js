const ROADMAP_ID = window.wrm_roadmap.roadmap_id;
const API_ROOT = window.wisteriaApiSettings.root;

const authFetch = function( url, useMethod, useBody = '' ) {
	if (useBody.length > 0) {
		return fetch( new Request( url, {
			method: useMethod,
			credentials: 'same-origin',
			headers: new Headers( {
				'Content-Type': 'application/json',
				'X-WP-Nonce': window.wisteriaApiSettings.nonce
			} ),
			body: useBody
		} ) );
	} else {
		return fetch( new Request( url, {
			method: useMethod,
			credentials: 'same-origin',
			headers: new Headers( {
				'Content-Type': 'application/json',
				'X-WP-Nonce': window.wisteriaApiSettings.nonce
			} ),
		} ) );
	}
}

export default function makeApiAction( endpoint = 'items', requestType, itemId = null, params = null ) {
	switch ( endpoint ) {
		case 'items':
			// Create a new item
			if ( 'POST' === requestType && itemId == null ) {
				const url = API_ROOT + '/' + ROADMAP_ID + '/items/';

				// Default options are marked with *
				return authFetch( url, 'POST', JSON.stringify( params ) )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API item creation didn\'t go through. Refresh the page please.' ) )
			} else if ( 'PATCH' === requestType ) {
				// Update an item
				const url = API_ROOT + '/' + window.wrm_roadmap.roadmap_id + '/items/' + itemId;
				const updateParams = {
					...params,
					start_time: params.start_time / 1000,
					end_time: params.end_time / 1000,
				};

				return authFetch( url, 'PATCH', JSON.stringify( updateParams ) )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API update didn\'t go through. Refresh the page please.' ) )
			} else if ( 'DELETE' === requestType ) {
				const url = API_ROOT + '/items/' + itemId;
				return authFetch( url, 'DELETE', JSON.stringify( params ) )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => console.log( 'DELETE item:', 'It\'s possible that API update might not have go through. That said, this catch is finicky at the moment so YMMV ¯\\_(ツ)_/¯' ) )
			} else {
				// Grab the list of items
				const url = API_ROOT + '/' + ROADMAP_ID + '/items/';
				return authFetch( url, 'GET' )
					.catch( e => alert( 'There was a problem fetching the items. Le sigh.' ) );
			}
		case 'projects':
			const url = API_ROOT + '/' + ROADMAP_ID + '/projects/';
			return authFetch( url, 'GET' );
		default:
			return null;
	}
}
