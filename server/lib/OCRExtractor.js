const Tesseract = require('tesseract.js');
const fs = require('fs');

class OCRExtractor {
  async extractText(imagePath) {
    try {
      console.log('Step 2: Fast OCR with Tesseract...');
      
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      const { data: { text } } = await Tesseract.recognize(
        imagePath, 
        'eng', 
        {
          tessedit_pageseg_mode: Tesseract.PSM.AUTO,
          tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY
        }
      );

      console.log('=== TESSERACT EXTRACTION RESULT ===');
      console.log('Extracted Text:');
      console.log(text);
      console.log('=== END EXTRACTION RESULT ===');

      return {
        success: true,
        rawText: text,
        cleanedText: this.cleanRawText(text),
        confidence: 85,
        method: 'Tesseract'
      };

    } catch (error) {
      console.error('Step 2: OCR Failed:', error.message);
      return {
        success: false,
        error: error.message,
        rawText: '',
        cleanedText: '',
        confidence: 0
      };
    }
  }

  cleanRawText(rawText) {
    if (!rawText) return '';
    
    return rawText
      .replace(/\s+/g, ' ')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  validateOCRQuality(result) {
    const minTextLength = 10;
    
    if (result.cleanedText.length < minTextLength) {
      return {
        valid: false,
        reason: `Insufficient text extracted: ${result.cleanedText.length} characters`
      };
    }
    
    return {
      valid: true,
      reason: 'OCR quality acceptable'
    };
  }
}

module.exports = OCRExtractor;