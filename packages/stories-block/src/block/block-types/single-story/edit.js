/*
 * Copyright 2021 Google LLC
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

/* eslint complexity: ["error", { "max": 21 }] -- TODO: Refactor this. */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { ResizableBox } from '@wordpress/components';
import * as compose from '@wordpress/compose';
import { withViewportMatch } from '@wordpress/viewport';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { BlockIcon } from '../../icons';
import FetchSelectedStories from '../../components/storyPicker/fetchSelectedStories';
import EmbedControls from './embedControls';
import EmbedLoadinng from './embedLoading';
import EmbedPlaceholder from './embedPlaceholder';
import EmbedPreview from './embedPreview';
import './edit.css';

const MIN_SIZE = 20;

function StoryEmbedEdit({
  attributes,
  setAttributes,
  className,
  isSelected,
  _isResizable,
}) {
  const {
    url: outerURL = '',
    width = 360,
    height = 600,
    align = 'none',
    poster,
    title,
    stories = [],
  } = attributes;

  const [editingURL, setEditingURL] = useState(false);
  const [localURL, setLocalURL] = useState(outerURL);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [storyData, setStoryData] = useState({});
  const [cannotEmbed, setCannotEmbed] = useState(false);
  const [selectedStoryIds, setSelectedStoryIds] = useState(stories);
  const [selectedStories, _setSelectedStories] = useState([]);

  const showLoadingIndicator = isFetchingData;
  const showPlaceholder = !localURL || !outerURL || editingURL || cannotEmbed;

  const isResizable = compose.useViewportMatch
    ? compose.useViewportMatch('medium')
    : _isResizable;

  const ref = useRef();

  useEffect(() => {
    if (attributes.stories.toString() !== selectedStoryIds.toString()) {
      setAttributes({
        stories: selectedStoryIds,
      });
    }
  }, [attributes.stories, setAttributes, selectedStoryIds]);

  useEffect(() => {
    if (selectedStoryIds.length && !selectedStories.length) {
      setIsFetching(true);
    }
  }, [selectedStoryIds, selectedStories, setIsFetching]);

  useEffect(() => {
    setLocalURL(outerURL);
    trackEvent('story_embedded');
  }, [outerURL]);

  useEffect(() => {
    trackEvent('story_poster_changed');
  }, [poster]);

  useEffect(() => {
    if (ref.current && window.AmpStoryPlayer) {
      const player = new window.AmpStoryPlayer(window, ref.current);
      player.load();
    }
  }, [showLoadingIndicator, showPlaceholder, isResizable]);

  const fetchStoryData = useCallback(
    async (url) => {
      if (!url) {
        return;
      }

      try {
        setIsFetchingData(true);
        // Normalize input URL.
        const urlToEmbed = encodeURIComponent(new URL(url).toString());

        const data = await apiFetch({
          path: `web-stories/v1/embed?url=${urlToEmbed}`,
        });

        setCannotEmbed(!(typeof data?.title === 'string'));
        setStoryData(data);
        setAttributes({
          url: url,
        });
      } catch (err) {
        // Only care about errors from apiFetch
        if (!(err instanceof TypeError)) {
          setStoryData(err);
        }

        setCannotEmbed(true);
      } finally {
        setIsFetchingData(false);
      }
    },
    [setAttributes]
  );

  useEffect(() => {
    if (storyData?.title || storyData?.poster) {
      setAttributes({
        title: storyData?.title,
        poster: storyData?.poster,
      });
    }
  }, [outerURL, setAttributes, storyData?.title, storyData?.poster]);

  const setSelectedStories = useCallback(
    (newStories) => {
      _setSelectedStories(newStories);
      setSelectedStoryIds(newStories.map((story) => story.id));
      const newStory = newStories?.[0];
      const link = newStory?.link;
      const data = {
        title: newStory?.title?.rendered,
        poster: newStory?._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      };
      setStoryData(data);
      setLocalURL(link);
      setEditingURL(false);
      setCannotEmbed(false);
      setAttributes({
        url: link,
      });
    },
    [_setSelectedStories, setAttributes]
  );

  const onSubmit = useCallback(
    (url) => {
      _setSelectedStories([]);
      setSelectedStoryIds([]);
      setEditingURL(false);
      setCannotEmbed(false);
      setLocalURL(url);

      if (url !== outerURL) {
        fetchStoryData(url);
      }
    },
    [outerURL, fetchStoryData]
  );

  const switchBackToURLInput = useCallback(() => {
    setEditingURL(true);
  }, []);

  const { isRTL, maxWidth } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    const settings = getSettings();
    return {
      isRTL: settings.isRTL,
      maxWidth: settings.maxWidth,
    };
  }, []);

  const { toggleSelection } = useDispatch(blockEditorStore);

  if (showLoadingIndicator) {
    return <EmbedLoadinng />;
  }

  const onResizeStart = () => toggleSelection(false);
  const onResizeStop = () => toggleSelection(true);

  const label = __('Single Story', 'web-stories');

  if (showPlaceholder) {
    if (isFetching) {
      return (
        <FetchSelectedStories
          icon={<BlockIcon />}
          label={label}
          selectedStoryIds={selectedStoryIds}
          setSelectedStories={_setSelectedStories}
          setIsFetching={setIsFetching}
        />
      );
    }
    return (
      <EmbedPlaceholder
        icon={<BlockIcon />}
        label={label}
        value={localURL}
        onSubmit={onSubmit}
        cannotEmbed={cannotEmbed}
        errorMessage={storyData?.message}
        selectedStories={selectedStories}
        setSelectedStories={setSelectedStories}
      />
    );
  }

  const ratio = width / height;
  const minWidth = width < height ? MIN_SIZE : MIN_SIZE * ratio;
  const minHeight = height < width ? MIN_SIZE : MIN_SIZE / ratio;

  if (!isResizable) {
    return (
      <>
        <EmbedControls
          switchBackToURLInput={switchBackToURLInput}
          poster={poster}
          title={title}
          setAttributes={setAttributes}
          width={width}
          height={height}
          minWidth={Math.ceil(minWidth)}
          maxWidth={Math.floor(maxWidth)}
          minHeight={Math.floor(minHeight)}
          maxHeight={Math.ceil(maxWidth / ratio)}
        />
        <div className={`${className} web-stories-embed align${align}`}>
          <EmbedPreview
            url={outerURL}
            title={title}
            poster={poster}
            ref={ref}
            isSelected={isSelected}
            width={width}
            height={height}
          />
        </div>
      </>
    );
  }

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
        switchBackToURLInput={switchBackToURLInput}
        poster={poster}
        title={title}
        setAttributes={setAttributes}
        width={width}
        height={height}
        minWidth={Math.ceil(minWidth)}
        maxWidth={Math.floor(maxWidth)}
        minHeight={Math.floor(minHeight)}
        maxHeight={Math.ceil(maxWidth / ratio)}
      />
      <div className={`${className} web-stories-embed align${align}`}>
        <ResizableBox
          className={isSelected ? 'show-resize-handle' : 'hide-resize-handle'}
          size={{
            width,
            height,
          }}
          minWidth={minWidth}
          maxWidth={maxWidth}
          minHeight={minHeight}
          maxHeight={maxWidth / ratio}
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
          <EmbedPreview
            url={outerURL}
            title={title}
            poster={poster}
            ref={ref}
            isSelected={isSelected}
            width={width}
            height={height}
          />
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
    stories: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
  }),
  setAttributes: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  _isResizable: PropTypes.bool,
};

export default withViewportMatch({ _isResizable: 'medium' })(StoryEmbedEdit);
