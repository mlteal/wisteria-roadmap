const apiRoot = window.wisteriaApiSettings.root;

export default function makeApiAction(endpoint = 'items', requestType, itemId = null, params = null ) {
	switch (endpoint) {
		case 'items':
			if ( 'POST' === requestType && itemId == null ) {
				const url = apiRoot + '/items/';
				
				// Default options are marked with *
				return fetch( url, {
					body: JSON.stringify( params ), // must match 'Content-Type' header
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
				} )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API item creation didn\'t go through. Refresh the page please.' ) )
			} else if ( 'PATCH' === requestType ) {
				const url = apiRoot + '/items/' + itemId;
				const updateParams = {
					...params,
					start_time: params.start_time/1000,
					end_time: params.end_time/1000,
				};

				// Default options are marked with *
				return fetch( url, {
					body: JSON.stringify( updateParams ), // must match 'Content-Type' header
					// cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
					// credentials: 'same-origin', // include, same-origin, *omit
					// headers: {
					// 	'user-agent': 'Mozilla/4.0 MDN Example',
					// 	'content-type': 'application/json'
					// },
					method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
					// mode: 'cors', // no-cors, cors, *same-origin
					// redirect: 'follow', // manual, *follow, error
					// referrer: 'no-referrer', // *client, no-referrer
				} )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API update didn\'t go through. Refresh the page please.' ) )
			} else if ( 'DELETE' === requestType ) {
				const url = apiRoot + '/items/' + itemId;

				// Default options are marked with *
				return fetch( url, {
					body: JSON.stringify( params ), // must match 'Content-Type' header
					method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
				} )
					.then( response => response.json() ) // parses response to JSON
					.catch( e => alert( 'Fail! That API update didn\'t go through. Refresh the page please.' ) )
			}
			break;
		case 'projects':
			return null;
		default:
			return null;
	}

}
