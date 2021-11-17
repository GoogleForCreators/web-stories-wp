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
 * Internal dependencies
 */
import PagePreview from '../../footer/pagepreview';
import { THUMBNAIL_TYPES, THUMBNAIL_DIMENSIONS } from '..';

const LayerIconImageOutput = (
  <img
    src="http://placekitten.com/200/300"
    alt="a cute little kitten"
    height="20"
    crossOrigin="anonymous"
  />
);

const LayerIconVideoOutput = (
  <img
    src="https://storage.coverr.co/p/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk"
    alt="media/coverr:hWGAKF358u"
    width="28"
    height="28"
    crossOrigin="anonymous"
  />
);

const LayerIconShapeOutput = (
  <div className="icon__Container-sc-1f3yf81-0 eqIMqM">
    <div
      width="16"
      height="16"
      className="icon__ShapePreview-sc-1f3yf81-1 iLoXqT"
      style={{
        clipPath:
          "url('#mask-triangle-94fcc48e-5e07-48db-9ab5-a4d8b2314a3f-layer-preview')",
        backgroundColor: '#691818',
      }}
    >
      <svg width="0" height="0">
        <defs>
          <clipPath
            id="mask-triangle-94fcc48e-5e07-48db-9ab5-a4d8b2314a3f-layer-preview"
            transform="scale(1 1)"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M 0.5 0 L 1 1 L 0 1 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  </div>
);

const LayerIconTextOutput = (
  <div>
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      height="30px"
      width="30px"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 9.5a.5.5 0 00-.5.5v1.178a.5.5 0 01-1 0V10a1.5 1.5 0 011.5-1.5h11A1.5 1.5 0 0123 10v1.178a.5.5 0 01-1 0V10a.5.5 0 00-.5-.5h-5v13h2.1a.5.5 0 010 1h-5.2a.5.5 0 010-1h2.1v-13h-5z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const page = {
  elements: [
    {
      opacity: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundColor: {
        color: {
          r: 255,
          g: 255,
          b: 255,
        },
      },
      x: 1,
      y: 1,
      width: 1,
      height: 1,
      mask: {
        type: 'rectangle',
      },
      isBackground: true,
      isDefaultBackground: true,
      type: 'shape',
      id: 'd5753439-bb84-45df-b348-e8d018e05aec',
    },
    {
      opacity: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundColor: {
        color: {
          r: 242,
          g: 242,
          b: 8,
        },
      },
      type: 'shape',
      x: 0,
      y: -49,
      width: 269,
      height: 256,
      scale: 100,
      focalX: 50,
      focalY: 50,
      mask: {
        type: 'star',
      },
      id: '81d3fd2e-2acf-4af1-95fa-373c647621f5',
    },
    {
      opacity: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundColor: {
        color: {
          r: 242,
          g: 242,
          b: 8,
        },
      },
      type: 'shape',
      width: 155,
      height: 148,
      scale: 100,
      focalX: 50,
      focalY: 50,
      mask: {
        type: 'star',
      },
      basedOn: '81d3fd2e-2acf-4af1-95fa-373c647621f5',
      id: 'd2a7bed9-b81b-4f65-9bc5-17a14471e178',
      x: 258,
      y: 136,
    },
    {
      opacity: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundColor: {
        color: {
          r: 242,
          g: 242,
          b: 8,
        },
      },
      type: 'shape',
      width: 301,
      height: 287,
      scale: 100,
      focalX: 50,
      focalY: 50,
      mask: {
        type: 'star',
      },
      basedOn: 'd2a7bed9-b81b-4f65-9bc5-17a14471e178',
      id: '318a9c26-2d6e-43b5-99c0-f6f249c22f6a',
      x: 34,
      y: 330,
    },
  ],
  backgroundColor: {
    color: {
      r: 242,
      g: 12,
      b: 217,
    },
  },
  type: 'page',
  id: '02fef47d-d072-4e4b-a49f-6253eca35fda',
};

const PageThumbnail = (
  <PagePreview
    page={page}
    width={THUMBNAIL_DIMENSIONS.WIDTH}
    height={THUMBNAIL_DIMENSIONS.HEIGHT}
    as="div"
    label="Page Thumbnail"
  />
);

export const THUMBNAIL_BG = {
  [THUMBNAIL_TYPES.IMAGE]: LayerIconImageOutput,
  [THUMBNAIL_TYPES.SHAPE]: LayerIconShapeOutput,
  [THUMBNAIL_TYPES.TEXT]: LayerIconTextOutput,
  [THUMBNAIL_TYPES.VIDEO]: LayerIconVideoOutput,
  [THUMBNAIL_TYPES.PAGE]: PageThumbnail,
};
