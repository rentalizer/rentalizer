// Stub file to prevent import errors after toast removal
// This file provides empty implementations to avoid breaking existing imports

export const useToast = () => {
  return {
    toast: (options: any) => {
      console.log('Toast (stub):', options.title || 'Message', options.description || '');
    }
  };
};

export const toast = (options: any) => {
  console.log('Toast (stub):', options.title || 'Message', options.description || '');
};
