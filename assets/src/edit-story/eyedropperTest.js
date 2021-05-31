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
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 48%;
  width: 500px;
  transform: translateX(-50%);
  z-index: 9999999;
`;

const EyedropperTest = () => {
  const onGenerateH2I = (selector) => () => {
    const node = document.querySelector(selector);
    htmlToImage
      .toCanvas(node)
      .then(function (canvas) {
        const newTab = window.open();
        newTab.document.body.appendChild(canvas);
        newTab.document.close();
      })
      .catch(function (error) {
        // eslint-disable-next-line no-console
        console.error('Oops, something went wrong!', error);
      });
  };
  const onGenerateH2C = (selector) => () => {
    const node = document.querySelector(selector);
    html2canvas(node).then(function (canvas) {
      const newTab = window.open();
      newTab.document.body.appendChild(canvas);
      newTab.document.close();
    });
  };

  return (
    <Container>
      <div>
        <button onClick={onGenerateH2C('#web-stories-editor')}>
          {
            'Generate image from current editor view using html2canvas (DOM translation)'
          }
        </button>
        <button onClick={onGenerateH2I('#web-stories-editor')}>
          {
            'Generate image from current editor view using html-to-image (SVG foreignObject)'
          }
        </button>
      </div>
      <div style={{ marginTop: 5 }}>
        <button onClick={onGenerateH2C('[data-testid="fullbleed"]')}>
          {
            'Generate image from current canvas view using html2canvas (DOM translation)'
          }
        </button>
        <button onClick={onGenerateH2I('[data-testid="fullbleed"]')}>
          {
            'Generate image from current canvas view using html-to-image (SVG foreignObject)'
          }
        </button>
      </div>
    </Container>
  );
};

export default EyedropperTest;
