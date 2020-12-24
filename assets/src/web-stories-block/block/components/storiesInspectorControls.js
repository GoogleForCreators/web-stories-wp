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
import { __, sprintf } from '@wordpress/i18n';
import {
  TextControl,
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
  Notice,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { RawHTML, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../dashboard/app/config';
import {
  CAROUSEL_VIEW_TYPE,
  CIRCLES_VIEW_TYPE,
  GRID_VIEW_TYPE,
  ORDER_BY_OPTIONS,
} from '../constants';
import { isShowing } from '../util';
import AuthorSelection from './authorSelection';

/**
 * StoriesInspectorControls props.
 *
 * @typedef StoriesInspectorControlsProps
 *
 * @property {string} viewType String indicator of active view type.
 * @property {number} numOfStories Number indicator of maximum number of stories to show.
 * @property {number} numOfColumns Number indicator of number of columns in grid view type.
 * @property {string} orderByValue String indicator of stories sorting.
 * @property {boolean} isShowingTitle Whether or not to display story's title.
 * @property {boolean} isShowingDate Whether or not to display story's date.
 * @property {boolean} isShowingAuthor Whether or not to display story's author.
 * @property {boolean} isShowingViewAll Whether or not to display stories archive link.
 * @property {string} viewAllLinkLabel Archive link's label.
 * @property {boolean} imageOnRight Whether or not to display images on right side in list view type.
 * @property {Array} authors An array of authors objects which are currently selected.
 * @property {Function} setAttributes Callable function for saving attribute values.
 */

/**
 * LatestStoriesBlockControls component. Used for rendering block controls of the block.
 *
 * @param {StoriesInspectorControlsProps} props Component props.
 *
 * @return {*} JSX markup.
 */
const StoriesInspectorControls = (props) => {
  const {
    attributes: {
      viewType,
      numOfStories,
      numOfColumns,
      orderByValue,
      viewAllLinkLabel,
      authors,
      sizeOfCircles,
      fieldState,
    },
    setAttributes,
    showFilters = true,
  } = props;

  const { fieldStates } = useConfig();

  useEffect(() => {
    // Set default field state on load.
    if (!Object.entries(fieldState).length) {
      setAttributes({
        fieldState: fieldStates,
      });
    }
  }, [fieldState, fieldStates, setAttributes]);

  // Set up sort options.
  const orderByOptions = Object.entries(ORDER_BY_OPTIONS).map(
    ([key, option]) => {
      return {
        label: option.label,
        value: key,
      };
    }
  );

  const previewLink = select('core/editor').getEditedPostPreviewLink();
  const carouselMessage = sprintf(
    /* Translators: Carousel informational message. 1: Preview link. */
    __(
      `<i><b>Note:</b> Carousel view's functionality will not work in Editor. <a target="__blank" href="%1$s">Preview</a> post to see it in action.</i>`,
      'web-stories'
    ),
    previewLink
  );

  return (
    <InspectorControls>
      <PanelBody
        className="web-stories-settings"
        title={__('Story settings', 'web-stories')}
      >
        {CAROUSEL_VIEW_TYPE === viewType && (
          <Notice
            className="web-stories-carousel-message"
            isDismissible={false}
            status="warning"
          >
            <RawHTML>{carouselMessage}</RawHTML>
          </Notice>
        )}

        {fieldState[viewType] &&
          Object.entries(fieldState[viewType]).map(([field, fieldObj]) => {
            const { label, show, readonly } = fieldObj;

            if (!readonly) {
              return (
                <ToggleControl
                  key={`${field}__control`}
                  label={label}
                  checked={show}
                  onChange={() => {
                    if (!readonly) {
                      const updatedSettings = {
                        ...fieldState[viewType],
                        [field]: { ...fieldObj, show: !show },
                      };

                      setAttributes({
                        fieldState: {
                          ...fieldState,
                          [viewType]: updatedSettings,
                        },
                      });
                    }
                  }}
                />
              );
            }

            return false;
          })}
        {fieldState[viewType] &&
          isShowing('archive_link', fieldState[viewType]) && (
            <TextControl
              label={__("'View All Stories' Link label", 'web-stories')}
              value={viewAllLinkLabel}
              placeholder={__('View All Stories', 'web-stories')}
              onChange={(newLabel) =>
                setAttributes({ viewAllLinkLabel: newLabel })
              }
            />
          )}
      </PanelBody>
      {(CIRCLES_VIEW_TYPE === viewType || GRID_VIEW_TYPE === viewType) && (
        <PanelBody
          className="web-stories-settings"
          title={__('Layout & Style Options', 'web-stories')}
        >
          {GRID_VIEW_TYPE === viewType && (
            <RangeControl
              label={__('Number of columns', 'web-stories')}
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
              label={__('Size of the circles', 'web-stories')}
              value={sizeOfCircles}
              onChange={(updatedSizeOfCircles) =>
                setAttributes({ sizeOfCircles: updatedSizeOfCircles })
              }
              min={80}
              max={200}
              step={5}
            />
          )}
        </PanelBody>
      )}
      {showFilters && (
        <PanelBody title={__('Sorting & Filtering', 'web-stories')}>
          <RangeControl
            label={__('Number of stories', 'web-stories')}
            value={numOfStories}
            onChange={(updatedNumOfStories) =>
              setAttributes({ numOfStories: updatedNumOfStories })
            }
            min={1}
            max={20}
            step={1}
          />
          <SelectControl
            label={__('Order by', 'web-stories')}
            options={orderByOptions}
            value={orderByValue}
            onChange={(selection) => setAttributes({ orderByValue: selection })}
          />
          <AuthorSelection authors={authors} setAttributes={setAttributes} />
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
    orderByValue: PropTypes.string,
    viewAllLinkLabel: PropTypes.string,
    authors: PropTypes.array,
    sizeOfCircles: PropTypes.number,
    fieldState: PropTypes.object,
  }),
  setAttributes: PropTypes.func.isRequired,
  showFilters: PropTypes.bool,
};

export default StoriesInspectorControls;
