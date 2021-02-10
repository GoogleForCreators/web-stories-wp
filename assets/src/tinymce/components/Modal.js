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
import {
  Modal,
  RangeControl,
  SelectControl,
  Button,
} from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { isCircleView, updateViewSettings } from '../utils';
import { webStoriesData } from '../utils/globals';
import name from '../store/name';

import TinyMCEToggle from './controls/Toggle';

const WebStoriesModal = (props) => {
  const { modalOpen, settings, prepareShortCode } = props;
  const {
    author,
    date,
    title,
    number,
    columns,
    order,
    view,
    excerpt,
    image_align,
    archive_link,
    circle_size,
  } = settings;
  const { views, orderlist } = webStoriesData;

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {modalOpen && (
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
            label={__('Select View Type', 'web-stories')}
            value={view}
            options={views}
            onChange={(view_type) => {
              dispatch(name).setCurrentView(view_type);
            }}
          />

          <TinyMCEToggle field={'title'} fieldObj={title} />

          <TinyMCEToggle field={'excerpt'} fieldObj={excerpt} />

          <TinyMCEToggle field={'author'} fieldObj={author} />

          <TinyMCEToggle field={'date'} fieldObj={date} />

          <TinyMCEToggle field={'image_align'} fieldObj={image_align} />

          <TinyMCEToggle field={'archive_link'} fieldObj={archive_link} />

          <RangeControl
            label={__('Number of Stories', 'web-stories')}
            value={number}
            min={1}
            max={20}
            onChange={(items) => {
              updateViewSettings({ fieldObj: items, field: 'number' });
            }}
          />

          {isCircleView() && (
            <RangeControl
              label={__('Circle Size', 'web-stories')}
              value={circle_size}
              min={80}
              max={200}
              step={5}
              onChange={(size) =>
                updateViewSettings({
                  // eslint-disable-next-line radix
                  fieldObj: parseInt(size, 10),
                  field: 'circle_size',
                })
              }
            />
          )}

          {!isCircleView() && (
            <RangeControl
              label={__('Number of Columns', 'web-stories')}
              value={columns}
              min={1}
              max={4}
              onChange={(cols) =>
                updateViewSettings({
                  // eslint-disable-next-line radix
                  fieldObj: parseInt(cols, 10),
                  field: 'columns',
                })
              }
            />
          )}

          <SelectControl
            label={__('Select Order', 'web-stories')}
            value={order}
            options={orderlist}
            onChange={(o) => {
              updateViewSettings({ fieldObj: o, field: 'order' });
            }}
          />

          <div style={{ padding: '20px 0' }} className={'alignright'}>
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
              {__('Okay', 'web-stories')}
            </Button>
            <Button onClick={() => dispatch(name).toggleModal(false)}>
              {__('Cancel', 'web-stories')}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

const StateFulFieldShape = PropTypes.shape({
  show: PropTypes.bool,
  label: PropTypes.string,
  readonly: PropTypes.bool,
});

WebStoriesModal.propTypes = {
  modalOpen: PropTypes.bool,
  settings: PropTypes.shape({
    author: StateFulFieldShape,
    title: StateFulFieldShape,
    excerpt: StateFulFieldShape,
    image_align: StateFulFieldShape,
    archive_link: StateFulFieldShape,
    date: StateFulFieldShape,
    number: PropTypes.number,
    columns: PropTypes.number,
    order: PropTypes.string,
    view: PropTypes.string,
    circle_size: PropTypes.number,
  }),
  prepareShortCode: PropTypes.func,
};

export default WebStoriesModal;
