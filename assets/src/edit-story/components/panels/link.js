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
import styled from 'styled-components';
import { rgba } from 'polished';
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
import { useEffect, useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Input as BaseInput, Row } from '../form';
import { createLink } from '../link';
import { ReactComponent as Close } from '../../icons/close_icon.svg';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

const Note = styled.span`
  color: ${({ theme }) => theme.colors.mg.v1};
  font-size: 11px;
  line-height: 16px;
  margin-bottom: 6px;
`;

/** TODO(@wassgha): Replace with text input component once done */
const Input = styled(BaseInput)`
  width: 100%;
  border: none !important;
  margin: 0;
  border-radius: 4px !important;
`;

/** TODO(@wassgha): Replace with text input component once done */
const InputContainer = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.fg.v3 : theme.colors.fg.v1};
  color: ${({ theme }) => theme.colors.mg.v1};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  border: 1px solid ${({ theme }) => theme.colors.fg.v3} !important;
  border-radius: 4px !important;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const BrandIcon = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.fg.v3};
  border: none;
  margin-right: 8px;
`;

const DeleteButton = styled.button`
  position: absolute;
  right: 8px;
  appearance: none;
  background: ${({ theme }) => rgba(theme.colors.fg.v0, 0.54)};
  width: 16px;
  height: 16px;
  border: none;
  padding: 0px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseIcon = styled(Close)`
  width: 12px;
  height: 12px;
`;

function LinkPanel({ selectedElements, onSetProperties }) {
  const link = getCommonValue(selectedElements, 'link') || null;
  const isFill = getCommonValue(selectedElements, 'isFill');
  const [state, setState] = useState({ link: createLink() });
  useEffect(() => {
    setState({ link });
  }, [link]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };
  const canLink = selectedElements.length === 1 && !isFill;
  const populateMetadata = useCallback(
    debounce(300, async (/** url */) => {
      // TODO(wassgha): Implement getting the page metadata
    })
  );

  useEffect(() => {
    if (state.link?.url) {
      populateMetadata(state.link?.url);
    }
  }, [populateMetadata, state]);

  return (
    <SimplePanel
      name="link"
      title={__('Link', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row>
        <Note>
          {__('Enter an address to apply a 1 or 2 tap link', 'web-stories')}
        </Note>
      </Row>

      <Row>
        <InputContainer disabled={!canLink}>
          <Input
            type="text"
            disabled={!canLink}
            onChange={(evt) => {
              const { value: url } = evt.target;
              setState({
                ...state,
                link: { ...state.link, url },
              });
            }}
            onBlur={(evt) =>
              evt.target.form.dispatchEvent(new window.Event('submit'))
            }
            placeholder={__('Web address', 'web-stories')}
            value={state.link?.url}
            expand
          />
          {Boolean(state.link) && (
            <DeleteButton
              onClick={() => {
                setState({ link: null });
                onSetProperties({ link: null });
              }}
            >
              <CloseIcon />
            </DeleteButton>
          )}
        </InputContainer>
      </Row>

      {Boolean(state.link) && (
        <Row>
          <InputContainer disabled={!canLink}>
            <Input
              type="text"
              disabled={!canLink}
              onChange={(evt) =>
                setState({
                  ...state,
                  link: { ...state.link, desc: evt.target.value },
                })
              }
              onBlur={(evt) =>
                evt.target.form.dispatchEvent(new window.Event('submit'))
              }
              placeholder={__('Optional description', 'web-stories')}
              value={state.link?.desc}
              isMultiple={link === ''}
              expand
            />
          </InputContainer>
        </Row>
      )}
      {/** TODO(@wassgha): Replace with image upload component */}
      {Boolean(state.link) && (
        <Row>
          <BrandIcon src={state.link?.icon} />
          <span>{__('Optional brand icon', 'web-stories')}</span>
        </Row>
      )}
    </SimplePanel>
  );
}

LinkPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default LinkPanel;
