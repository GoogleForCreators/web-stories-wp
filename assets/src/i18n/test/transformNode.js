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
import { transformNode } from '../translateWithMarkup';

describe('transformNode', () => {
  it('returns text content for text node', () => {
    const actual = transformNode(document.createTextNode('Hello World'));
    expect(actual).toStrictEqual('Hello World');
  });

  it('does not preserve node attributes', () => {
    const node = document.createElement('div');
    node.setAttribute('id', 'foo');
    node.setAttribute('class', 'bar');
    node.textContent = 'Hello World';
    const actual = renderToStaticMarkup(transformNode(node));
    expect(actual).toStrictEqual('<div>Hello World</div>');
  });

  it('does transform children recursively', () => {
    const node = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');
    span.textContent = 'Hello World';
    p.appendChild(span);
    node.appendChild(p);

    const actual = renderToStaticMarkup(transformNode(node));
    expect(actual).toStrictEqual('<div><p><span>Hello World</span></p></div>');
  });

  it('replaces node with mapped component', () => {
    const node = document.createElement('div');
    node.setAttribute('id', 'foo');
    node.setAttribute('class', 'bar');
    node.textContent = 'Hello World';

    //eslint-disable-next-line react/prop-types
    const AwesomeComponent = ({ children }) => {
      return (
        <div id="bar" className="baz">
          {children}
        </div>
      );
    };

    const mapping = {
      div: <AwesomeComponent />,
    };

    const actual = renderToStaticMarkup(transformNode(node, mapping));
    expect(actual).toStrictEqual('<div id="bar" class="baz">Hello World</div>');
  });

  it('replaces nested node with mapped component', () => {
    const node = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');
    span.textContent = 'Hello World';
    p.appendChild(span);
    node.appendChild(p);

    //eslint-disable-next-line react/prop-types
    const AwesomeComponent = ({ children }) => {
      return (
        <span id="bar" className="baz">
          <em>{children}</em>
        </span>
      );
    };

    const mapping = {
      span: <AwesomeComponent />,
    };

    const actual = renderToStaticMarkup(transformNode(node, mapping));
    expect(actual).toStrictEqual(
      '<div><p><span id="bar" class="baz"><em>Hello World</em></span></p></div>'
    );
  });
});
