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
		percent_complete: 0,
		modalStatus: {
			isVisible: false,
		},
	};

	state = {
		...this.defaultState
	};

	handleChange = ( event ) => {
		const target = event.target;
		const name = target.name;
		let value = target.value;

		// Ensure start and end times are set as moment values
		if ('start_time' === name || 'end_time' === name) {
			value = moment(value);
		}

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
							<form className="content" onSubmit={this.handleSubmit}>
								<div className="field is-horizontal">
									<div className="field-label is-normal">
										<label className="label">Title</label>
									</div>
									<div className="field-body">
										<div className="field">
											<div className="control">
												<input name="title" type="text"
													   className="input"
													   value={this.state.title}
													   onChange={this.handleChange}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="field is-horizontal">
									<div className="field-label is-normal">
										<label className="label">Start Date</label>
									</div>
									<div className="field-body">
										<div className="field">
											<div className="control">
												<input name="start_time" type="date"
													   className={'input'}
													   value={moment( this.state.start_time ).format( 'YYYY-MM-DD' )}
													   onChange={this.handleChange}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="field is-horizontal">
									<div className="field-label is-normal">
										<label className="label">End Date</label>
									</div>
									<div className="field-body">
										<div className="field">
											<div className="control">
												<input name="end_time" type="date"
													   className={'input'}
													   value={moment( this.state.end_time ).format( 'YYYY-MM-DD' )}
													   onChange={this.handleChange}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="field is-horizontal">
									<div className="field-label is-normal">
										<label className="label">Group</label>
									</div>
									<div className="field-body">
										<div className="field">
											<div className="control">
												<VirtualizedSelect
													name="group"
													value={this.state.group.value}
													options={this.props.groupOptions}
													onChange={( group ) => this.setState( { group } )}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="field is-horizontal">
									<div className="field-label is-normal">
										<label className="label">Description</label>
									</div>
									<div className="field-body">
										<div className="field">
											<div className="control">
												<textarea name="description"
														  className="textarea"
														  value={this.state.description}
														  onChange={this.handleChange}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="field is-horizontal">
									<div className="field-label is-normal">
										<label className="label">Percent Complete</label>
									</div>
									<div className="field-body">
										<div className="field">
											<div className="control">
												<input type="number" name="percent_complete"
													   className="input"
													   value={this.state.percent_complete}
													   onChange={this.handleChange}
												/>
											</div>
										</div>
									</div>
								</div>
								<button type="submit" className="btn btn-outline-primary" disabled={this.isSubmitting}>
									{this.isSubmitting ? 'Wait plz' : 'Submit'}
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
