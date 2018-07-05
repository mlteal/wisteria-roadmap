import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import VirtualizedSelect from "react-virtualized-select";
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

export class NewItemForm extends Component {
	static propTypes = {
		handleRoadmapSubmit: PropTypes.func,
		groupOptions: PropTypes.array,
		modalStatus: PropTypes.object,
	};

	defaultState = {
		title: "",
		group: { value: 7 },
		start_time: moment().add( 1, 'week' ),
		end_time: moment().add( 2, 'week' ),
		description: "",
		modalStatus: {
			isVisible: false,
		},
	};

	state = {
		...this.defaultState
	};

	handleChange = ( event ) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState( {
			[name]: value
		} );
	}

	handleSubmit = ( event ) => {
		const values = {
			...this.state,
			group: this.state.group.value,
		}
		this.props.handleRoadmapSubmit( event, values )
		event.preventDefault();
	}

	handleClose = ( event ) => {
		console.log( 'handle close event' );
		const modalStatus = { ...this.state.modalStatus }

		console.log( 'initial state check', modalStatus.isVisible );

		modalStatus.isVisible = !modalStatus.isVisible;
		console.log( 'update string', modalStatus.isVisible );

		this.setState( {
			modalStatus: {
				isVisible: true
			}
		}, function() {
			console.log( 'after setting', this.state.modalStatus.isVisible );
		} );
	}

	componentDidMount() {

	}

	render() {
		return (
			<div className='section'>
				<div className='container'>
					<section className="message is-primary">
						<div className='message-header'>
							Add New Item
						</div>
						<div className="message-body">
							<form className="p-5" onSubmit={this.handleSubmit}>
								<div className="form-group">
									<label>Title</label>
									<input name="title" type="text"
										   className={'form-control'}
										   value={this.state.title}
										   onChange={this.handleChange}
									/>
								</div>
								<div className="form-group">
									<label>Start Date</label>
									<input name="start_time" type="date"
										   className={'form-control'}
										   value={moment( this.state.start_time ).format( 'YYYY-MM-DD' )}
										   onChange={this.handleChange}
									/>
								</div>
								<div className="form-group">
									<label>End Date</label>
									<input name="start_time" type="date"
										   className={'form-control'}
										   value={moment( this.state.end_time ).format( 'YYYY-MM-DD' )}
										   onChange={this.handleChange}
									/>
								</div>
								<div className="form-group">
									<label>Group</label>
									<VirtualizedSelect
										name="group"
										value={this.state.group.value}
										options={this.props.groupOptions}
										onChange={( group ) => this.setState( { group } )}
									/>
								</div>
								<div className="form-group">
									<label>Description</label>
									<input name="description" type="text"
										   className={'form-control'}
										   value={this.state.description}
										   onChange={this.handleChange}
									/>
								</div>
								<button type="submit" className="btn btn-outline-primary" disabled={this.isSubmitting}>
									{this.isSubmitting ? 'WAIT PLZ' : 'CLICK ME'}
								</button>
							</form>
						</div>
						<button className="modal-close is-large" aria-label="close" onClick={this.handleClose}></button>
					</section>
				</div>
			</div>
		);
	}
}

export default NewItemForm;
