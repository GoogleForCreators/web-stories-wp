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
import { elementTypes } from '../elements';
import ActionsPanel from './actions';
import ColorPanel from './color';
import BackgroundColorPanel from './backgroundColor';
import FullbleedPanel from './fullbleed';
import FontPanel from './font';
import RotationPanel from './rotationAngle';
import SizePanel from './size';
import PositionPanel from './position';
import ScalePanel from './scale';
import StylePanel from './style';
import TextPanel from './text';
import VideoPosterPanel from './videoPoster';

const ACTIONS = 'actions';
const COLOR = 'color';
const SCALE = 'scale';
const FONT = 'font';
const ROTATION_ANGLE = 'rotationAngle';
const TEXT = 'text';
const SIZE = 'size';
const POSITION = 'position';
const FULLBLEED = 'fullbleed';
const BACKGROUND_COLOR = 'backgroundColor';
const STYLE = 'style';
const VIDEO_POSTER = 'videoPoster';

export const PanelTypes = {
	ACTIONS,
	POSITION,
	SIZE,
	SCALE,
	BACKGROUND_COLOR,
	COLOR,
	FONT,
	STYLE,
	TEXT,
	ROTATION_ANGLE,
	FULLBLEED,
	VIDEO_POSTER,
};

const ALL = Object.values( PanelTypes );

function intersect( a, b ) {
	return a.filter( ( v ) => b.includes( v ) );
}

export function getPanels( elements ) {
	if ( elements.length === 0 ) {
		return [];
	}

	// Panels to always display, independent of the selected element.
	const sharedPanels = [
		{ type: ACTIONS, Panel: ActionsPanel },
	];

	// Find which panels all the selected elements have in common
	const selectionPanels = elements
		.map( ( { type } ) => elementTypes.find( ( elType ) => elType.type === type ).panels )
		.reduce( ( commonPanels, panels ) => intersect( commonPanels, panels ), ALL )
		.map( ( type ) => {
			switch ( type ) {
				case POSITION: return { type, Panel: PositionPanel };
				case SCALE: return { type, Panel: ScalePanel };
				case ROTATION_ANGLE: return { type, Panel: RotationPanel };
				case SIZE: return { type, Panel: SizePanel };
				case FULLBLEED: return { type, Panel: FullbleedPanel };
				case BACKGROUND_COLOR: return { type, Panel: BackgroundColorPanel };
				case COLOR: return { type, Panel: ColorPanel };
				case FONT: return { type, Panel: FontPanel };
				case STYLE: return { type, Panel: StylePanel };
				case TEXT: return { type, Panel: TextPanel };
				case VIDEO_POSTER: return { type, Panel: VideoPosterPanel };
				default: throw new Error( `Unknown panel: ${ type }` );
			}
		} );
	return [
		...sharedPanels,
		...selectionPanels,
	];
}
