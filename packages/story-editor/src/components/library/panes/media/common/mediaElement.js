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
import PropTypes from 'prop-types';
import {
  useEffect,
  useCallback,
  memo,
  useState,
  useRef,
} from '@googleforcreators/react';
import { rgba } from 'polished';
import { __ } from '@googleforcreators/i18n';
import { LoadingBar } from '@googleforcreators/design-system';
import { Blurhash } from 'react-blurhash';

/**
 * Internal dependencies
 */
import DropDownMenu from '../local/dropDownMenu';
import { ContentType, useLocalMedia } from '../../../../../app/media';
import Tooltip from '../../../../tooltip';
import Attribution from './attribution';
import InnerElement from './innerElement';
import InsertionMenu from './insertionMenu';

const AUTOPLAY_PREVIEW_VIDEO_DELAY_MS = 600;

const Container = styled.div.attrs((props) => ({
  style: {
    width: props.width + 'px',
    height: props.height + 'px',
    margin: props.margin,
    backgroundColor: 'transparent',
    color: 'inherit',
    border: 'none',
    padding: 0,
  },
}))``;

const InnerContainer = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 10px;
  background-color: ${({ theme, $baseColor }) =>
    $baseColor ? $baseColor : rgba(theme.colors.standard.black, 0.3)};
`;

const BlurhashContainer = styled(Blurhash)`
  position: absolute !important;
  top: 0;
  left: 0;
`;

function Element({
  index,
  resource,
  width: requestedWidth,
  height: requestedHeight,
  margin,
  onInsert,
  providerType,
  canEditMedia,
}) {
  const {
    id: resourceId,
    src,
    type,
    width: originalWidth,
    height: originalHeight,
    alt,
    isMuted,
    baseColor,
    blurHash,
  } = resource;

  const { isCurrentResourceProcessing, isCurrentResourceUploading } =
    useLocalMedia(({ state }) => ({
      isCurrentResourceProcessing: state.isCurrentResourceProcessing,
      isCurrentResourceUploading: state.isCurrentResourceUploading,
    }));

  const oRatio =
    originalWidth && originalHeight ? originalWidth / originalHeight : 1;
  const width = requestedWidth || requestedHeight / oRatio;
  const height = requestedHeight || width / oRatio;

  const mediaElement = useRef();
  const [showVideoDetail, setShowVideoDetail] = useState(true);
  const [active, setActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const makeActive = useCallback(() => setActive(true), []);
  const makeInactive = useCallback(() => setActive(false), []);
  const onMenuOpen = useCallback(() => setIsMenuOpen(true), []);
  const onMenuCancelled = useCallback(() => setIsMenuOpen(false), []);
  const onMenuSelected = useCallback(() => {
    setIsMenuOpen(false);
    setActive(false);
  }, []);

  const [hoverTimer, setHoverTimer] = useState(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (![ContentType.VIDEO, ContentType.GIF].includes(type)) {
      return undefined;
    }
    const resetHoverTime = () => {
      if (hoverTimer !== null) {
        clearTimeout(hoverTimer);
        setHoverTimer(null);
      }
    };
    if (!isMenuOpen) {
      if (active) {
        setShowVideoDetail(false);
        if (mediaElement.current && hoverTimer == null) {
          const timer = setTimeout(() => {
            if (activeRef.current && src) {
              mediaElement.current.play().catch(() => {});
            }
          }, AUTOPLAY_PREVIEW_VIDEO_DELAY_MS);
          setHoverTimer(timer);
          // Pointer still in the media element, continue the video.
        }
      } else {
        setShowVideoDetail(true);
        resetHoverTime();
        if (mediaElement.current && mediaElement.current?.pause && src) {
          // Stop video and reset position.
          mediaElement.current.pause();
          mediaElement.current.currentTime = 0;
        }
      }
    }
    return resetHoverTime;
  }, [isMenuOpen, active, type, src, hoverTimer, setHoverTimer, activeRef]);

  const onClick = useCallback(
    (thumbnailUrl) => () => {
      onInsert(resource, thumbnailUrl);
    },
    [onInsert, resource]
  );

  const attribution = active &&
    resource.attribution?.author?.displayName &&
    resource.attribution?.author?.url && (
      <Attribution
        author={resource.attribution.author.displayName}
        url={resource.attribution.author.url}
      />
    );

  const ref = useRef();

  const onLoad = useCallback(() => setLoaded(true), []);

  const isPlaceholder = !isLoaded && !active;

  return (
    <Container
      ref={ref}
      data-testid={`mediaElement-${type}`}
      data-id={resourceId}
      className={'mediaElement'}
      width={width}
      height={height}
      margin={margin}
      onPointerEnter={makeActive}
      onFocus={makeActive}
      onPointerLeave={makeInactive}
      onBlur={makeInactive}
      tabIndex="-1"
    >
      <InnerContainer $baseColor={isPlaceholder && baseColor}>
        <InnerElement
          type={type}
          src={src}
          mediaElement={mediaElement}
          resource={resource}
          alt={alt}
          isMuted={isMuted}
          width={width}
          height={height}
          onClick={onClick}
          onLoad={onLoad}
          showVideoDetail={showVideoDetail}
          active={active}
        />
        {attribution}
        {isPlaceholder && blurHash && (
          <BlurhashContainer
            hash={blurHash}
            width={width}
            height={height}
            punch={1}
          />
        )}
        {(!src ||
          isCurrentResourceProcessing(resourceId) ||
          isCurrentResourceUploading(resourceId)) && (
          <LoadingBar loadingMessage={__('Uploading media…', 'web-stories')} />
        )}
        <InsertionMenu
          resource={resource}
          display={active}
          onInsert={onInsert}
          width={width}
          index={index}
          isLocal={providerType === 'local'}
          setParentActive={makeActive}
          setParentInactive={makeInactive}
        />
        {providerType === 'local' && canEditMedia && (
          <DropDownMenu
            resource={resource}
            display={active}
            isMenuOpen={isMenuOpen}
            onMenuOpen={onMenuOpen}
            onMenuCancelled={onMenuCancelled}
            onMenuSelected={onMenuSelected}
            setParentActive={makeActive}
          />
        )}
      </InnerContainer>
    </Container>
  );
}

Element.propTypes = {
  index: PropTypes.number.isRequired,
  resource: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.string,
  onInsert: PropTypes.func,
  providerType: PropTypes.string,
  canEditMedia: PropTypes.bool,
};

/**
 * Get a formatted element for different media types.
 *
 * @param {Object} props Component props.
 * @param {number} props.index Index of the media element in the gallery.
 * @param {Object} props.resource Resource object
 * @param {number} props.width Width that element is inserted into editor.
 * @param {number} props.height Height that element is inserted into editor.
 * @param {string?} props.margin The margin in around the element
 * @param {Function} props.onInsert Insertion callback.
 * @param {string} props.providerType Which provider the element is from.
 * @return {null|*} Element or null if does not map to video/image.
 */
function MediaElement(props) {
  const { isCurrentResourceProcessing, isCurrentResourceUploading } =
    useLocalMedia(({ state }) => ({
      isCurrentResourceProcessing: state.isCurrentResourceProcessing,
      isCurrentResourceUploading: state.isCurrentResourceUploading,
    }));

  const { id: resourceId } = props.resource;

  if (
    isCurrentResourceProcessing(resourceId) ||
    isCurrentResourceUploading(resourceId)
  ) {
    return (
      <Tooltip title={__('Uploading media…', 'web-stories')}>
        <Element {...props} />
      </Tooltip>
    );
  }

  return <Element {...props} />;
}

MediaElement.propTypes = {
  index: PropTypes.number.isRequired,
  resource: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.string,
  onInsert: PropTypes.func,
  providerType: PropTypes.string,
  canEditMedia: PropTypes.bool,
};

MediaElement.defaultProps = {
  providerType: 'local',
  canEditMedia: false,
};

export default memo(MediaElement);
