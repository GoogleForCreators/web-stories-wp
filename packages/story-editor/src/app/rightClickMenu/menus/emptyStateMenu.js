/*
 * Copyright 2022 Google LLC
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
 * Internal dependencies
 */
import { RIGHT_CLICK_MENU_LABELS } from '../constants';
import { states, useHighlights } from '../../highlights';
import { MediaUploadButton } from '../../../components/form';
import LibraryProvider from '../../../components/library/libraryProvider';
import useOnMediaSelect from '../../../components/library/panes/media/local/useOnMediaSelect';

const MediaButton = () => {
  const { onSelect } = useOnMediaSelect();

  return (
    <MediaUploadButton
      renderButton={(open) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <span onClick={open}>
          {RIGHT_CLICK_MENU_LABELS.UPLOAD_IMAGE_OR_VIDEO}
        </span>
      )}
      onInsert={onSelect}
    />
  );
};

const Wrapper = () => (
  <LibraryProvider>
    <MediaButton />
  </LibraryProvider>
);

function EmptyStateMenu({ menuItemProps }) {
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  return [
    {
      label: RIGHT_CLICK_MENU_LABELS.CHOOSE_IMAGE_OR_VIDEO,
      onClick: () => {
        setHighlights({
          highlight: states.MEDIA,
        });
      },
      ...menuItemProps,
    },
    {
      label: <Wrapper />,
      onClick: () => {},
      ...menuItemProps,
    },
    {
      label: RIGHT_CLICK_MENU_LABELS.BROWSE_PAGE_TEMPLATES,
      onClick: () => {
        setHighlights({
          highlight: states.PAGE_TEMPLATES,
        });
      },
      ...menuItemProps,
    },
    {
      label: RIGHT_CLICK_MENU_LABELS.BROWSE_STOCK_IMAGES_AND_VIDEO,
      onClick: () => {
        setHighlights({
          highlight: states.MEDIA3P,
        });
      },
      ...menuItemProps,
    },
  ];
}

EmptyStateMenu.propTypes = {
  menuItemProps: PropTypes.object,
};

export default EmptyStateMenu;
