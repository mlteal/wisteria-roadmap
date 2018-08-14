import React from 'react';

import {getObjectIndex} from "../Utilities";
import Slider from 'react-rangeslider';

export const RoadmapItem = ( { item, timelineContext, groups, handlePercentChange, savePercentChange } ) => {

	// const { timelineWidth, visibleTimeStart, visibleTimeEnd } = timelineContext;
	const { visibleTimeStart, visibleTimeEnd } = timelineContext;
	const daysVisible = (visibleTimeEnd - visibleTimeStart) / 86400000;
	// If we're zoomed in enough, we can adjust the display accordingly
	const itemDays = (item.end_time - item.start_time) / 86400000;
	const showSmallVersion = daysVisible > 120 && itemDays < 14 ? true : false;

	// Grab the index of the group item
	const groupIndex = getObjectIndex( groups, 'id', item.group );

	return (
		<div className={'wrm-timeline-item group-' + groupIndex}>
				<span className="wrm-percent-complete" style={{
					width: `${item.percent_complete}%`,
				}}></span>
			<div className={'wrm-item-content' + (showSmallVersion ? ' item-small' : ' item-large')}><span
				className='wrm-item-title'>{item.title}</span></div>
			<div className={'wrm-percent-complete-slider'}>
				<Slider
					min={0}
					max={100}
					value={parseInt( item.percent_complete, 10 )}
					onChange={( value ) => handlePercentChange( item, value )}
					onChangeComplete={() => savePercentChange( item )}
					tooltip={false}
				/>
			</div>

			{/*<div className={'wrm-item-details'}>*/}
				{/*{item.description}*/}
			{/*</div>*/}
		</div>
	)
}
