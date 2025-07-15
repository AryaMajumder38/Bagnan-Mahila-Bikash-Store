import type { FieldHook } from 'payload';

// This hook helps preserve form values when uploading images
const preserveFieldsOnImageUpload: FieldHook = ({ req, operation, value, data }) => {
  // For update and create operations, ensure the value is preserved
  if (operation === 'update' || operation === 'create') {
    // Return the value as is, ensuring it doesn't get lost during file upload
    return value;
  }
  
  // For other operations (read), return the value unchanged
  return value;
};

export default preserveFieldsOnImageUpload;
