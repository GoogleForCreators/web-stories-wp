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
import styled, { css } from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Outline, Primary } from '../button';

const ErrorContainer = styled.div`
  padding: 20px;
`;

const Paragraph = styled.p`
  margin: 0 0 10px 0;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  color: ${({ theme }) => theme.colors.fg.v1};
`;

const LargeButtonStyles = css`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
`;

const InlineOutline = styled(Outline)`
  ${LargeButtonStyles}
  margin-right: 10px;
`;

const InlinePrimary = styled(Primary)`
  ${LargeButtonStyles}
`;

const Actions = styled.div`
  display: flex;
  margin-top: 20px;
`;

function ErrorActions({ error, errorInfo }) {
  const body = encodeURIComponent(`${error}\n\n${errorInfo.componentStack}`);
  const reportUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfRK9gFWMavvGbEWPFUFz8PDgrDE6XdVuh3B9e1Fu549V8BxQ/viewform?entry.1908864204=Report+an+issue&entry.770137249=${body}`;

  const reload = () => {
    window.location.reload(true);
  };

  return (
    <ErrorContainer>
      <Paragraph>{__('Something went wrong!', 'web-stories')}</Paragraph>
      <Paragraph>
        {__(
          'The editor has crashed. Please try reloading the page and report the error using the button below.',
          'web-stories'
        )}
      </Paragraph>
      <Paragraph>
        {__('Apologies for the inconvenience.', 'web-stories')}
      </Paragraph>
      <Actions>
        <InlineOutline onClick={reload}>
          {__('Reload', 'web-stories')}
        </InlineOutline>
        <InlinePrimary
          forwardedAs="a"
          href={reportUrl}
          target="_blank"
          rel="noreferrer"
        >
          {__('Report Error', 'web-stories')}
        </InlinePrimary>
      </Actions>
    </ErrorContainer>
  );
}

ErrorActions.propTypes = {
  error: PropTypes.instanceOf(Error),
  errorInfo: PropTypes.object,
};

export default ErrorActions;
