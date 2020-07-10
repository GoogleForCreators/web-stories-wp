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
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MediaGallery from '../common/mediaGallery';
import {
  useMedia3p,
  useMedia3pForProvider,
} from '../../../../../app/media/media3p/useMedia3p';
import {
  MediaGalleryContainer,
  MediaGalleryInnerContainer,
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import { SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import { ProviderType } from './providerType';
import paneId from './paneId';
import ProviderTab from './providerTab';

const ProviderTabSection = styled.div`
  margin-top: 30px;
  padding: 0 24px;
`;

const CategorySection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  min-height: 94px;
  padding: 30px 24px;
`;

/**
 * Pane that contains the media 3P integrations.
 *
 * @param {Object} props Component props
 * @return {*} The media pane element for 3P integrations.
 */
function Media3pPane(props) {
  const { isActive } = props;

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource) => insertElement(resource.type, { resource }),
    [insertElement]
  );

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

  const { setSelectedProvider } = useMedia3p(({ actions }) => ({
    setSelectedProvider: actions.setSelectedProvider,
  }));
  useEffect(() => {
    if (isActive) {
      setSelectedProvider({ provider: 'unsplash' });
    }
  }, [isActive, setSelectedProvider]);

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

  const { media } = useMedia3pForProvider('unsplash', ({ state }) => ({
    media: state.media,
  }));

  const onSearch = useCallback(() => {
    // TODO(#2391): Perform search.
  }, []);

  const onProviderTabClick = useCallback(() => {
    // TODO(#2393): set state.
  }, []);

  // TODO(#2368): handle pagination / infinite scrolling
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
          <MediaGalleryInnerContainer>
            <MediaGallery
              resources={media}
              onInsert={insertMediaElement}
              providerType={ProviderType.UNSPLASH}
            />
          </MediaGalleryInnerContainer>
        </MediaGalleryContainer>
      </PaneInner>
    </StyledPane>
  );
}

Media3pPane.propTypes = {
  isActive: PropTypes.bool,
};

export default Media3pPane;
