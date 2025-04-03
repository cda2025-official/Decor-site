// Cloudinary image URL transformation helper
export function getCloudinaryUrl(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}) {
    // If the URL is already a Cloudinary URL or a placeholder, return it
    if (!url || url.includes('placeholder.svg') || url.includes('res.cloudinary.com')) {
      return url;
    }
  
    // Default options
    const {
      width = 800,
      height,
      quality = 80,
      format = 'webp'
    } = options;
  
    // Your Cloudinary cloud name - replace with your actual cloud name
    const cloudName = 'your-cloud-name';
    
    // Build the transformation string
    let transformations = `f_${format},q_${quality},w_${width}`;
    
    if (height) {
      transformations += `,h_${height}`;
    }
    
    // Encode the URL to be used as a remote source
    const encodedUrl = encodeURIComponent(url);
    
    // Return the Cloudinary URL
    return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformations}/${encodedUrl}`;
  }
  