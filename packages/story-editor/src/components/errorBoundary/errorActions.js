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
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';

const Message = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.6;
  padding: 20px;
  button {
    margin-right: 6px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
`;

const P = styled.p`
  margin: 0 0 8px 0;
`;

const Wrapper = styled.div`
  display: flex;
`;

function ErrorActions({ error, errorInfo }) {
  const textAreaContent = `${error}\n${errorInfo.componentStack}`;
  const reportUrl =
    'https://wordpress.org/support/plugin/web-stories/#new-topic-0';

  const reload = () => {
    window.location.reload(true);
  };

  return (
    <Message>
      <P>{__('Something went wrong!', 'web-stories')}</P>
      <P>
        {__(
          'The editor has crashed. Please try reloading the page and report the error using the button below.',
          'web-stories'
        )}
      </P>
      <P>{__('Apologies for the inconvenience.', 'web-stories')}</P>
      <P>
        <TextArea
          readOnly
          value={textAreaContent}
          onFocus={(e) => e.target.setSelectionRange(0, textAreaContent.length)}
        />
      </P>
      <Wrapper>
        <Button
          variant={BUTTON_VARIANTS.RECTANGLE}
          type={BUTTON_TYPES.QUATERNARY}
          size={BUTTON_SIZES.SMALL}
          onClick={reload}
        >
          {__('Reload', 'web-stories')}
        </Button>
        <Button
          variant={BUTTON_VARIANTS.RECTANGLE}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          href={reportUrl}
          target="_blank"
        >
          {__('Report Error', 'web-stories')}
        </Button>
      </Wrapper>
    </Message>
  );
}

ErrorActions.propTypes = {
  error: PropTypes.instanceOf(Error),
  errorInfo: PropTypes.object,
};

export default ErrorActions;
