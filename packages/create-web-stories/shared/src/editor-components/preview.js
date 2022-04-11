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
      // Note that using document.write is only for demonstration purposes and is not recommended for production.
      document.write( content ); // lgtm [js/eval-like-call]
      document.close();
    }
  }, [] );

  return null;
}

export default Preview;
