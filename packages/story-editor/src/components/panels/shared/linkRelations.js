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
import {
  Checkbox,
  Link,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { useCallback } from '@googleforcreators/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import { Row } from '../../form';

const LinkTypes = [
  { key: 'sponsored', title: __('Sponsored', 'web-stories') },
  { key: 'nofollow', title: __('Nofollow', 'web-stories') },
];

const CheckboxWrapper = styled.div`
  display: flex;
  padding: 9px 0;
`;

const Label = styled.label`
  margin-left: 12px;
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding: 8px 0;
`;

function LinkRelations({ rel, onChangeRel }) {
  const relHelpLink = __(
    'https://developers.google.com/search/docs/advanced/guidelines/qualify-outbound-links?hl=en',
    'web-stories'
  );

  const onChange = useCallback(
    (value) => {
      const newRel = rel.includes(value)
        ? rel.filter((el) => el !== value)
        : [...rel, value];
      onChangeRel(newRel);
    },
    [onChangeRel, rel]
  );

  return (
    <Row>
      <div>
        <StyledText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Qualify outbound links', 'web-stories')}
        </StyledText>
        {LinkTypes.map(({ key, title }) => (
          <CheckboxWrapper key={key}>
            <Checkbox
              id={key}
              name={key}
              checked={rel?.includes(key)}
              onChange={() => onChange(key)}
            />
            <Label htmlFor={key}>
              <Text
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                as="span"
              >
                {title}
              </Text>
            </Label>
          </CheckboxWrapper>
        ))}
        <Link
          target="_blank"
          href={relHelpLink}
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
        >
          {__('Learn more', 'web-stories')}
        </Link>
      </div>
    </Row>
  );
}
LinkRelations.propTypes = {
  rel: PropTypes.array.isRequired,
  onChangeRel: PropTypes.func.isRequired,
};

export default LinkRelations;
