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
 * NOTE: This is temporary panel for being able to remove elements.
 * It will be removed and replaced by using keyboard "Delete"
 * once the approach for keyboard events has been confirmed.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Panel, Title } from './shared';

/**
 * WordPress dependencies
 */

const Delete = styled.a`
	cursor: pointer;
	color: ${ ( { theme } ) => theme.colors.action };

	&:hover {
		color: ${ ( { theme } ) => theme.colors.danger };
	}
`;

function ActionsPanel( { deleteSelectedElements } ) {
	return (
		<Panel>
			<Title>
				{ __( 'Actions', 'web-stories' ) }
			</Title>
			<Delete onClick={ deleteSelectedElements } >
				{ __( 'Remove element', 'web-stories' ) }
			</Delete>
		</Panel>
	);
}

ActionsPanel.propTypes = {
	deleteSelectedElements: PropTypes.func.isRequired,
};

export default ActionsPanel;
