/**
 * External dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useSnackbar,
} from '@googleforcreators/design-system';
import { useStory } from '@googleforcreators/story-editor';

function SaveButton() {
  const { isSaving, saveStory } = useStory(
    ({
      state: {
        meta: { isSaving },
      },
      actions: { saveStory },
    }) => ({
      isSaving,
      saveStory,
    })
  );

  const { showSnackbar } = useSnackbar();

  const handleSaveButton = () => {
    saveStory().then(() => {
      showSnackbar({
        message: 'Story Saved',
      });
    });
  };
  return (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onClick={handleSaveButton}
      disabled={isSaving}
    >
      {'Save'}
    </Button>
  );
}

export { SaveButton };
