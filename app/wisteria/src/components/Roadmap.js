import React, {Component} from 'react';
import Timeline from 'react-calendar-timeline/lib';
import PropTypes from 'prop-types';
import makeApiAction from "../ApiActions";
import NewItemForm from "./NewItemForm";
import moment from 'moment';

export class Roadmap extends Component {
	static propTypes = {
		viewStart: PropTypes.object,
		viewEnd: PropTypes.object
	};

	state = {
		items: [],
		groups: [],
		formatted: 0,
		groupOptions: [],
		itemFormValues: [],
	};

	handleItemMove = ( itemId, dragTime, newGroupOrder ) => {
		const { items, groups } = this.state;
		const group = groups[newGroupOrder];

		this.setState( {
			items: items.map(
				item =>
					item.id === itemId
						? {
							...item,
							start_time: dragTime,
							end_time: dragTime + (item.end_time - item.start_time),
							group: group.id
						}
						: item
			)
		} );

		let updated = this.state.items.filter( function( obj ) {
			return obj.id === itemId;
		} );

		updated = updated['0'];
		makeApiAction( 'items', 'PATCH', itemId, updated );
	}

	handleItemAdd = ( group, time, e ) => {
		// const { items } = this.state;

		alert( 'doubleclick! TODO: add an item' );
	}

	handleItemResize = ( itemId, time, edge ) => {
		const { items } = this.state;

		this.setState( {
			items: items.map(
				item =>
					item.id === itemId
						? {
							...item,
							start_time: edge === 'left' ? time : item.start_time,
							end_time: edge === 'left' ? item.end_time : time
						}
						: item
			)
		} );

		let resized = this.state.items.filter( function( obj ) {
			return obj.id === itemId;
		} );

		resized = resized['0'];
		makeApiAction( 'items', 'PATCH', itemId, resized )
	}

	handleItemDelete = ( itemId ) => {
		const { items } = this.state;

		this.setState( {
			items: items.map(
				item =>
					item.id === itemId
						? {}
						: item
			)
		} );

		makeApiAction( 'items', 'DELETE', itemId )
	}

	handleFormSubmit = (event, values) => {
		setTimeout(() => {
			const submitValues = {
				...values,
				start_time: values.start_time.format('YYYY-MM-DD 00:00:00'),
				end_time: values.end_time.format('YYYY-MM-DD 00:00:00'),
			};

			// attempt to create a new post
			const r = makeApiAction('items', 'POST', null, submitValues);

			// TODO: only add to roadmap if API call success
			console.log( 'api response', r );

			// on success, update the roadmap
			const items = [...this.state.items];
			items.push({
				...values,
				id: this.state.items.length + 1,
				start_time: moment(values.start_time).format('x'),
				end_time: moment(values.end_time).format('x'),
			});

			this.setState( { items } );

		}, 1000);
	}


	componentDidMount() {
		makeApiAction('projects', 'GET')
			.then( response => response.json() )
			.then( groups => this.setState( { groups } ) )
			.then( groupOptions => this.setState( {
				groupOptions: this.state.groups.map( group => {
					var rGroup = {
						label: group.title,
						value: group.id,
					};

					return rGroup;
				} )
			} ) );

		makeApiAction('items', 'GET')
			.then( response => response.json() )
			.then( items => this.setState( {
				items: items.map( item => {
					var rItem = { ...item };
					rItem['start_time'] = item.start_time * 1000;
					rItem['end_time'] = item.end_time * 1000;

					return rItem;
				} )
			} ) );
	}

	render() {
		if ( this.state.items.length === 0 || this.state.groups.length === 0 ) {
			return null;
		}

		return (
			<div>
				<Timeline
					groups={this.state.groups}
					items={this.state.items}
					traditionalZoom={true}
					defaultTimeStart={this.props.viewStart}
					defaultTimeEnd={this.props.viewEnd}
					onItemMove={this.handleItemMove}
					onItemResize={this.handleItemResize}
					onCanvasDoubleClick={this.handleItemAdd}
					stackItems={true}
					itemHeightRatio={.98}
					lineHeight={45}
				/>
				<NewItemForm
					groupOptions={this.state.groupOptions}
					handleRoadmapSubmit={this.handleFormSubmit}
				/>
			</div>
		);
	}
}

export default Roadmap;
