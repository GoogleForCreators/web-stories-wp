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
 * Internal dependencies
 */
import getColorFromGradientStyle from '../getColorFromGradientStyle';
import { PatternType } from '../types';

describe('getColorFromGradientStyle', () => {
  describe('Linear Gradient', () => {
    describe('with rotation', () => {
      it('should return Linear gradient with two stops', () => {
        expect(
          getColorFromGradientStyle(
            'linear-gradient(0.25turn, #883030 0%, #1cb59b 100%)'
          )
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0.25,
          stops: [
            {
              color: {
                r: 136,
                g: 48,
                b: 48,
              },
              position: 0,
            },
            {
              color: {
                r: 28,
                g: 181,
                b: 155,
              },
              position: 1,
            },
          ],
        });
      });

      it('should return Linear gradient with first stop with transparency', () => {
        expect(
          getColorFromGradientStyle(
            'linear-gradient(0.25turn, rgba(60,171,152,0.57) 0%, #c41d1d 100%)'
          )
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0.25,
          stops: [
            {
              color: {
                r: 60,
                g: 171,
                b: 152,
                a: 0.57,
              },
              position: 0,
            },
            {
              color: {
                r: 196,
                g: 29,
                b: 29,
              },
              position: 1,
            },
          ],
        });
      });

      it('should return Linear gradient with second stop with transparency', () => {
        expect(
          getColorFromGradientStyle(
            'linear-gradient(0.25turn, #a32929 0%, rgba(14,37,33,0.78) 100%)'
          )
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0.25,
          stops: [
            {
              color: {
                r: 163,
                g: 41,
                b: 41,
              },
              position: 0,
            },
            {
              color: {
                r: 14,
                g: 37,
                b: 33,
                a: 0.78,
              },
              position: 1,
            },
          ],
        });
      });

      it('should return Linear gradient with both stops with transparency', () => {
        expect(
          getColorFromGradientStyle(
            'linear-gradient(0.5turn, rgba(60,171,152,0.57) 0%, rgba(196,29,29,0.66) 100%)'
          )
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0.5,
          stops: [
            {
              color: {
                r: 60,
                g: 171,
                b: 152,
                a: 0.57,
              },
              position: 0,
            },
            {
              color: {
                r: 196,
                g: 29,
                b: 29,
                a: 0.66,
              },
              position: 1,
            },
          ],
        });
      });
    });

    describe('without rotation', () => {
      it('should return Linear gradient with two stops', () => {
        expect(
          getColorFromGradientStyle('linear-gradient(#883030 0%, #1cb59b 100%)')
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0,
          stops: [
            {
              color: {
                r: 136,
                g: 48,
                b: 48,
              },
              position: 0,
            },
            {
              color: {
                r: 28,
                g: 181,
                b: 155,
              },
              position: 1,
            },
          ],
        });
      });

      it('should return Linear gradient with first stop with transparency', () => {
        expect(
          getColorFromGradientStyle(
            'linear-gradient(rgba(60,171,152,0.57) 0%, #c41d1d 100%)'
          )
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0,
          stops: [
            {
              color: {
                r: 60,
                g: 171,
                b: 152,
                a: 0.57,
              },
              position: 0,
            },
            {
              color: {
                r: 196,
                g: 29,
                b: 29,
              },
              position: 1,
            },
          ],
        });
      });

      it('should return Linear gradient with second stop with transparency', () => {
        expect(
          getColorFromGradientStyle(
            'linear-gradient(#a32929 0%, rgba(14,37,33,0.78) 100%)'
          )
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0,
          stops: [
            {
              color: {
                r: 163,
                g: 41,
                b: 41,
              },
              position: 0,
            },
            {
              color: {
                r: 14,
                g: 37,
                b: 33,
                a: 0.78,
              },
              position: 1,
            },
          ],
        });
      });

      it('should return Linear gradient with both stops with transparency', () => {
        expect(
          getColorFromGradientStyle(
            'linear-gradient(rgba(60,171,152,0.57) 0%, rgba(196,29,29,0.66) 100%)'
          )
        ).toStrictEqual({
          type: PatternType.Linear,
          rotation: 0,
          stops: [
            {
              color: {
                r: 60,
                g: 171,
                b: 152,
                a: 0.57,
              },
              position: 0,
            },
            {
              color: {
                r: 196,
                g: 29,
                b: 29,
                a: 0.66,
              },
              position: 1,
            },
          ],
        });
      });
    });
  });

  describe('Radial Gradient', () => {
    it('should return Radial gradient with two stops', () => {
      expect(
        getColorFromGradientStyle('radial-gradient(#a971a3 0%, #c1d3aa 100%)')
      ).toStrictEqual({
        type: PatternType.Radial,
        stops: [
          {
            color: {
              r: 169,
              g: 113,
              b: 163,
            },
            position: 0,
          },
          {
            color: {
              r: 193,
              g: 211,
              b: 170,
            },
            position: 1,
          },
        ],
      });
    });

    it('should return Radial gradient with first stop with transparency', () => {
      expect(
        getColorFromGradientStyle(
          'radial-gradient(rgba(178,75,100,0.56) 0%, #c1d3aa 100%)'
        )
      ).toStrictEqual({
        type: PatternType.Radial,
        stops: [
          {
            color: {
              r: 178,
              g: 75,
              b: 100,
              a: 0.56,
            },
            position: 0,
          },
          {
            color: {
              r: 193,
              g: 211,
              b: 170,
            },
            position: 1,
          },
        ],
      });
    });

    it('should return Radial gradient with second stop with transparency', () => {
      expect(
        getColorFromGradientStyle(
          'radial-gradient(#c1d3aa 0%, rgba(178,75,100,0.56) 100%)'
        )
      ).toStrictEqual({
        type: PatternType.Radial,
        stops: [
          {
            color: {
              r: 193,
              g: 211,
              b: 170,
            },
            position: 0,
          },
          {
            color: {
              r: 178,
              g: 75,
              b: 100,
              a: 0.56,
            },
            position: 1,
          },
        ],
      });
    });

    it('should return Radial gradient with both stops with transparency', () => {
      expect(
        getColorFromGradientStyle(
          'radial-gradient(rgba(60,171,152,0.25) 0%, rgba(196,29,29,0.3) 100%)'
        )
      ).toStrictEqual({
        type: PatternType.Radial,
        stops: [
          {
            color: {
              r: 60,
              g: 171,
              b: 152,
              a: 0.25,
            },
            position: 0,
          },
          {
            color: {
              r: 196,
              g: 29,
              b: 29,
              a: 0.3,
            },
            position: 1,
          },
        ],
      });
    });
  });
});
