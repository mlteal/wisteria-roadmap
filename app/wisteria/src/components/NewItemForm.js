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
		handleClose: PropTypes.func,
		groupOptions: PropTypes.array,
		item: PropTypes.object,
	};

	defaultState = {
		title: "",
		groupValue: 7,
		start_time: moment().add( 1, 'week' ),
		end_time: moment().add( 2, 'week' ),
		description: "",
		percent_complete: 0,
		scrollPosition: 0,
		isSubmitting: false,
		newItem: true,
		id: 0,
		key: 0,
	};

	state = {
		...this.defaultState
	};

	handleChange = ( event ) => {
		const target = event.target;
		const name = target.name;
		let value = target.value;

		// Ensure start and end times are set as moment values
		if ( 'start_time' === name || 'end_time' === name ) {
			value = moment( value );
		}

		this.setState( {
			[name]: value
		} );
	}

	handleSubmit = ( event ) => {
		event.preventDefault();
		this.setState( { isSubmitting: true } );
		const values = {
			...this.state,
			group: this.state.groupValue,
			newItem: this.state.newItem,
			id: this.state.id,
			key: this.state.key,
		}

		this.props.handleRoadmapSubmit( event, values );
	}

	componentDidMount() {
		const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
		this.setState( {
			scrollPosition: scrollPosition,
			newItem: this.props.item.newItem,
		} )

		if ( this.props.item.group > 0 ) {
			this.setState( { groupValue: this.props.item.group } )
		}

		if ( this.props.item.newItem ) {
			if ( this.props.item.start_time > 0 ) {
				this.setState( { start_time: this.props.item.start_time } );
				if ( this.props.item.end_time > 0 ) {
					this.setState( { end_time: this.props.item.end_time } );
				} else {
					// go ahead and set a default end time if there isn't one set
					this.setState( { end_time: moment( this.props.item.start_time ).add( 2, 'week' ) } );
				}
			}
		} else {
			this.setState({
				title: this.props.item.title,
				description: this.props.item.description,
				start_time: this.props.item.start_time,
				end_time: this.props.item.start_time,
				groupValue: this.props.item.group,
				percent_complete: this.props.item.percent_complete,
				id: this.props.item.id,
				key: this.props.item.key,
			})
		}
	}

	render() {
		return (
			<div className='wisteria-modal section' style={{
				top: this.state.scrollPosition
			}}>
				<div className='container'>
					<section className="message is-primary">
						<div className='message-header'>
							Add New Item
							<button className="modal-close is-large" aria-label="close"
									onClick={this.props.handleClose}></button>
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
													value={this.state.groupValue}
													options={this.props.groupOptions}
													onChange={( group ) => this.setState( { groupValue: group.value } )}
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
								<button type="submit"
										className={this.state.isSubmitting ? 'button is-warning' : 'button is-primary'}
										disabled={this.state.isSubmitting}>
									{this.state.isSubmitting ? 'Wait plz' : 'Submit'}
								</button>
							</form>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

export default NewItemForm;
