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
import styled, { css } from 'styled-components';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useUnmount,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  calculateSrcSet,
  getMediaSizePositionProps,
} from '@googleforcreators/media';
import {
  DisplayWithMask as WithMask,
  shouldDisplayBorder,
} from '@googleforcreators/masks';
import {
  type MediaElement,
  getTransformFlip,
  type SequenceMediaElement,
  elementIs,
} from '@googleforcreators/elements';
import type { Dispatch, SetStateAction } from 'react';

/**
 * Internal dependencies
 */
import { elementFillContent, elementWithFlip } from '../shared';
import type { EditProps } from '../types';
import EditCropMoveable from './editCropMoveable';
import { mediaWithScale } from './util';
import EditPanMoveable from './editPanMoveable';
import ScalePanel from './scalePanel';
import { MEDIA_MASK_OPACITY } from './constants';
import { CropBox } from '.';

const Element = styled.div`
  ${elementFillContent}
`;

// Opacity of the mask is reduced depending on the opacity assigned to the media.
const fadedMediaCSS = css<{
  opacity?: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  $transformFlip: string | null;
}>`
  position: absolute;
  opacity: ${({ opacity }) =>
    typeof opacity !== 'undefined'
      ? opacity * MEDIA_MASK_OPACITY
      : MEDIA_MASK_OPACITY};
  pointer-events: none;
  ${mediaWithScale}
  ${elementWithFlip}
`;

const FadedImage = styled.img`
  ${fadedMediaCSS}
`;

const FadedVideo = styled.video`
  max-width: initial;
  max-height: initial;
  ${fadedMediaCSS}
`;

// Opacity is adjusted so that the double image opacity would equal
// the opacity assigned to the image.
const cropMediaCSS = css<{
  opacity?: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  $transformFlip?: string | null;
}>`
  ${mediaWithScale}
  ${elementWithFlip}
  position: absolute;
  cursor: grab;
  opacity: ${({ opacity }) =>
    typeof opacity !== 'undefined'
      ? 1 - (1 - opacity) / (1 - opacity * MEDIA_MASK_OPACITY)
      : null};
`;

const CropImage = styled.img`
  ${cropMediaCSS}
`;

// Opacity of the mask is reduced depending on the opacity assigned to the video.
const CropVideo = styled.video`
  max-width: initial;
  max-height: initial;
  ${cropMediaCSS}
`;

// eslint-disable-next-line complexity -- TODO: Refactor to reduce complexity.
function MediaEdit<T extends MediaElement = MediaElement>({
  element,
  box,
  setLocalProperties,
  getProxiedUrl,
  updateElementById,
  zIndexCanvas,
  scaleMin,
  scaleMax,
}: Omit<EditProps<T>, 'isTrimMode'>) {
  const {
    id,
    resource,
    opacity,
    scale,
    flip,
    focalX,
    focalY,
    isBackground,
    isLocked,
    borderRadius,
  } = element;
  const { x, y, width, height, rotationAngle } = box;
  const [fullMedia, setFullMedia] = useState<
    | (T extends SequenceMediaElement ? HTMLVideoElement : HTMLImageElement)
    | null
  >(null);
  const [croppedMedia, setCroppedMedia] = useState<
    | (T extends SequenceMediaElement ? HTMLVideoElement : HTMLImageElement)
    | null
  >(null);
  const [cropBox, setCropBox] = useState<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const isUpdatedLocally = useRef(false);
  const lastLocalProperties = useRef<Partial<T>>({ scale } as Partial<T>);

  const updateLocalProperties = useCallback(
    (properties: Partial<T> | ((p: Partial<T>) => Partial<T>)) => {
      lastLocalProperties.current = {
        ...lastLocalProperties.current,
        ...(typeof properties === 'function'
          ? properties(lastLocalProperties.current)
          : properties),
      };
      isUpdatedLocally.current = true;
      setLocalProperties(lastLocalProperties.current);
    },
    [setLocalProperties]
  );

  const updateProperties = useCallback(() => {
    if (!isUpdatedLocally.current) {
      return;
    }
    isUpdatedLocally.current = false;
    const properties: Partial<T> = lastLocalProperties.current;
    updateElementById({ elementId: id, properties });
  }, [id, updateElementById]);

  useUnmount(updateProperties);

  const isImage = elementIs.media(element) && !elementIs.video(element);
  const isVideo = elementIs.video(element);

  const mediaProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    flip?.horizontal ? 100 - (focalX || 0) : focalX,
    flip?.vertical ? 100 - (focalY || 0) : focalY
  );

  const fadedMediaProps = {
    draggable: false,
    alt: '',
    opacity: (opacity || 100) / 100,
    $transformFlip: getTransformFlip(flip),
    ...mediaProps,
  };

  const cropMediaProps = {
    draggable: false,
    src: resource.src,
    alt: __('Drag to move media element', 'web-stories'),
    opacity: (opacity || 100) / 100,
    tabIndex: 0,
    $transformFlip: getTransformFlip(flip),
    ...mediaProps,
  };

  const url = getProxiedUrl(resource, resource?.src);
  useEffect(() => {
    if (
      croppedMedia &&
      elementRef.current &&
      !elementRef.current.contains(document.activeElement)
    ) {
      croppedMedia.focus();
    }
  }, [croppedMedia]);

  const srcSet = calculateSrcSet(element.resource);

  const handleWheel = useCallback(
    (evt: WheelEvent) => {
      updateLocalProperties(
        ({ scale: oldScale }: Partial<T>) =>
          ({
            scale: Math.min(
              scaleMax,
              Math.max(scaleMin, (oldScale || 0) + evt.deltaY)
            ),
          }) as Partial<T>
      );
      evt.preventDefault();
      evt.stopPropagation();
    },
    [updateLocalProperties, scaleMin, scaleMax]
  );

  // Cancelable wheel events require a non-passive listener, which React
  // can't do on its own, so we need to attach manually.
  useEffect(() => {
    const node = elementRef.current;
    const opts = { passive: false };
    node?.addEventListener('wheel', handleWheel, opts);
    // @ts-expect-error TODO: Fix type.
    return () => node?.removeEventListener('wheel', handleWheel, opts);
  }, [handleWheel]);

  const borderProps =
    shouldDisplayBorder(element) && borderRadius
      ? {
          borderRadius: element.borderRadius,
          width: element.width,
          height: element.height,
          mask: element.mask,
        }
      : null;

  return (
    <Element ref={elementRef}>
      {isImage && (
        /* eslint-disable-next-line styled-components-a11y/alt-text -- False positive. */
        <FadedImage
          {...fadedMediaProps}
          crossOrigin="anonymous"
          ref={
            setFullMedia as Dispatch<SetStateAction<HTMLImageElement | null>>
          }
          src={url || undefined}
          srcSet={calculateSrcSet(resource) || undefined}
        />
      )}
      {isVideo && (
        //eslint-disable-next-line styled-components-a11y/media-has-caption,jsx-a11y/media-has-caption -- Faded video doesn't need captions.
        <FadedVideo
          {...fadedMediaProps}
          crossOrigin="anonymous"
          ref={
            setFullMedia as Dispatch<SetStateAction<HTMLVideoElement | null>>
          }
        >
          {url && <source src={url} type={resource.mimeType} />}
        </FadedVideo>
      )}

      {/* @ts-expect-error TODO: Fix type. */}
      <CropBox ref={setCropBox} {...borderProps}>
        <WithMask element={element} fill applyFlip={false}>
          {}
          {isImage && (
            /*eslint-disable-next-line styled-components-a11y/alt-text -- False positive. */
            <CropImage
              {...cropMediaProps}
              crossOrigin="anonymous"
              ref={
                setCroppedMedia as Dispatch<
                  SetStateAction<HTMLImageElement | null>
                >
              }
              srcSet={srcSet || undefined}
            />
          )}
          {isVideo && (
            /*eslint-disable-next-line styled-components-a11y/media-has-caption,jsx-a11y/media-has-caption -- Tracks might not exist. Also, unwanted in edit mode. */
            <CropVideo
              {...cropMediaProps}
              crossOrigin="anonymous"
              ref={
                setCroppedMedia as Dispatch<
                  SetStateAction<HTMLVideoElement | null>
                >
              }
            >
              <source src={url || undefined} type={resource.mimeType} />
            </CropVideo>
          )}
        </WithMask>
      </CropBox>

      {fullMedia && croppedMedia && (
        <EditPanMoveable
          setProperties={updateLocalProperties}
          fullMedia={fullMedia}
          croppedMedia={croppedMedia}
          flip={flip}
          x={x}
          y={y}
          width={width}
          height={height}
          rotationAngle={rotationAngle}
          offsetX={mediaProps.offsetX}
          offsetY={mediaProps.offsetY}
          mediaWidth={mediaProps.width}
          mediaHeight={mediaProps.height}
        />
      )}

      {!isBackground && !isLocked && cropBox && croppedMedia && (
        <EditCropMoveable
          setProperties={updateLocalProperties}
          cropBox={cropBox}
          croppedMedia={croppedMedia}
          flip={flip}
          x={x}
          y={y}
          width={width}
          height={height}
          rotationAngle={rotationAngle}
          offsetX={mediaProps.offsetX}
          offsetY={mediaProps.offsetY}
          mediaWidth={mediaProps.width}
          mediaHeight={mediaProps.height}
        />
      )}

      <ScalePanel<T>
        aria-label={__('Scale media', 'web-stories')}
        data-testid="edit-panel-slider"
        setProperties={updateLocalProperties}
        x={x}
        y={y}
        width={width}
        height={height}
        scale={scale || 100}
        zIndexCanvas={zIndexCanvas}
        min={scaleMin}
        max={scaleMax}
      />
    </Element>
  );
}

export default MediaEdit;
