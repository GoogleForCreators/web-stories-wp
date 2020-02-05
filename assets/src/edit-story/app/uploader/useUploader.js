
/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { useAPI } from '../../app/api';
import { useConfig } from '../config';

function useUploader() {
	const { actions: { uploadMedia } } = useAPI();
	const { storyId, maxUpload, allowedMimeTypes: { image: allowedImageMimeTypes, video: allowedVideoMimeTypes } } = useConfig();
	const allowedMimeTypes = [ ...allowedImageMimeTypes, ...allowedVideoMimeTypes ];

	const isValidType = useCallback( ( { type } ) => {
		return allowedMimeTypes.includes( type );
	}, [ allowedMimeTypes ] );

	const fileSizeCheck = useCallback( ( { size } ) => {
		return size < maxUpload;
	}, [ maxUpload ] );

	const uploadFile = ( file ) => {
		// TODO Add permission check here, see Gutenberg's userCan function.
		if ( ! fileSizeCheck( file ) ) {
			throw new Error( `File size error` );
		}

		if ( ! isValidType( file ) ) {
			throw new Error( `File type error` );
		}

		const additionalData = {
			post: storyId,
		};

		return uploadMedia( file, additionalData );
	};

	return {
		uploadFile,
	};
}

export default useUploader;
