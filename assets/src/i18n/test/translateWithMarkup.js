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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import TranslateWithMarkup from '../translateWithMarkup';

describe('TranslateWithMarkup component', () => {
  it('returns same string when it contains no tokens', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ foo: <strong /> }}>
        {'This is a string'}
      </TranslateWithMarkup>
    );

    expect(result).toStrictEqual('This is a string');
  });

  it('returns same string when it contains a non-matching token', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ foo: <strong /> }}>
        {'This is a <span></span> string'}
      </TranslateWithMarkup>
    );

    expect(result).toStrictEqual('This is a <span></span> string');
  });

  it('returns expected react element for component', () => {
    const result = renderToStaticMarkup(
      //eslint-disable-next-line jsx-a11y/anchor-has-content
      <TranslateWithMarkup mapping={{ a: <a href="https://example.com" /> }}>
        {'This is a <a>link</a>!'}
      </TranslateWithMarkup>
    );

    expect(result).toStrictEqual(
      'This is a <a href="https://example.com">link</a>!'
    );
  });

  it('returns expected react element for custom component', () => {
    const string = 'This is a <a>link</a>!';

    const Link = (props) => {
      //eslint-disable-next-line react/prop-types
      return <a {...props}>{props.children}</a>;
    };

    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ a: <Link href="https://example.com" /> }}>
        {string}
      </TranslateWithMarkup>
    );

    expect(result).toStrictEqual(
      'This is a <a href="https://example.com">link</a>!'
    );
  });

  it('returns expected react element for multiple components', () => {
    const Link = (props) => {
      //eslint-disable-next-line react/prop-types
      return <a {...props}>{props.children}</a>;
    };

    const result = renderToStaticMarkup(
      <TranslateWithMarkup
        mapping={{
          a: (
            <Link href="https://example.com" target="_blank" rel="noreferrer" />
          ),
        }}
      >
        {'Read the<br/><a>Get Started story</a>!'}
      </TranslateWithMarkup>
    );

    expect(result).toStrictEqual(
      'Read the<br/><a href="https://example.com" target="_blank" rel="noreferrer">Get Started story</a>!'
    );
  });
});
