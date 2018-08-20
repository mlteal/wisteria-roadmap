import React, {Component} from 'react';
import Timeline from 'react-calendar-timeline/lib';
import PropTypes from 'prop-types';
import makeApiAction from "../ApiActions";
import moment from 'moment';
import {RoadmapItem} from './RoadmapItem';
import {getObjectIndex} from "../Utilities";
import Modal from './Modal';
import NewItemForm from "./NewItemForm";

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
		modalVisible: false,
		modalProps: {}
	};

	handlePercentChange = (item, value) => {
		const itemIndex = getObjectIndex(this.state.items, 'id', item.id)
		const newItems = [...this.state.items];
		newItems[ itemIndex ] = {
			...item,
			percent_complete: value
		};

		this.setState({ items: newItems })
	}

	savePercentChange = (item) => {
		const key = getObjectIndex(this.state.items, 'id', item.id);
		const itemFromState = {...this.state.items[key]}
		makeApiAction( 'items', 'PATCH', itemFromState.id, {percent_complete: itemFromState.percent_complete} );
	}

	itemRenderer = ( item, timelineContext ) => {
		return RoadmapItem( {
			item: item.item,
			timelineContext,
			groups: this.state.groups,
			handlePercentChange: this.handlePercentChange,
			savePercentChange: this.savePercentChange
		} )
	}

	groupRenderer = ( { group } ) => {
		const groupIndex = getObjectIndex( this.state.groups, 'id', group.id );
		return (
			<div className={'wrm-sidebar-item project-' + groupIndex}>
				<span className="wrm-project-title">{group.title}</span>
			</div>
		)
	}

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

	/**
	 *
	 * @param group If it's a new item, ID if it's an existing
	 * @param timeOrE time If new item, Event if editing existing
	 * @param eOrTime Event if new, Time if existing
	 */
	handleNewItemModal = ( groupOrId, timeOrE, eOrTime ) => {
		if ('object' === typeof(timeOrE)) {
			const itemKey = getObjectIndex(this.state.items, 'id', groupOrId);
			const existingItem = this.state.items[itemKey];
			this.setState({
				modalVisible: true,
				modalProps: {
					newItem: false,
					e: timeOrE,
					key: itemKey,
					...existingItem
				}
			});
		} else {
			// create a new item
			this.setState({
				modalVisible: true,
				modalProps: {
					newItem: true,
					group: groupOrId,
					start_time: timeOrE,
					e: eOrTime,
				}
			});
		}
	}

	handleModalClose = (e) => {
		// close on escape key or close button click
		if (!e.keyCode || 27 === e.keyCode) {
			this.setState({modalVisible: false});
		}

		return;
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
		makeApiAction( 'items', 'PATCH', itemId, resized );
	}

	handleItemDelete = ( itemId ) => {
		if ( window.confirm( 'Are you sure you want to delete?' ) ) {
			// TODO: don't delete on API delete failure!
			makeApiAction( 'items', 'DELETE', itemId );

			const { items } = this.state;

			this.setState( {
				items: items.map(
					item =>
						item.id === itemId
							? {}
							: item
				)
			} );
		}
	}

	handleFormSubmit = ( event, values ) => {
		event.preventDefault();

		setTimeout( () => {
			const submitValues = {
				...values,
				start_time: moment(values.start_time).format( 'YYYY-MM-DD 00:00:00' ),
				end_time: moment(values.end_time).format( 'YYYY-MM-DD 00:00:00' ),
			};

			const postOrPatch = submitValues.newItem ? 'POST' : 'PATCH';

			// attempt to create a new post
			makeApiAction( 'items', postOrPatch, submitValues.id, submitValues ).then(
				r => {
					// on success, update the roadmap
					const  updateItems = [...this.state.items];
					if (!submitValues.newItem) {
						updateItems.splice(submitValues.key, 1);
					}

					updateItems.push( {
						...values,
						id: r,
						// use submitValues because they're definitely already moments
						start_time: parseInt(moment( submitValues.start_time ).format( 'x' ), 10),
						end_time: parseInt(moment( submitValues.end_time ).format( 'x' ), 10),
					} );

					this.setState( { items: updateItems } );
				}
			).then(
				this.setState({modalVisible: false})
			);

		}, 1000 );
	}

	componentDidMount() {
		makeApiAction( 'projects', 'GET' )
			.then( response => response.json() )
			.then( groups => {
				const groupOptions = groups.map( group => {
					var rGroup = {
						label: group.title,
						value: group.id,
					};

					return rGroup;
				} )

				this.setState( { groups, groupOptions } );

			} );

		makeApiAction( 'items', 'GET' )
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
					groupRenderer={this.groupRenderer}
					itemRenderer={this.itemRenderer}
					traditionalZoom={false}
					canResize={'both'}
					defaultTimeStart={this.props.viewStart}
					defaultTimeEnd={this.props.viewEnd}
					onItemMove={this.handleItemMove}
					onItemResize={this.handleItemResize}
					onItemDoubleClick={this.handleNewItemModal}
					onCanvasDoubleClick={this.handleNewItemModal}
					onItemContextMenu={this.handleItemDelete}
					stackItems={true}
					itemHeightRatio={.98}
					lineHeight={45}
					steps={{
						second: 86400,
						minute: 1440,
						hour: 24,
						day: 1,
						month: 1,
						year: 1
					}}
				/>
				{!this.state.modalVisible || <Modal><NewItemForm
					item={this.state.modalProps}
					groupOptions={this.state.groupOptions}
					handleRoadmapSubmit={this.handleFormSubmit}
					handleClose={this.handleModalClose}
				/></Modal>}
			</div>
		);
	}
}

export default Roadmap;
