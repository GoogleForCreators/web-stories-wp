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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __, TranslateWithMarkup } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Icons } from '../../../../../../design-system';
import ColorAdd from './colorAdd';

const ActionWrapper = styled.div`
  width: 50%;
  display: inline-block;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 30px 10px;
  text-align: center;
  line-height: 20px;
`;

// @todo Use color from design system when theme reference changes.
const Note = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.secondary};
  margin-bottom: 10px;
`;

function EmptyPanel({ handleAddPreset, handleAddLocalPreset }) {
  return (
    <Wrapper>
      <Note>
        <TranslateWithMarkup
          mapping={{
            i: <Icons.Plus width={18} height={13} />,
          }}
        >
          {__(
            'Click on the <i></i> icon to save a color to the Current story or for All stories.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Note>
      <ActionWrapper>
        <ColorAdd
          aria-label={__('Add local color', 'web-stories')}
          handleAddPreset={handleAddLocalPreset}
          helper={__('Current story', 'web-stories')}
        />
      </ActionWrapper>
      <ActionWrapper>
        <ColorAdd
          aria-label={__('Add global color', 'web-stories')}
          handleAddPreset={handleAddPreset}
          helper={__('All stories', 'web-stories')}
        />
      </ActionWrapper>
    </Wrapper>
  );
}

EmptyPanel.propTypes = {
  handleAddLocalPreset: PropTypes.func.isRequired,
  handleAddPreset: PropTypes.func.isRequired,
};

export default EmptyPanel;
