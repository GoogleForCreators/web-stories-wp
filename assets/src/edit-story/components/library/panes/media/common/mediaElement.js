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
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import { useEffect, useCallback, memo, useState, useRef, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import { rgba } from 'polished';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../../../../../app';
import DropDownMenu from '../local/dropDownMenu';
import { KEYBOARD_USER_SELECTOR } from '../../../../../utils/keyboardOnlyOutline';
import { useKeyDownEffect } from '../../../../keyboard';
import { useMedia3pApi } from '../../../../../app/media/media3p/api';
import getThumbnailUrl from '../../../../../elements/media/util';
import useRovingTabIndex from './useRovingTabIndex';
import Attribution from './attribution';

const styledTiles = css`
  width: 100%;
  cursor: pointer;
  transition: 0.2s transform, 0.15s opacity;
  border-radius: 4px;
  opacity: 0;
`;

const Image = styled.img`
  ${styledTiles}
`;

const Video = styled.video`
  ${styledTiles}
  object-fit: cover;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 10px;
  body${KEYBOARD_USER_SELECTOR} &:focus {
    outline: solid 2px #fff;
  }
`;

const Duration = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: ${({ theme }) => rgba(theme.colors.bg.workspace, 0.6)};
  font-family: ${({ theme }) => theme.fonts.duration.family};
  font-size: ${({ theme }) => theme.fonts.duration.size};
  line-height: ${({ theme }) => theme.fonts.duration.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.duration.letterSpacing};
  padding: 0 6px;
  border-radius: 10px;
`;

const gradientAnimation = keyframes`
    0% { background-position:0% 50% }
    50% { background-position:100% 50% }
    100% { background-position:0% 50% }
`;

const UploadingIndicator = styled.div`
  height: 4px;
  background: linear-gradient(
    270deg,
    ${({ theme }) => theme.colors.loading.primary} 15%,
    ${({ theme }) => theme.colors.loading.secondary} 50%,
    ${({ theme }) => theme.colors.loading.primary} 85%
  );
  background-size: 400% 400%;
  position: absolute;
  bottom: 10px;

  animation: ${gradientAnimation} 4s ease infinite;

  &.uploading-indicator {
    &.appear {
      width: 0;
    }

    &.appear-done {
      width: 100%;
      transition: 1s ease-out;
      transition-property: width;
    }
  }
`;

const HiddenPosterImage = styled.img`
  display: none;
`;

/**
 * Get a formatted element for different media types.
 *
 * @param {Object} param Parameters object
 * @param {number} param.index Index of the media element in the gallery.
 * @param {Object} param.resource Resource object
 * @param {number} param.width Width that element is inserted into editor.
 * @param {number} param.height Height that element is inserted into editor.
 * @param {Function} param.onInsert Insertion callback.
 * @param {string} param.providerType Which provider the element is from.
 * @return {null|*} Element or null if does not map to video/image.
 */
const MediaElement = ({
  index,
  resource,
  width: requestedWidth,
  height: requestedHeight,
  onInsert,
  providerType,
}) => {
  const {
    id: resourceId,
    src,
    type,
    width: originalWidth,
    height: originalHeight,
    local,
    alt,
  } = resource;
  const hasDropdownMenu = useFeature('mediaDropdownMenu');

  const oRatio =
    originalWidth && originalHeight ? originalWidth / originalHeight : 1;
  const width = requestedWidth || requestedHeight / oRatio;
  const height = requestedHeight || width / oRatio;

  const mediaElement = useRef();
  const [showVideoDetail, setShowVideoDetail] = useState(true);
  const [active, setActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    actions: { handleDrag, handleDrop, setDraggingResource },
  } = useDropTargets();

  const {
    actions: { registerUsage },
  } = useMedia3pApi();

  const handleRegisterUsage = useCallback(() => {
    if (
      providerType !== 'local' &&
      resource.attribution &&
      resource.attribution.registerUsageUrl
    ) {
      registerUsage({
        registerUsageUrl: resource.attribution.registerUsageUrl,
      });
    }
  }, [providerType, resource, registerUsage]);

  const measureMediaElement = () =>
    mediaElement?.current?.getBoundingClientRect();

  const dropTargetsBindings = useMemo(
    () => ({
      draggable: 'true',
      onDragStart: (e) => {
        setDraggingResource(resource);
        const { x, y, width: w, height: h } = measureMediaElement();
        const offsetX = e.clientX - x;
        const offsetY = e.clientY - y;
        e.dataTransfer.setDragImage(mediaElement?.current, offsetX, offsetY);
        e.dataTransfer.setData(
          'resource/media',
          JSON.stringify({
            resource,
            offset: { x: offsetX, y: offsetY, w, h },
          })
        );
      },
      onDrag: (e) => {
        handleDrag(resource, e.clientX, e.clientY);
      },
      onDragEnd: (e) => {
        e.preventDefault();
        setDraggingResource(null);
        handleRegisterUsage();
        handleDrop(resource);
      },
    }),
    [setDraggingResource, resource, handleDrag, handleDrop, handleRegisterUsage]
  );

  const makeActive = useCallback(() => setActive(true), []);
  const makeInactive = useCallback(() => setActive(false), []);
  const onMenuOpen = useCallback(() => setIsMenuOpen(true), []);
  const onMenuCancelled = useCallback(() => setIsMenuOpen(false), []);
  const onMenuSelected = useCallback(() => {
    setIsMenuOpen(false);
    setActive(false);
  }, []);

  useEffect(() => {
    if (type === 'video') {
      if (isMenuOpen) {
        if (mediaElement.current && !mediaElement.current.paused) {
          // If it's a video, pause the preview while the dropdown menu is open.
          mediaElement.current.pause();
        }
      } else {
        if (active) {
          setShowVideoDetail(false);
          if (mediaElement.current) {
            // Pointer still in the media element, continue the video.
            const playPromise = mediaElement.current.play();
            if (playPromise) {
              // All supported browsers return promise but unit test runner does not.
              playPromise.catch(() => {});
            }
          }
        } else {
          setShowVideoDetail(true);
          if (mediaElement.current) {
            // Stop video and reset position.
            mediaElement.current.pause();
            mediaElement.current.currentTime = 0;
          }
        }
      }
    }
  }, [isMenuOpen, active, type]);

  const onClick = () => {
    handleRegisterUsage();
    onInsert(resource, width, height);
  };

  const innerElement = getInnerElement(type, {
    src,
    ref: mediaElement,
    resource,
    alt,
    width,
    height,
    onClick,
    showVideoDetail,
    dropTargetsBindings,
  });
  const attribution = active && resource.attribution?.author && (
    <Attribution
      author={resource.attribution.author.displayName}
      url={resource.attribution.author.url}
    />
  );

  const ref = useRef();

  const rowBasedUploadGalleryEnabled = useFeature('rowBasedGallery');
  const isRowBasedGallery =
    providerType !== 'local' || rowBasedUploadGalleryEnabled;
  useRovingTabIndex({ ref, isRowBasedGallery });

  const handleKeyDown = useCallback(
    ({ key }) => {
      if (key === 'Enter') {
        onInsert(resource, width, height);
      } else if (key === ' ') {
        setIsMenuOpen(true);
      }
    },
    [onInsert, setIsMenuOpen, resource, width, height]
  );

  useKeyDownEffect(
    ref,
    {
      key: ['enter', 'space'],
    },
    handleKeyDown,
    [handleKeyDown]
  );

  return (
    <Container
      ref={ref}
      data-testid="mediaElement"
      data-id={resourceId}
      className={'mediaElement'}
      onPointerEnter={makeActive}
      onFocus={makeActive}
      onPointerLeave={makeInactive}
      onBlur={makeInactive}
      tabIndex={index === 0 ? 0 : -1}
    >
      {innerElement}
      {attribution}
      {local && (
        <CSSTransition
          in
          appear={true}
          timeout={0}
          className="uploading-indicator"
        >
          <UploadingIndicator />
        </CSSTransition>
      )}
      {hasDropdownMenu && providerType === 'local' && (
        <DropDownMenu
          resource={resource}
          display={active}
          isMenuOpen={isMenuOpen}
          onMenuOpen={onMenuOpen}
          onMenuCancelled={onMenuCancelled}
          onMenuSelected={onMenuSelected}
        />
      )}
    </Container>
  );
};

function getInnerElement(
  type,
  {
    src,
    ref,
    resource,
    alt,
    width,
    height,
    onClick,
    showVideoDetail,
    dropTargetsBindings,
  }
) {
  const makeImageVisible = () => {
    ref.current.style.opacity = '1';
  };
  if (type === 'image') {
    return (
      <Image
        key={src}
        src={getThumbnailUrl(width, resource)}
        ref={ref}
        width={width}
        height={height}
        alt={alt}
        aria-label={alt}
        loading={'lazy'}
        onClick={onClick}
        onLoad={makeImageVisible}
        {...dropTargetsBindings}
      />
    );
  } else if (type === 'video') {
    const { lengthFormatted, poster, mimeType } = resource;
    return (
      <>
        <Video
          key={src}
          ref={ref}
          poster={poster}
          width={width}
          height={height}
          preload="none"
          aria-label={alt}
          muted
          onClick={onClick}
          {...dropTargetsBindings}
        >
          <source src={src} type={mimeType} />
        </Video>
        {/* This hidden image allows us to fade in the poster image in the
        gallery as there's no event when a video's poster loads. */}
        <HiddenPosterImage src={poster} onLoad={makeImageVisible} />
        {showVideoDetail && <Duration>{lengthFormatted}</Duration>}
      </>
    );
  }
  throw new Error('Invalid media element type.');
}

MediaElement.propTypes = {
  index: PropTypes.number.isRequired,
  resource: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  onInsert: PropTypes.func,
  providerType: PropTypes.string,
};

MediaElement.defaultProps = {
  providerType: 'local',
};

export default memo(MediaElement);
