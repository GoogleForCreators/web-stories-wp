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
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app/config';

const StyledPrice = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
color: ${({ theme }) => theme.colors.fg.tertiary}
`;

function ProductPrice({ price, currency }) {
  const {
    locale: { locale },
  } = useConfig();

  if (price) {
    return (
      <StyledPrice>
        {new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
        }).format(price)}
      </StyledPrice>
    );
  }

  return null;
}

ProductPrice.propTypes = {
  price: PropTypes.number,
  currency: PropTypes.string,
};

export default ProductPrice;
