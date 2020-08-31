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
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  Error,
  GridItemButton,
  Logo,
  RemoveLogoButton,
  SettingForm,
  HelperText,
  FinePrintHelperText,
  UploadedContainer,
  SettingHeading,
} from '../components';
import { FileUpload } from '../../../../components';
import { Close as RemoveIcon } from '../../../../icons';
import { useGridViewKeys } from '../../../../utils';
import { useConfig } from '../../../config';

export const TEXT = {
  SECTION_HEADING: __('Publisher Logo', 'web-stories'),
  CONTEXT: __(
    'Upload your logos here and they will become available to any stories you create.',
    'web-stories'
  ),
  INSTRUCTIONS: __(
    'Avoid vector files, such as svg or eps. Logos should be at least 96x96 pixels and a perfect square. The background should not be transparent.',
    'web-stories'
  ),
  SUBMIT: __('Upload logo', 'web-stories'),
  ARIA_LABEL: __('Click to upload a new logo', 'web-stories'),
  HELPER_UPLOAD: __(
    'Drag a jpg, png, or static gif in this box. Or click “Upload logo” below.',
    'web-stories'
  ),
};

function PublisherLogoSettings({
  canUploadFiles,
  handleAddLogos,
  handleRemoveLogo,
  isLoading,
  publisherLogos,
  uploadError,
}) {
  const { isRTL } = useConfig();

  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});
  const isInteractive = publisherLogos.length > 1;
  const [activePublisherLogo, _setActivePublisherLogoId] = useState(null);
  const publisherLogosById = useMemo(() => publisherLogos.map(({ id }) => id), [
    publisherLogos,
  ]);

  const onRemoveLogoClick = useCallback(
    (e, { publisherLogo, idx }) => {
      e.preventDefault();
      const moveFocusByIndex =
        idx > 1 ? publisherLogosById[idx - 1] : publisherLogosById[0];
      handleRemoveLogo(publisherLogo);

      // need to delete the removed logo from itemRefs & move focus to moveFocusByIndex value
      const currentCopy = { ...itemRefs.current };
      itemRefs.current = Object.keys(currentCopy).reduce((acc, itemId) => {
        if (itemId === publisherLogo.id.toString()) {
          return acc;
        }

        return {
          ...acc,
          [itemId]: currentCopy[itemId],
        };
      }, {});

      itemRefs.current[moveFocusByIndex].focus();

      setActivePublisherLogoId(moveFocusByIndex);
    },
    [handleRemoveLogo, publisherLogosById, setActivePublisherLogoId]
  );

  const setActivePublisherLogoId = useCallback((id) => {
    _setActivePublisherLogoId(id);
  }, []);

  useEffect(() => {
    if (publisherLogos.length > 0 && !activePublisherLogo) {
      setActivePublisherLogoId(publisherLogos?.[0].id);
    }
  }, [activePublisherLogo, publisherLogos, setActivePublisherLogoId]);

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: activePublisherLogo,
    items: publisherLogos,
  });
  return (
    <SettingForm>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
        <HelperText>{TEXT.CONTEXT}</HelperText>
      </div>
      <div ref={containerRef}>
        {publisherLogos.length > 0 && (
          <UploadedContainer ref={gridRef}>
            {publisherLogos.map((publisherLogo, idx) => {
              if (!publisherLogo) {
                return null;
              }

              const isCurrentLogo = activePublisherLogo === publisherLogo.id;
              const isActive = isCurrentLogo && isInteractive;

              return (
                <div
                  key={`${publisherLogo.title}_${idx}`}
                  data-testid={`publisher-logo-${idx}`}
                  ref={(el) => {
                    itemRefs.current[publisherLogo.id] = el;
                  }}
                >
                  <GridItemButton
                    isSelected={isCurrentLogo}
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePublisherLogoId(publisherLogo.id);
                    }}
                    aria-label={sprintf(
                      /* translators: %s: logo number. */
                      __(
                        'Publisher Logo %s (currently selected)',
                        'web-stories'
                      ),
                      idx + 1
                    )}
                  >
                    <Logo src={publisherLogo.src} alt={publisherLogo.title} />
                    {!publisherLogo.isActive && (
                      <RemoveLogoButton
                        tabIndex={isActive ? 0 : -1}
                        data-testid={`remove-publisher-logo-${idx}`}
                        aria-label={sprintf(
                          /* translators: %s: logo title */
                          __('Remove %s as a publisher logo', 'web-stories'),
                          publisherLogo.title
                        )}
                        onClick={(e) =>
                          onRemoveLogoClick(e, { publisherLogo, idx })
                        }
                      >
                        <RemoveIcon aria-hidden="true" />
                      </RemoveLogoButton>
                    )}
                  </GridItemButton>
                </div>
              );
            })}
          </UploadedContainer>
        )}
        {uploadError && <Error>{uploadError}</Error>}
        {canUploadFiles && (
          <>
            <FileUpload
              onSubmit={handleAddLogos}
              id="settings_publisher_logos"
              isLoading={isLoading}
              label={TEXT.SUBMIT}
              isMultiple
              ariaLabel={TEXT.ARIA_LABEL}
              instructionalText={TEXT.HELPER_UPLOAD}
            />
            <FinePrintHelperText>{TEXT.INSTRUCTIONS}</FinePrintHelperText>
          </>
        )}
      </div>
    </SettingForm>
  );
}

PublisherLogoSettings.propTypes = {
  canUploadFiles: PropTypes.bool,
  handleAddLogos: PropTypes.func,
  handleRemoveLogo: PropTypes.func,
  isLoading: PropTypes.bool,
  publisherLogos: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
      title: PropTypes.string,
      id: PropTypes.number,
    })
  ),
  uploadError: PropTypes.string,
};
export default PublisherLogoSettings;
