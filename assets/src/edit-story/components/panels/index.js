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
import { elementTypes } from '../../elements';
import ActionsPanel from './actions';
import BackgroundPanel from './background';
import ColorPanel from './color';
import BackgroundColorPanel from './backgroundColor';
import FillPanel from './fill';
import FontPanel from './font';
import RotationPanel from './rotationAngle';
import SizePanel from './size';
import PositionPanel from './position';
import ScalePanel from './scale';
import StylePanel from './style';
import TextPanel from './text';
import VideoPosterPanel from './videoPoster';
export { default as LayerPanel } from './layer';
export { default as ColorPresetPanel } from './colorPreset';

const ACTIONS = 'actions';
const BACKGROUND = 'background';
const COLOR = 'color';
const SCALE = 'scale';
const FONT = 'font';
const ROTATION_ANGLE = 'rotationAngle';
const TEXT = 'text';
const SIZE = 'size';
const POSITION = 'position';
const FILL = 'fill';
const BACKGROUND_COLOR = 'backgroundColor';
const STYLE = 'style';
const VIDEO_POSTER = 'videoPoster';

export const PanelTypes = {
	ACTIONS,
	BACKGROUND,
	POSITION,
	SIZE,
	SCALE,
	BACKGROUND_COLOR,
	COLOR,
	FONT,
	STYLE,
	TEXT,
	ROTATION_ANGLE,
	FILL,
	VIDEO_POSTER,
};

const ALL = Object.values( PanelTypes );

function intersect( a, b ) {
	return a.filter( ( v ) => b.includes( v ) );
}

export function getPanels( elements, currentPage ) {
	if ( elements.length === 0 ) {
		return [];
	}

	const isBackground = ( elements.length === 1 && elements[ 0 ].id === currentPage.backgroundElementId );

	// Panels to always display, independent of the selected element.
	const sharedPanels = [
		{ type: ACTIONS, Panel: ActionsPanel },
	];

	let selectionPanels = [];
	// Only display background panel in case of background element.
	if ( isBackground ) {
		selectionPanels = [ { type: BACKGROUND, Panel: BackgroundPanel } ];
	} else {
		// Find which panels all the selected elements have in common
		selectionPanels = elements
			.map( ( { type } ) => elementTypes.find( ( elType ) => elType.type === type ).panels )
			.reduce( ( commonPanels, panels ) => intersect( commonPanels, panels ), ALL )
			.map( ( type ) => {
				switch ( type ) {
					case BACKGROUND: return { type, Panel: BackgroundPanel };
					case POSITION: return { type, Panel: PositionPanel };
					case SCALE: return { type, Panel: ScalePanel };
					case ROTATION_ANGLE: return { type, Panel: RotationPanel };
					case SIZE: return { type, Panel: SizePanel };
					case FILL: return { type, Panel: FillPanel };
					case BACKGROUND_COLOR: return { type, Panel: BackgroundColorPanel };
					case COLOR: return { type, Panel: ColorPanel };
					case FONT: return { type, Panel: FontPanel };
					case STYLE: return { type, Panel: StylePanel };
					case TEXT: return { type, Panel: TextPanel };
					case VIDEO_POSTER: return { type, Panel: VideoPosterPanel };
					default: throw new Error( `Unknown panel: ${ type }` );
				}
			} );
	}

	return [
		...sharedPanels,
		...selectionPanels,
	];
}
