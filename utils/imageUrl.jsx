// utils/imageUrl.js

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-product.jpg';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }
  
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  return '/placeholder-product.jpg';
};

export default getImageUrl;