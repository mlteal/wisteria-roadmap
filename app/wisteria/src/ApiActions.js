const apiRoot = window.wisteriaApiSettings.root;
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
			if ( 'POST' === requestType && itemId == null ) {
				const url = apiRoot + '/items/';

				// Default options are marked with *
				return authFetch( url, 'POST', JSON.stringify( params ) )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API item creation didn\'t go through. Refresh the page please.' ) )
			} else if ( 'PATCH' === requestType ) {
				const url = apiRoot + '/items/' + itemId;
				const updateParams = {
					...params,
					start_time: params.start_time / 1000,
					end_time: params.end_time / 1000,
				};

				return authFetch( url, 'PATCH', JSON.stringify( updateParams ) )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API update didn\'t go through. Refresh the page please.' ) )
			} else if ( 'DELETE' === requestType ) {
				const url = apiRoot + '/items/' + itemId;
				return authFetch( url, 'DELETE', JSON.stringify( params ) )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API update didn\'t go through. Refresh the page please.' ) )
			} else {
				const url = apiRoot + '/items/';
				return authFetch( url, 'GET' );
			}
		case 'projects':
			const url = window.wisteriaApiSettings.root + '/projects/';
			return authFetch( url, 'GET' );
		default:
			return null;
	}
}