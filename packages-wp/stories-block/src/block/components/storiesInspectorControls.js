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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
  TextControl,
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
  RadioControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
  CIRCLES_VIEW_TYPE,
  GRID_VIEW_TYPE,
  LIST_VIEW_TYPE,
} from '../constants';
import AuthorSelection from './authorSelection';

/**
 * StoriesInspectorControls props.
 *
 * @typedef StoriesInspectorControlsProps
 * @property {string} viewType String indicator of active view type.
 * @property {number} numOfStories Number indicator of maximum number of stories to show.
 * @property {number} numOfColumns Number indicator of number of columns in grid view type.
 * @property {string} orderby Attribute to order stories by.
 * @property {string} order Sorting order (ASC or DESC)
 * @property {boolean} isShowingTitle Whether or not to display story's title.
 * @property {boolean} isShowingDate Whether or not to display story's date.
 * @property {boolean} isShowingAuthor Whether or not to display story's author.
 * @property {boolean} isShowingViewAll Whether or not to display stories archive link.
 * @property {string} archiveLinkLabel Archive link's label.
 * @property {boolean} imageOnRight Whether or not to display images on right side in list view type.
 * @property {Array} authors An array of authors objects which are currently selected.
 * @property {Function} setAttributes Callable function for saving attribute values.
 */

const {
  config: { fieldStates, archiveURL },
} = window.webStoriesBlockSettings;

/**
 * LatestStoriesBlockControls component. Used for rendering block controls of the block.
 *
 * @param {StoriesInspectorControlsProps} props Component props.
 * @return {*} JSX markup.
 */
const StoriesInspectorControls = (props) => {
  const {
    attributes: {
      viewType,
      numOfStories,
      numOfColumns,
      order,
      orderby,
      archiveLinkLabel,
      authors,
      circleSize,
      imageAlignment,
      fieldState,
    },
    setAttributes,
    showFilters = true,
  } = props;

  const firstUpdate = useRef(true);

  useEffect(() => {
    // Set default field state on load.
    const defaultState = {};
    Object.entries(fieldStates[viewType]).forEach(([field, fieldObj]) => {
      const { show } = fieldObj;
      // Initially the fieldState will be an empty object. Set the defaults based on current viewType.
      if (undefined === fieldState[`show_${field}`]) {
        defaultState[`show_${field}`] = show;
      }
    });

    // Prevent unnecessary changes if `defaultState` is empty.
    if (!Object.keys(defaultState).length) {
      return;
    }

    setAttributes({
      fieldState: {
        ...fieldState,
        ...defaultState,
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- We only want to set the values once.

  useEffect(() => {
    // We want to update the fieldState for any viewType change post first render.
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const defaultState = {};
    Object.entries(fieldStates[viewType]).forEach(([field, fieldObj]) => {
      const { show } = fieldObj;
      defaultState[`show_${field}`] = show;
    });

    setAttributes({
      fieldState: defaultState,
    });
  }, [viewType]); // eslint-disable-line react-hooks/exhaustive-deps -- We only want to set the values on viewType change.

  const ArchiveLink = () => {
    return archiveURL ? (
      <a target="__blank" href={archiveURL}>
        {__('View archive page', 'web-stories')}
      </a>
    ) : null;
  };

  const handleToggleControl = (field) => {
    setAttributes({
      fieldState: {
        ...fieldState,
        [`show_${field}`]: !fieldState[`show_${field}`],
      },
    });
  };

  return (
    <InspectorControls>
      <PanelBody
        className="web-stories-settings"
        title={__('Layout Options', 'web-stories')}
      >
        {fieldStates[viewType] &&
          Object.entries(fieldStates[viewType]).map(([field, fieldObj]) => {
            const { label, hidden } = fieldObj;

            // @todo This shouldn't have dependency on field name, update field object appropriately.
            if (
              !hidden &&
              'circle_size' !== field &&
              'image_alignment' !== field
            ) {
              return (
                <ToggleControl
                  key={`${field}__control`}
                  label={label}
                  checked={fieldState[`show_${field}`] || false}
                  onChange={() => handleToggleControl(field)}
                  help={
                    'archive_link' === field &&
                    fieldState[`show_${field}`] && <ArchiveLink />
                  }
                />
              );
            }

            return false;
          })}
        {fieldState['show_archive_link'] && archiveURL && (
          <TextControl
            label={__('Archive Link Label', 'web-stories')}
            value={archiveLinkLabel}
            placeholder={__('View All Stories', 'web-stories')}
            onChange={(newLabel) =>
              setAttributes({ archiveLinkLabel: newLabel })
            }
            className="web-stories-settings-archive-link"
          />
        )}
      </PanelBody>
      {[CIRCLES_VIEW_TYPE, GRID_VIEW_TYPE, LIST_VIEW_TYPE].includes(
        viewType
      ) && (
        <PanelBody
          className="web-stories-settings"
          title={__('Layout and Style Options', 'web-stories')}
        >
          {LIST_VIEW_TYPE === viewType && (
            <RadioControl
              label={__('Image Alignment', 'web-stories')}
              selected={imageAlignment}
              options={[
                {
                  value: 'left',
                  label: __('Left', 'web-stories'),
                },
                {
                  value: 'right',
                  label: __('Right', 'web-stories'),
                },
              ]}
              onChange={(value) => {
                setAttributes({ imageAlignment: value });
              }}
            />
          )}
          {GRID_VIEW_TYPE === viewType && (
            <RangeControl
              label={__('Number of Columns', 'web-stories')}
              value={numOfColumns}
              onChange={(updatedNumOfColumns) =>
                setAttributes({ numOfColumns: updatedNumOfColumns })
              }
              min={1}
              max={4}
              step={1}
            />
          )}
          {CIRCLES_VIEW_TYPE === viewType && (
            <RangeControl
              label={__('Circle Size', 'web-stories')}
              value={circleSize}
              onChange={(updatedcircleSize) =>
                setAttributes({ circleSize: updatedcircleSize })
              }
              min={80}
              max={200}
              step={5}
            />
          )}
        </PanelBody>
      )}
      {showFilters && (
        <PanelBody title={__('Sorting and Filtering', 'web-stories')}>
          <SelectControl
            label={__('Order By', 'web-stories')}
            options={[
              {
                value: 'date',
                label: __('Date', 'web-stories'),
              },
              {
                value: 'title',
                label: __('Title', 'web-stories'),
              },
            ]}
            value={orderby || 'date'}
            onChange={(selection) => setAttributes({ orderby: selection })}
          />
          <SelectControl
            label={__('Order', 'web-stories')}
            options={[
              {
                value: 'asc',
                label: __('Ascending', 'web-stories'),
              },
              {
                value: 'desc',
                label: __('Descending', 'web-stories'),
              },
            ]}
            value={order || 'desc'}
            onChange={(selection) => setAttributes({ order: selection })}
          />
          <AuthorSelection authors={authors} setAttributes={setAttributes} />
          <RangeControl
            label={__('Number of Stories', 'web-stories')}
            value={numOfStories}
            onChange={(updatedNumOfStories) =>
              setAttributes({ numOfStories: updatedNumOfStories })
            }
            min={1}
            max={20}
            step={1}
          />
        </PanelBody>
      )}
    </InspectorControls>
  );
};

StoriesInspectorControls.propTypes = {
  attributes: PropTypes.shape({
    viewType: PropTypes.string,
    numOfStories: PropTypes.number,
    numOfColumns: PropTypes.number,
    orderby: PropTypes.string,
    order: PropTypes.string,
    archiveLinkLabel: PropTypes.string,
    authors: PropTypes.array,
    circleSize: PropTypes.number,
    fieldState: PropTypes.object,
    imageAlignment: PropTypes.string,
  }),
  setAttributes: PropTypes.func.isRequired,
  showFilters: PropTypes.bool,
};

export default StoriesInspectorControls;
