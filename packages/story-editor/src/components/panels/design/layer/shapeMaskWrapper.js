/**
 * External dependencies
 */
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import useShapeMask from '../../../../utils/useShapeMask';

const MaskedIconWrapper = styled.div`
  position: relative;
  clip-path: url(#${({ maskId }) => maskId});
`;

function ShapeMaskWrapper({ element, children }) {
    const { hasShapeMask } = useShapeMask();
    const hasMask = hasShapeMask(element);

    if (!hasMask) {
        return children;
    }

    const maskId = `mask-${element?.mask?.type}-${element.id}-frame`;

    return (
        <MaskedIconWrapper maskId={maskId}>
            {children}
        </MaskedIconWrapper>
    );
}

export default ShapeMaskWrapper;