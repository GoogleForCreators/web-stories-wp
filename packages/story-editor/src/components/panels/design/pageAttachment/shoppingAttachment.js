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
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { CallToActionText, Theme } from './shared';

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ShoppingAttachment({ shoppingAttachment, updateShoppingAttachment }) {
  const { ctaText, theme } = shoppingAttachment;

  return (
    <>
      <Row>
        <HelperText>
          {__(
            'Since there are products on this page, you cannot add a regular page attachment, but only customize the appearance of the shopping call to action.',
            'web-stories'
          )}
        </HelperText>
      </Row>
      <CallToActionText
        value={ctaText}
        defaultValue={__('Shop Now', 'web-stories')}
        onChange={updateShoppingAttachment}
      />
      <Theme theme={theme} onChange={updateShoppingAttachment} />
    </>
  );
}

ShoppingAttachment.propTypes = {
  shoppingAttachment: PropTypes.shape({
    ctaText: PropTypes.string,
    theme: PropTypes.string,
  }).isRequired,
  updateShoppingAttachment: PropTypes.func.isRequired,
};

export default ShoppingAttachment;
