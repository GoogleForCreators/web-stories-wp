/**
 * External dependencies
 */
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import CustomFontsSettings, { TEXT } from '..';
import { renderWithProviders } from '../../../../testUtils';

describe('Editor Settings: CustomFontsSettings <CustomFontsSettings />', function () {
    let mockUpdate;
    let mockDelete;

    beforeEach(() => {
        mockUpdate = jest.fn(() => { });
        mockDelete = jest.fn(() => { });
    });

    afterEach(() => {
    });

    it('should render CustomFontsSettings input and helper text by default', function () {
        renderWithProviders(
            <CustomFontsSettings
                customFonts={[]}
                addCustomFont={mockUpdate}
                deleteCustomFont={mockDelete}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toBeEnabled();

        const sectionHeader = screen.getByText(TEXT.SECTION_HEADING);
        expect(sectionHeader).toBeInTheDocument();
    });
});
