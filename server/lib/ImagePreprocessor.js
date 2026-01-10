const sharp = require('sharp');

class ImagePreprocessor {
  constructor() {
    this.outputDir = './temp';
  }

  async preprocessForOCR(imagePath) {
    try {
      console.log('Step 1: Image Preprocessing for OCR...');
      
      const processedPath = imagePath.replace(/\.[^.]+$/, '_processed.png');
      
      // Aggressive preprocessing for food labels
      await sharp(imagePath)
        .resize(2000, null, { withoutEnlargement: false }) // Upscale
        .sharpen({ sigma: 1.5 }) // Sharpen text
        .normalize() // Auto contrast
        .threshold(128) // Convert to black/white
        .png()
        .toFile(processedPath);
      
      console.log('Step 1: Image Preprocessing Complete ✓');
      return { success: true, processedPath };
      
    } catch (error) {
      console.error('Step 1: Image Preprocessing Failed:', error.message);
      return { success: false, error: error.message, processedPath: imagePath };
    }
  }
}

module.exports = ImagePreprocessor;