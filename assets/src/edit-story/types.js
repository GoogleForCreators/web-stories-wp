/**
 * External dependencies
 */
import PropTypes from 'prop-types';

const StoryPropTypes = {};

export const StoryElementPropsTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	rotationAngle: PropTypes.number.isRequired,
	isFill: PropTypes.bool.isRequired,
};

StoryPropTypes.size = PropTypes.exact( {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
} );

StoryPropTypes.box = PropTypes.exact( {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	rotationAngle: PropTypes.number.isRequired,
} );

StoryPropTypes.children = PropTypes.oneOfType( [
	PropTypes.arrayOf( PropTypes.node ),
	PropTypes.node,
] );

StoryPropTypes.page = PropTypes.shape( {
	id: PropTypes.string.isRequired,
} );

StoryPropTypes.element = PropTypes.shape( StoryElementPropsTypes );

StoryPropTypes.elements = {};

StoryPropTypes.elements.image = PropTypes.shape( {
	...StoryElementPropsTypes,
	src: PropTypes.string.isRequired,
	origRatio: PropTypes.number.isRequired,
	scale: PropTypes.number.isRequired,
	focalX: PropTypes.number,
	focalY: PropTypes.number,
} );

StoryPropTypes.elements.video = PropTypes.shape( {
	...StoryElementPropsTypes,
	mimeType: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	loop: PropTypes.bool,
	poster: PropTypes.string,
	videoId: PropTypes.number.isRequired,
	posterId: PropTypes.number,
} );

StoryPropTypes.elements.text = PropTypes.shape( {
	...StoryElementPropsTypes,
	content: PropTypes.string,
	color: PropTypes.string,
	backgroundColor: PropTypes.string,
	fontFamily: PropTypes.string,
	fontFallback: PropTypes.array,
	fontSize: PropTypes.number,
	fontWeight: PropTypes.number,
	fontStyle: PropTypes.string,
	letterSpacing: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.number,
	] ),
	lineHeight: PropTypes.number,
	padding: PropTypes.number,
	textAlign: PropTypes.string,
} );

StoryPropTypes.elements.square = PropTypes.shape( {
	...StoryElementPropsTypes,
	backgroundColor: PropTypes.string,
} );

export default StoryPropTypes;
