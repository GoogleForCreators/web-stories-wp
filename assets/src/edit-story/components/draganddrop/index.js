/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DragandDropComponent = styled.div`
	min-width: 100%;
    min-height: 100%;

`;
const DragandDropOverContent = styled.div`
    ${ ( { active } ) => active && `
		opacity: .3;
	` }
`;
const Heading = styled.h4`
	color: ${ ( { theme } ) => theme.colors.fg.v1 };
	margin: 0;
`;
const Text = styled.p`
	color: ${ ( { theme } ) => theme.colors.fg.v1 };
`;

const DragandDropOverLay = styled.div`
	position: absolute;
	top: 50%;
	text-align: center;
	width: 90%;
	color: white;
`;

function DragandDrop( { children } ) {
	const [ isDragging, setIsDragging ] = useState( false );

	const onDragLeave = ( evt ) => {
		setIsDragging( false );
		evt.preventDefault();
		evt.stopPropagation();
	};

	const onDragEnter = ( evt ) => {
		setIsDragging( true );
		evt.preventDefault();
		evt.stopPropagation();
	};

	const onDropHandler = ( evt ) => {
		const dt = evt.dataTransfer;
		let files = dt.files;
		files = [ ...files ];
		files.forEach( ( file ) => {
			console.log( file );
		} );
		setIsDragging( false );
		evt.preventDefault();
		evt.stopPropagation();
	};

	return (
		<DragandDropComponent onDragOver={ onDragEnter } onDragLeave={ onDragLeave } onDragEnter={ onDragEnter } onDrop={ onDropHandler }>
			{ isDragging && (
				<DragandDropOverLay>
					<Heading>
						{ __( 'Upload to media library', 'web-stories' ) }
					</Heading>
					<Text>
						{ __( 'You can upload jpg, jpeg, png, svg, gif and webp.', 'web-stories' ) }
					</Text>
				</DragandDropOverLay>
			) }
			<DragandDropOverContent active={ isDragging }>
				{ children }
			</DragandDropOverContent>
		</DragandDropComponent>
	);
}

DragandDrop.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
};

export default DragandDrop;
