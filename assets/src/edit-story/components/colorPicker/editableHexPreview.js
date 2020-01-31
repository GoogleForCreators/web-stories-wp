/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EditableInput } from 'react-color/lib/components/common';

/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element';

const Preview = styled.button`
	padding: 0;
	margin: 0;
	border: none;
	background: transparent;
	background: ${ ( { theme } ) => theme.colors.bg.v7 };
	color: ${ ( { theme } ) => theme.colors.fg.v1 };
`;

function EditableHexPreview( { hex, onChange } ) {
	const [ isEditing, setIsEditing ] = useState( false );

	const toggleEditing = useCallback( () => setIsEditing( ! isEditing ), [ setIsEditing, isEditing ] );

	if ( ! isEditing ) {
		return (
			<Preview onClick={ toggleEditing }>
				{ hex }
			</Preview>
		);
	}

	return (
		<EditableInput
			value={ hex }
			onChange={ onChange }
			onChangeComplete={ toggleEditing }
		/>
	);
}

EditableHexPreview.propTypes = {
	hex: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export default EditableHexPreview;
