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
import {
  useCallback,
  useDebouncedCallback,
  useEffect,
  useState,
} from '@googleforcreators/react';
import { __, _x, TranslateWithMarkup, sprintf } from '@googleforcreators/i18n';
import {
  DropDown,
  Search,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import styled from 'styled-components';
import { TEXT_INPUT_DEBOUNCE } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import {
  InlineLink,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
} from '../components';
import { ARCHIVE_TYPE } from '../../../constants';

export const TEXT = {
  LABEL: __('Stories Archives', 'web-stories'),
  SECTION_HEADING: __('Stories Archives', 'web-stories'),
  ARCHIVE_CONTENT: __(
    "By default WordPress automatically creates an archive page, displaying your latest stories in your theme's layout.",
    'web-stories'
  ),
  ARCHIVE_CONTENT_2: __(
    'You can customize or disable this behavior.',
    'web-stories'
  ),
  SUB_TEXT_CUSTOM: __(
    'Choose a page to serve as your Web Stories archive. Use the Web Stories block to add stories to this page.',
    'web-stories'
  ),
};

const OPTIONS = [
  {
    label: _x('Default', 'archive type', 'web-stories'),
    value: ARCHIVE_TYPE.DEFAULT,
  },
  {
    label: __('Disabled', 'web-stories'),
    value: ARCHIVE_TYPE.DISABLED,
  },
  {
    label: __('Create your own', 'web-stories'),
    value: ARCHIVE_TYPE.CUSTOM,
  },
];

const SearchWrapper = styled.div`
  padding-top: 12px;
`;

export default function ArchiveSettings({
  archive = ARCHIVE_TYPE.DEFAULT,
  archiveURL: _archiveURL,
  defaultArchiveURL,
  archivePageId,
  updateSettings,
  searchPages,
  getPageById,
}) {
  const [archiveURL, setArchiveURL] = useState(_archiveURL);
  const [selectedPage, setSelectedPage] = useState(
    archivePageId ? { value: archivePageId } : undefined
  );
  const [searchOptions, setSearchOptions] = useState([]);

  const onChangeArchive = useCallback(
    (_, newArchive) => {
      // TODO: Get archive URL from REST API instead of config.
      // This way, when changing from "Custom" to "Default", we can display
      // the default "/web-stories/" URL again. Otherwise that's not possible.
      setArchiveURL(_archiveURL);
      const newArchivePageId =
        newArchive === ARCHIVE_TYPE.CUSTOM ? archivePageId : 0;
      setSelectedPage(newArchivePageId);
      updateSettings({
        archive: newArchive,
        archivePageId: newArchivePageId,
      });
    },
    [updateSettings, archivePageId, _archiveURL]
  );

  const onChangeArchivePageId = useCallback(
    (_, newArchivePage) => {
      const newValue = Number(newArchivePage.value);
      if (newValue !== archivePageId) {
        setSelectedPage(newValue ? { value: newValue } : undefined);
        updateSettings({ archivePageId: newValue });
      }
    },
    [archivePageId, updateSettings]
  );

  useEffect(() => {
    let mounted = true;

    if (archivePageId && ARCHIVE_TYPE.CUSTOM === archive) {
      (async () => {
        const { title, link } = await getPageById(archivePageId);
        if (mounted && title) {
          const newOption = { value: archivePageId, label: title };
          setSearchOptions((options) => [newOption, ...options]);
          setSelectedPage(newOption);
          setArchiveURL(link);
        }
      })();
    }

    return () => {
      mounted = false;
    };
  }, [archive, archivePageId, getPageById]);

  const handleSearchChange = useDebouncedCallback(async (value) => {
    await trackEvent('archive_page_search', {
      search_type: 'dashboard',
      search_term: value,
    });
    setSearchOptions(await searchPages(value));
  }, TEXT_INPUT_DEBOUNCE);
  return (
    <SettingForm>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {TEXT.ARCHIVE_CONTENT}
        </TextInputHelperText>
        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {TEXT.ARCHIVE_CONTENT_2}
        </TextInputHelperText>
      </div>
      <div>
        <DropDown
          ariaLabel={TEXT.LABEL}
          options={OPTIONS}
          selectedValue={archive}
          onMenuItemClick={onChangeArchive}
          fillWidth
        />
        {ARCHIVE_TYPE.DISABLED === archive && (
          <TextInputHelperText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            <TranslateWithMarkup
              mapping={{
                code: <code />,
              }}
            >
              {sprintf(
                /* translators: %s: archive url. */
                __(
                  'Turn off the default archive page at <code>%s</code>. Users will see a 404 Not Found page when trying to access the default archive page.',
                  'web-stories'
                ),
                archiveURL
              )}
            </TranslateWithMarkup>
          </TextInputHelperText>
        )}
        {ARCHIVE_TYPE.CUSTOM === archive && (
          <TextInputHelperText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            {TEXT.SUB_TEXT_CUSTOM}
          </TextInputHelperText>
        )}
        {ARCHIVE_TYPE.CUSTOM === archive && (
          <SearchWrapper>
            <Search
              placeholder={__('Select page', 'web-stories')}
              selectedValue={selectedPage}
              options={searchOptions}
              handleSearchValueChange={handleSearchChange}
              emptyText={__('No pages available', 'web-stories')}
              onMenuItemClick={onChangeArchivePageId}
            />
          </SearchWrapper>
        )}
        {ARCHIVE_TYPE.DISABLED !== archive && (
          <TextInputHelperText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            <TranslateWithMarkup
              mapping={{
                a: (
                  <InlineLink
                    href={archiveURL}
                    target="_blank"
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                    as="a"
                  />
                ),
                code: <code />,
              }}
            >
              {archivePageId && archiveURL !== defaultArchiveURL
                ? sprintf(
                    /* translators: 1. current archive url, 2. default archive url. */
                    __(
                      'Visit archive page at <a>%1$s</a>. <code>%2$s</code> will automatically redirect to this page.',
                      'web-stories'
                    ),
                    archiveURL,
                    defaultArchiveURL
                  )
                : sprintf(
                    /* translators: %s: archive url. */
                    __('Visit archive page at <a>%1$s</a>.', 'web-stories'),
                    archiveURL
                  )}
            </TranslateWithMarkup>
          </TextInputHelperText>
        )}
      </div>
    </SettingForm>
  );
}

ArchiveSettings.propTypes = {
  archive: PropTypes.string.isRequired,
  archiveURL: PropTypes.string.isRequired,
  defaultArchiveURL: PropTypes.string.isRequired,
  updateSettings: PropTypes.func.isRequired,
  searchPages: PropTypes.func.isRequired,
  archivePageId: PropTypes.number.isRequired,
  getPageById: PropTypes.func.isRequired,
};

ArchiveSettings.defaultProps = {
  archive: ARCHIVE_TYPE.DEFAULT,
};
