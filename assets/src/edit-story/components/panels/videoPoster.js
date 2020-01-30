/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';

/**
 * WordPress dependencies
 */
import {useEffect, useState} from '@wordpress/element';
import {__} from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import UploadButton from '../uploadButton';
import {SimplePanel} from './panel';
import getCommonValue from './utils/getCommonValue';

const buttonStyles = css`
  color: ${({theme}) => theme.colors.mg.v1};
  font-size: 11px;
`;
const Img = styled.img`
  width: 100%;
  max-height: 300px;
`;

function VideoPosterPanel({selectedElements, onSetProperties}) {
  const featuredMedia = getCommonValue(selectedElements, 'featuredMedia');
  const poster = getCommonValue(selectedElements, 'poster');
  const [state, setState] = useState({featuredMedia, poster});
  useEffect(() => {
    setState({featuredMedia, poster});
  }, [featuredMedia, poster]);

  const handleSubmit = evt => {
    onSetProperties(state);
    evt.preventDefault();
  };

  const handleChangeImage = image => {
    const newState = {
      featuredMedia: image.id,
      poster:
        image.sizes && image.sizes.medium ? image.sizes.medium.url : image.url,
    };
    setState({...state, ...newState});
    onSetProperties(newState);
  };

  return (
    <SimplePanel
      name="videoPoster"
      title={__('Poster image', 'web-stories')}
      onSubmit={handleSubmit}
    >
      {state.poster && <Img src={state.poster} />}

      <UploadButton
        onSelect={handleChangeImage}
        title={__('Select as video poster', 'web-stories')}
        type={'image'}
        buttonInsertText={__('Set as video poster', 'web-stories')}
        buttonText={
          state.poster
            ? __('Replace poster image', 'web-stories')
            : __('Set poster image', 'web-stories')
        }
        buttonCSS={buttonStyles}
      />
    </SimplePanel>
  );
}

VideoPosterPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default VideoPosterPanel;
