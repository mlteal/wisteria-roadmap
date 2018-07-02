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
	};

	defaultState = {
		title: "",
		group: { value: 7 },
		start_time: moment().add( 1, 'week' ),
		end_time: moment().add( 2, 'week' ),
		description: "",
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

	componentDidMount() {

	}

	render() {
		return (
			<div>
				<form className="p-5" onSubmit={this.handleSubmit}>
					<h1>Hello this is form!</h1>
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
						<input name="start_time" type="text"
							   className={'form-control'}
							   value={this.state.start_time}
							   onChange={this.handleChange}
						/>
					</div>
					<div className="form-group">
						<label>End Date</label>
						<input name="start_time" type="text"
							   className={'form-control'}
							   value={this.state.end_time}
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
						{this.isSubmitting ? 'WAIT PLIZ' : 'CLICK ME'}
					</button>
				</form>
			</div>
		);
	}
}

export default NewItemForm;