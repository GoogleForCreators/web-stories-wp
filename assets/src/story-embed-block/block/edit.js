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

/**
 * WordPress dependencies
 */
import { useCallback, useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { ResizableBox } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import EmbedControls from './embedControls';
import EmbedLoadinng from './embedLoading';
import EmbedPlaceholder from './embedPlaceholder';
import StoryPlayer from './storyPlayer';
import { icon } from './index.js';
import './edit.css';

const MIN_SIZE = 20;

function StoryEmbedEdit({ attributes, setAttributes, className, isSelected }) {
  const {
    url: outerURL,
    width = 360,
    height = 600,
    align = 'none',
    poster,
    title,
  } = attributes;

  const [editingURL, setEditingURL] = useState(false);
  const [url, setURL] = useState(outerURL);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [storyData, setStoryData] = useState({});
  const [cannotEmbed, setCannotEmbed] = useState(false);

  useEffect(() => {
    setURL(outerURL);
  }, [outerURL]);

  useEffect(() => {
    if (!outerURL) {
      return;
    }

    try {
      setIsFetchingData(true);
      const urlObj = new URL(outerURL);

      apiFetch({
        path: `web-stories/v1/embed?url=${urlObj.toString()}`,
      })
        .then((data) => {
          const emptyData = !data.title;
          setCannotEmbed(emptyData);

          if (!emptyData) {
            setStoryData(data);
          }
        })
        .catch(() => {
          setCannotEmbed(true);
        })
        .finally(() => {
          setIsFetchingData(false);
        });
    } catch {
      setCannotEmbed(true);
    }
  }, [outerURL]);

  useEffect(() => {
    if (!storyData?.title) {
      return;
    }

    setAttributes({
      url,
      ...storyData,
    });
  }, [url, storyData, setAttributes]);

  const onSubmit = useCallback(
    (event) => {
      if (event) {
        event.preventDefault();
      }

      setEditingURL(false);
      if (url !== outerURL) {
        setAttributes({ url, poster: null, title: null });
      }
    },
    [setAttributes, url, outerURL]
  );

  const switchBackToURLInput = useCallback(() => {
    setEditingURL(true);
  }, []);

  const { isRTL, maxWidth } = useSelect((select) => {
    const { getSettings } = select('core/block-editor');
    const settings = getSettings();
    return {
      isRTL: settings.isRTL,
      maxWidth: settings.maxWidth,
    };
  }, []);

  const { toggleSelection } = useDispatch('core/block-editor');

  if (isFetchingData) {
    return <EmbedLoadinng />;
  }

  const onResizeStart = () => toggleSelection(false);
  const onResizeStop = () => toggleSelection(true);

  const label = __('Web Story URL', 'web-stories');

  if (!url || !outerURL || editingURL || isFetchingData || cannotEmbed) {
    return (
      <EmbedPlaceholder
        icon={icon}
        label={label}
        value={url}
        onSubmit={onSubmit}
        onChange={(event) => setURL(event.target.value)}
        cannotEmbed={cannotEmbed}
      />
    );
  }

  const ratio = width / height;
  const minWidth = width < height ? MIN_SIZE : MIN_SIZE * ratio;
  const minHeight = height < width ? MIN_SIZE : MIN_SIZE / ratio;
  const maxWidthBuffer = maxWidth * 2.5;

  const showRightHandle =
    align === 'center' ||
    align === 'none' ||
    (align === 'right' && isRTL) ||
    (align === 'left' && !isRTL);

  const showLeftHandle =
    align === 'center' ||
    (align === 'left' && isRTL) ||
    (align === 'right' && !isRTL);

  return (
    <>
      <EmbedControls
        showEditButton={true}
        switchBackToURLInput={switchBackToURLInput}
        poster={poster}
        title={title}
        setAttributes={setAttributes}
        width={width}
        height={height}
      />
      <div className={`${className} align${align}`}>
        <ResizableBox
          showHandle={isSelected}
          size={{
            width,
            height,
          }}
          minWidth={minWidth}
          maxWidth={maxWidthBuffer}
          minHeight={minHeight}
          maxHeight={maxWidthBuffer / ratio}
          lockAspectRatio
          enable={{
            top: false,
            right: showRightHandle,
            bottom: true,
            left: showLeftHandle,
          }}
          onResizeStart={onResizeStart}
          onResizeStop={(event, direction, elt, delta) => {
            onResizeStop();
            setAttributes({
              width: parseInt(width + delta.width),
              height: parseInt(height + delta.height),
            });
          }}
        >
          <StoryPlayer url={outerURL} title={title} poster={poster} />
        </ResizableBox>
      </div>
    </>
  );
}

StoryEmbedEdit.propTypes = {
  attributes: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    poster: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
  }),
  setAttributes: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

export default StoryEmbedEdit;
