/**
 * External dependencies.
 */
import { useEffect } from 'react';

/**
 * Internal dependencies.
 */
import { LOCAL_STORAGE_PREVIEW_MARKUP_KEY } from '../constants';

function Preview() {
  useEffect( () => {
    const content = window.localStorage.getItem( LOCAL_STORAGE_PREVIEW_MARKUP_KEY );

    if ( content ) {
      document.open();
      document.write( content );
      document.close();
    }
  }, [] );

  return null;
}

export default Preview;
