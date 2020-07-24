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
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import getStoryMarkup from '../../../../edit-story/output/utils/getStoryMarkup';
import { Modal } from '../../../components';
import { StoryPropType } from '../../../types';
import { Close as CloseIcon } from '../../../icons';

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  margin-top: 20px;
  margin-left: 15px;
  width: 30px;
  height: 30px;
  border: ${({ theme }) => theme.borders.transparent};
  background-color: transparent;
  z-index: 10;
`;
// todo error handling for bad story objects
const PreviewScreen = ({ previewStoryObject, handleClose }) => {
  const story = {
    ...previewStoryObject.originalStoryData,
    title: previewStoryObject.title,
    status: previewStoryObject.status || 'template',
    author: previewStoryObject.author || 0,
    slug: previewStoryObject.slug || 'fake slug',
    date: previewStoryObject.date || 'fake date',
    modified: 'fake modified date',
    password: false,
    excerpt: '',
    featuredMedia: 0,
    story_data: {
      ...previewStoryObject.originalStoryData?.story_data,
      pages: {
        ...previewStoryObject.pages,
      },
    },
  };

  const storyMarkup = getStoryMarkup(story, previewStoryObject?.pages, {
    fallbackPoster: '',
    logoPlaceholder: '',
    publisher: {
      name: 'Demo',
    },
  });

  const previewModalLabel = sprintf(
    /* translators: %s: name of story or template getting previewed */
    __('preview of %s', 'web-stories'),
    previewStoryObject.title
  );

  return (
    <Modal
      contentLabel={previewModalLabel}
      isOpen
      onClose={handleClose}
      contentStyles={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <>
        <CloseButton
          onClick={handleClose}
          aria-label={__('close', 'web-stories')}
        >
          <CloseIcon />
        </CloseButton>
        {/* WIP, div works fine locally but not so great testing in dashboard. Need to do a bit of research */}
        <div dangerouslySetInnerHTML={{ __html: storyMarkup }} />
        {/* <iframe width="100%" height="100%" srcDoc={storyMarkup} /> */}
      </>
    </Modal>
  );
};

export default PreviewScreen;

PreviewScreen.propTypes = {
  handleClose: PropTypes.func.isRequired,
  previewStoryObject: StoryPropType.isRequired,
};
