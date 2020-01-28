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
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';
import { useConfig } from '../../app/config';
import { SimplePanel } from '../../panels/panel';
import UploadButton from '../uploadButton';
import useInspector from './useInspector';
import { SelectMenu, InputGroup } from './shared';

const ButtonCSS = css`
	color: ${ ( { theme } ) => theme.colors.mg.v1 };
	font-size: 14px;
	width: 100%;
	padding: 15px;
	background: none;
	margin: 5px 0;
`;
const Img = styled.img`
	width: 100%;
	max-height: 300px;
`;

const Group = styled.div`
	border-color: ${ ( { theme } ) => theme.colors.mg.v1 };
	display: block;
	align-items: center;
	margin: 15px 0;
`;

const RemoveButton = styled.button`
	${ ButtonCSS }
`;

function DocumentInspector() {
	const {
		actions: { loadStatuses, loadUsers },
		state: { users, statuses },
	} = useInspector();

	const {
		state: { meta: { isSaving }, story: { author, status, slug, date, excerpt, featuredMediaUrl, password }, capabilities },
		actions: { updateStory, deleteStory },
	} = useStory();

	const { postThumbnails } = useConfig();

	useEffect( () => {
		loadStatuses();
		loadUsers();
	} );

	const allStatuses = useMemo( () => {
		const disabledStatuses = ( status === 'future' ) ? [ 'pending' ] : [ 'future', 'pending' ];
		return statuses.filter( ( { value } ) => ! disabledStatuses.includes( value ) );
	}, [ status, statuses ] );

	const handleChangeValue = useCallback(
		( prop ) => ( value ) => updateStory( { properties: { [ prop ]: value } } ),
		[ updateStory ],
	);

	const handleChangeImage = useCallback(
		( image ) => updateStory( { properties: { featuredMedia: image.id, featuredMediaUrl: ( image.sizes && image.sizes.medium ) ? image.sizes.medium.url : image.url } } ),
		[ updateStory ],
	);

	const handleRemoveImage = useCallback(
		( evt ) => {
			updateStory( { properties: { featuredMedia: 0, featuredMediaUrl: '' } } );
			evt.preventDefault();
		},	[ updateStory ],
	);

	const handleRemoveStory = useCallback(
		( evt ) => {
			deleteStory();
			evt.preventDefault();
		},	[ deleteStory ],
	);

	return (
		<SimplePanel title={ __( 'Document', 'web-stories' ) }>
			{ capabilities && capabilities.hasPublishAction && statuses && <SelectMenu
				label={ __( 'Status', 'web-stories' ) }
				name="status"
				options={ allStatuses }
				disabled={ isSaving }
				value={ status }
				onChange={ handleChangeValue( 'status' ) }
			/> }
			{ capabilities && capabilities.hasPublishAction && status !== 'private' && <InputGroup
				label={ __( 'Password', 'web-stories' ) }
				type={ 'password' }
				value={ password }
				disabled={ isSaving }
				onChange={ handleChangeValue( 'password' ) }
			/> }

			<RemoveButton onClick={ handleRemoveStory } dangerouslySetInnerHTML={ { __html: 'Move to trash' } } />
			<InputGroup
				label={ __( 'Published date', 'web-stories' ) }
				type={ 'datetime-local' }
				value={ date }
				disabled={ isSaving }
				onChange={ handleChangeValue( 'date' ) }
			/>
			{ capabilities && capabilities.hasAssignAuthorAction && users && <SelectMenu
				label={ __( 'Author', 'web-stories' ) }
				name="user"
				options={ users }
				value={ author }
				disabled={ isSaving }
				onChange={ handleChangeValue( 'author' ) }
			/> }

			<InputGroup
				label={ __( 'Excerpt', 'web-stories' ) }
				type={ 'text' }
				value={ excerpt }
				disabled={ isSaving }
				onChange={ handleChangeValue( 'excerpt' ) }
			/>

			<InputGroup
				label={ __( 'Slug', 'web-stories' ) }
				type={ 'text' }
				value={ slug }
				disabled={ isSaving }
				onChange={ handleChangeValue( 'slug' ) }
			/>
			<Group>
				{ featuredMediaUrl && <Img src={ featuredMediaUrl } /> }
				{ featuredMediaUrl && <RemoveButton onClick={ handleRemoveImage } dangerouslySetInnerHTML={ { __html: 'Remove image' } } /> }

				{ postThumbnails && <UploadButton
					onSelect={ handleChangeImage }
					title={ __( 'Select as featured image', 'web-stories' ) }
					type={ 'image' }
					buttonInsertText={ __( 'Set as featured image', 'web-stories' ) }
					buttonText={ featuredMediaUrl ? __( 'Replace image', 'web-stories' ) : __( 'Set featured image', 'web-stories' ) }
					buttonCSS={ ButtonCSS }
				/> }
			</Group>
		</SimplePanel>
	);
}

export default DocumentInspector;
