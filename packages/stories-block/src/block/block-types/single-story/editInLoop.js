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

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { Placeholder, ResizableBox } from '@wordpress/components';
import * as compose from '@wordpress/compose';
import { withViewportMatch } from '@wordpress/viewport';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as blockEditorStore, BlockIcon } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import LoaderContainer from '../../components/loaderContainer';
import { BlockIcon as Icon } from '../../icons';
import EmbedLoading from './embedLoading';
import EmbedPreview from './embedPreview';
import './edit.css';
import Singleton from './singleton';
import EmbedControlsInLoop from './embedControlsInLoop';

const MIN_SIZE = 20;

function StoryEmbedEditInLoop({
  attributes,
  setAttributes,
  className,
  isSelected,
  _isResizable,
  context = {},
}) {
  const {
    width = 360,
    height = 600,
    align = 'none',
    previewOnly = false,
  } = attributes;

  const { postId } = context;

  const { story, isFetching } = useSelect(
    (select) => {
      const { getEntityRecord, isResolving } = select(coreStore);

      let story = null;

      const record = getEntityRecord('postType', 'web-story', postId);

      if (record) {
        story = {
          url: record.link,
          title: record.title?.rendered,
          poster: record._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        };
      }

      return {
        story,
        isFetching: isResolving('postType', 'web-story', postId) || false,
      };
    },
    [postId]
  );

  const { isRTL, maxWidth } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    const settings = getSettings();
    return {
      isRTL: settings.isRTL,
      maxWidth: settings.maxWidth,
    };
  }, []);

  const isResizable = compose.useViewportMatch
    ? compose.useViewportMatch('medium')
    : _isResizable;

  const ref = useRef();

  useEffect(() => {
    if (ref.current && window.AmpStoryPlayer && !previewOnly) {
      const player = new window.AmpStoryPlayer(window, ref.current);
      try {
        player.load();
      } catch {
        // Player already loaded.
      }
    }
  }, [story, isResizable, previewOnly]);

  const { toggleSelection } = useDispatch(blockEditorStore);

  if (isFetching) {
    return <EmbedLoading />;
  }

  const onResizeStart = () => toggleSelection(false);
  const onResizeStop = () => toggleSelection(true);

  const label = __('Single Story', 'web-stories');

  if (isFetching) {
    return (
      <Placeholder
        icon={<BlockIcon icon={<Icon />} showColors />}
        label={label}
        className="wp-block-web-stories-embed"
        instructions={false}
      >
        <LoaderContainer>{__('Loading Story…', 'web-stories')}</LoaderContainer>
      </Placeholder>
    );
  }

  const ratio = width / height;
  const minWidth = width < height ? MIN_SIZE : MIN_SIZE * ratio;
  const minHeight = height < width ? MIN_SIZE : MIN_SIZE / ratio;

  const previewClassName = classNames(
    className,
    { 'web-stories-embed': !previewOnly },
    { 'web-stories-singleton': previewOnly },
    `align${align || 'none'}`
  );

  if (!isResizable) {
    return (
      <>
        <EmbedControlsInLoop
          setAttributes={setAttributes}
          width={width}
          height={height}
          minWidth={Math.ceil(minWidth)}
          maxWidth={Math.floor(maxWidth)}
          minHeight={Math.floor(minHeight)}
          maxHeight={Math.ceil(maxWidth / ratio)}
        />
        <div className={previewClassName}>
          {previewOnly ? (
            <Singleton
              title={story.title}
              poster={story.poster}
              width={width}
              height={height}
            />
          ) : (
            <EmbedPreview
              url={story.url}
              title={story.title}
              poster={story.poster}
              ref={ref}
              isSelected={isSelected}
              width={width}
              height={height}
            />
          )}
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
      <EmbedControlsInLoop
        setAttributes={setAttributes}
        width={width}
        height={height}
        minWidth={Math.ceil(minWidth)}
        maxWidth={Math.floor(maxWidth)}
        minHeight={Math.floor(minHeight)}
        maxHeight={Math.ceil(maxWidth / ratio)}
        previewOnly={previewOnly}
      />
      <div className={previewClassName}>
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
          {previewOnly ? (
            <Singleton
              title={story.title}
              poster={story.poster}
              width={width}
              height={height}
            />
          ) : (
            <EmbedPreview
              url={story.url}
              title={story.title}
              poster={story.poster}
              ref={ref}
              isSelected={isSelected}
              width={width}
              height={height}
            />
          )}
        </ResizableBox>
      </div>
    </>
  );
}

StoryEmbedEditInLoop.propTypes = {
  attributes: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    poster: PropTypes.string,
    stories: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
    previewOnly: PropTypes.bool,
  }),
  setAttributes: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  _isResizable: PropTypes.bool,
  context: PropTypes.shape({
    postType: PropTypes.string,
    postId: PropTypes.number,
  }),
};

export default withViewportMatch({ _isResizable: 'medium' })(
  StoryEmbedEditInLoop
);
