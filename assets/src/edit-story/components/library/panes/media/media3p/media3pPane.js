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
import styled from 'styled-components';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MediaGallery from '../common/mediaGallery';
import {
  MediaGalleryContainer,
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import { SearchInput } from '../../../common';
import { ProviderType } from './providerType';
import paneId from './paneId';
import ProviderTab from './providerTab';

const ProviderTabSection = styled.div`
  margin-top: 30px;
  padding: 0 1.5em;
`;

// #262B3F is not in the theme currently. Given the UI is going to change,
// might not add it.
const CategorySection = styled.div`
  background-color: #262b3f;
  min-height: 94px;
  padding: 30px 1.5em;
`;

/**
 * Pane that contains the media 3P integrations.
 *
 * @param {Object} props Component props
 * @return {*} The media pane element for 3P integrations.
 */
function Media3pPane(props) {
  // TODO(#1698): Ensure scrollbars auto-disappear in MacOS.
  // State and callback ref necessary to recalculate the padding of the list
  //  given the scrollbar width.
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const refContainer = useRef();
  const refCallbackContainer = (element) => {
    refContainer.current = element;
    if (!element) {
      return;
    }
    setScrollbarWidth(element.offsetWidth - element.clientWidth);
  };

  // TODO(#2368): get resources from useMedia3p
  // TODO(#2368): handle pagination / infinite scrolling
  const resources = [
    {
      id: 1,
      type: 'image',
      local: false,
      alt: 'image alt',
      mimeType: 'image/jpeg',
      width: 18,
      height: 12,
      src:
        'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/how_to_brush_dogs_teeth_slideshow/1800x1200_how_to_brush_dogs_teeth_slideshow.jpg',
    },
    {
      id: 1,
      type: 'image',
      local: false,
      alt: 'image alt',
      mimeType: 'image/jpeg',
      width: 128,
      height: 72,
      src:
        'https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/dogs_1280p_0.jpg?itok=cnRk0HYq',
    },
  ];

  // Recalculates padding of Media Pane so it stays centered.
  // As of May 2020 this cannot be achieved without js (as the scrollbar-gutter
  // prop is not yet ready).
  useLayoutEffect(() => {
    if (!scrollbarWidth) {
      return;
    }
    const currentPaddingLeft = parseFloat(
      window
        .getComputedStyle(refContainer.current, null)
        .getPropertyValue('padding-left')
    );
    refContainer.current.style['padding-right'] =
      currentPaddingLeft - scrollbarWidth + 'px';
  }, [scrollbarWidth, refContainer]);

  // Callback for when a media element is selected.
  const onInsert = useCallback(() => {
    // TODO(#3119): wire up with inserting elements.
  }, []);

  const onSearch = useCallback(() => {
    // TODO(#2391): Perform search.
  }, []);

  const onProviderTabClick = useCallback(() => {
    // TODO(#2393): set state.
  }, []);

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PaneHeader>
          <SearchInputContainer>
            <SearchInput
              value={'Not implemented'}
              placeholder={__('Search', 'web-stories')}
              onChange={onSearch}
            />
          </SearchInputContainer>
          <ProviderTabSection>
            <ProviderTab
              name={'Unsplash'}
              active={true}
              onClick={onProviderTabClick}
            />
          </ProviderTabSection>
          <CategorySection>{__('Coming soon', 'web-stories')}</CategorySection>
        </PaneHeader>
        <MediaGalleryContainer ref={refCallbackContainer}>
          <MediaGallery
            resources={resources}
            onInsert={onInsert}
            providerType={ProviderType.UNSPLASH}
          />
        </MediaGalleryContainer>
      </PaneInner>
    </StyledPane>
  );
}

export default Media3pPane;
