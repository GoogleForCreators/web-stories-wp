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

const blockAttributes = {
  url: {
    type: 'string',
  },
  title: {
    type: 'string',
  },
  poster: {
    type: 'string',
  },
  width: {
    type: 'number',
    default: 360,
  },
  height: {
    type: 'number',
    default: 600,
  },
  align: {
    type: 'string',
    default: 'none',
  },
};

/**
 * The block's save function (pure).
 *
 * Represents a cached copy of the block’s content to be shown in case
 * the plugin is disabled.
 *
 * The server-side 'render_callback' is used to override this on page load.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/
 * @param {Object} props Props.
 * @param {Object} props.attributes Block attributes.
 * @return {null|*} Rendered block.
 */
function save({ attributes }) {
  const { url, title, poster, width, height, align = 'none' } = attributes;

  if (!url || !title) {
    return null;
  }

  return (
    <div className={`wp-block-web-stories-embed align${align}`}>
      <amp-story-player
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
        data-testid="amp-story-player"
      >
        <a
          href={url}
          style={{
            ['--story-player-poster']: poster ? `url('${poster}')` : undefined,
          }}
        >
          {title}
        </a>
      </amp-story-player>
    </div>
  );
}

save.propTypes = {
  attributes: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    poster: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
  }).isRequired,
};

/**
 * The block's save function (pure).
 *
 * Represents a cached copy of the block’s content to be shown in case
 * the plugin is disabled.
 *
 * The server-side 'render_callback' is used to override this on page load.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/
 * @param {Object} props Props.
 * @param {Object} props.attributes Block attributes.
 * @return {null|*} Rendered block.
 */
function saveV2({ attributes }) {
  const { url, title, poster, width, height, align = 'none' } = attributes;

  if (!url || !title) {
    return null;
  }

  return (
    <div className={`wp-block-web-stories-embed align${align}`}>
      <a href={url}>
        {poster ? (
          <img alt={title} src={poster} width={width} height={height} />
        ) : (
          title
        )}
      </a>
    </div>
  );
}

saveV2.propTypes = {
  attributes: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    poster: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
  }).isRequired,
};

const v1 = {
  attributes: blockAttributes,
  save,
};

const v2 = {
  attributes: blockAttributes,
  migrate(attrs) {
    return {
      ...attrs,
      blockType: 'url',
      stories: [],
      viewType: '',
      numOfStories: 5,
      numOfColumns: 2,
      circleSize: 96,
      orderby: '',
      order: '',
      archiveLinkLabel: '',
      authors: [],
      fieldState: {},
    };
  },
  save: saveV2,
  isEligible({ url, blockType }) {
    return Boolean(!blockType && url && url.trim().length);
  },
};

// The deprecations in the array should be in reverse chronological order.
// This allows the block editor to attempt to apply the most recent and likely deprecations first,
// avoiding unnecessary and expensive processing.
const deprecated = [v2, v1];

export default deprecated;
