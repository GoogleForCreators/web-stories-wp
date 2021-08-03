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
import {
  Modal,
  RangeControl,
  SelectControl,
  Button,
  TextControl,
  RadioControl,
} from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { updateViewSettings } from '../utils';
import { webStoriesData } from '../utils/globals';
import name from '../store/name';

import TinyMceToggle from './controls/Toggle';

const WebStoriesModal = (props) => {
  const { modalOpen, settings, prepareShortCode } = props;
  const {
    author,
    date,
    title,
    number_of_stories,
    order,
    orderby,
    view,
    excerpt,
    image_alignment,
    archive_link,
    circle_size,
    number_of_columns,
    sharp_corners,
    archive_link_label,
  } = settings;
  const { views = {}, fields } = webStoriesData;

  const displayField = (fieldName) =>
    fields?.[view][fieldName].show && !fields?.[view][fieldName].hidden;

  if (!modalOpen) {
    return null;
  }

  return (
    <Modal
      onRequestClose={() => {
        dispatch(name).toggleModal(false);
      }}
      closeButtonLabel={__('Close', 'web-stories')}
      title={__('Web Stories', 'web-stories')}
      className={'component_web_stories_mce_model'}
      shouldCloseOnClickOutside={false}
    >
      <SelectControl
        label={__('Select Layout', 'web-stories')}
        value={view}
        options={views}
        onChange={(view_type) => {
          dispatch(name).setCurrentView(view_type);
        }}
      />

      <RangeControl
        label={__('Number of Stories', 'web-stories')}
        value={number_of_stories}
        min={1}
        max={20}
        onChange={(value) => {
          updateViewSettings({
            fieldObj: Number(value),
            field: 'number_of_stories',
          });
        }}
      />

      <SelectControl
        label={__('Order By', 'web-stories')}
        value={orderby}
        options={[
          {
            value: 'post_date',
            label: __('Date', 'web-stories'),
          },
          {
            value: 'post_title',
            label: __('Title', 'web-stories'),
          },
        ]}
        onChange={(value) => {
          updateViewSettings({ fieldObj: value, field: 'orderby' });
        }}
      />

      <SelectControl
        label={__('Order', 'web-stories')}
        value={order}
        options={[
          {
            value: 'ASC',
            label: __('Ascending', 'web-stories'),
          },
          {
            value: 'DESC',
            label: __('Descending', 'web-stories'),
          },
        ]}
        onChange={(value) => {
          updateViewSettings({ fieldObj: value, field: 'order' });
        }}
      />

      <TinyMceToggle field="title" fieldObj={title} />

      <TinyMceToggle field="excerpt" fieldObj={excerpt} />

      <TinyMceToggle field="author" fieldObj={author} />

      <TinyMceToggle field="date" fieldObj={date} />

      {displayField('image_alignment') && (
        <div style={{ margin: '0 0 10px 0' }}>
          <RadioControl
            label={__('Image Alignment', 'web-stories')}
            selected={image_alignment}
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
              updateViewSettings({
                fieldObj: value,
                field: 'image_alignment',
              });
            }}
          />
        </div>
      )}

      <TinyMceToggle field="sharp_corners" fieldObj={sharp_corners} />

      <TinyMceToggle field="archive_link" fieldObj={archive_link} />

      {archive_link?.show && (
        <TextControl
          label={__('Archive Link Label', 'web-stories')}
          value={archive_link_label}
          onChange={(value) => {
            updateViewSettings({
              fieldObj: value,
              field: 'archive_link_label',
            });
          }}
        />
      )}

      {circle_size?.show && (
        <RangeControl
          label={__('Circle Size', 'web-stories')}
          value={circle_size}
          min={80}
          max={200}
          step={5}
          onChange={(size) =>
            updateViewSettings({
              fieldObj: Number(size),
              field: 'circle_size',
            })
          }
        />
      )}

      {displayField('number_of_columns') && (
        <RangeControl
          label={__('Number of Columns', 'web-stories')}
          value={number_of_columns}
          min={1}
          max={4}
          onChange={(value) =>
            updateViewSettings({
              fieldObj: Number(value),
              field: 'number_of_columns',
            })
          }
        />
      )}

      <div style={{ padding: '20px 0' }} className="alignright">
        <Button
          isPrimary
          onClick={() => {
            const editorInstance = select(name).getEditor();
            if (editorInstance) {
              const shortcode = prepareShortCode();
              editorInstance.insertContent(shortcode);
            }

            dispatch(name).toggleModal(false);
          }}
        >
          {__('Insert', 'web-stories')}
        </Button>
        <Button onClick={() => dispatch(name).toggleModal(false)}>
          {__('Cancel', 'web-stories')}
        </Button>
      </div>
    </Modal>
  );
};

const StateFulFieldShape = PropTypes.shape({
  show: PropTypes.bool,
  label: PropTypes.string,
  hidden: PropTypes.bool,
});

WebStoriesModal.propTypes = {
  modalOpen: PropTypes.bool,
  settings: PropTypes.shape({
    author: StateFulFieldShape,
    title: StateFulFieldShape,
    excerpt: StateFulFieldShape,
    image_alignment: StateFulFieldShape,
    archive_link: StateFulFieldShape,
    archive_link_label: PropTypes.string,
    sharp_corners: StateFulFieldShape,
    date: StateFulFieldShape,
    number_of_columns: PropTypes.number,
    number_of_stories: PropTypes.number,
    orderby: PropTypes.string,
    order: PropTypes.string,
    view: PropTypes.string,
    circle_size: PropTypes.number,
  }),
  prepareShortCode: PropTypes.func,
};

export default WebStoriesModal;
