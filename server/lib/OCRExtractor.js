const fs = require('fs');

class OCRExtractor {
  constructor() {
    this.ollamaUrl = 'http://localhost:11434/api/generate';
  }

  async extractText(imagePath) {
    try {
      console.log('Step 2: Starting Vision OCR with Ollama...');
      
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      // Convert image to base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Use Ollama vision model for OCR
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2-vision:11b',
          prompt: 'Extract ALL text from this food label image. Include product name, ingredients list, nutritional information, and any other text visible. Format as plain text, preserving structure.',
          images: [base64Image],
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const result = await response.json();
      const extractedText = result.response || '';

      console.log('Extracted Text:', extractedText);
      console.log(`Text Length: ${extractedText.length} characters`);
      console.log('Step 2: Vision OCR Complete ✓');

      return {
        success: true,
        rawText: extractedText,
        cleanedText: this.cleanRawText(extractedText),
        confidence: 95, // Vision models are generally high confidence
        method: 'Ollama Vision',
        characterCount: extractedText.length,
        lineCount: extractedText.split('\n').length
      };

    } catch (error) {
      console.error('Step 2: Vision OCR Failed:', error.message);
      return {
        success: false,
        error: error.message,
        rawText: '',
        cleanedText: '',
        confidence: 0,
        method: 'Ollama Vision'
      };
    }
  }

  cleanRawText(rawText) {
    if (!rawText) return '';
    
    return rawText
      .replace(/\s+/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  validateOCRQuality(result) {
    const minTextLength = 20;
    
    if (result.cleanedText.length < minTextLength) {
      return {
        valid: false,
        reason: `Insufficient text extracted: ${result.cleanedText.length} characters`
      };
    }
    
    return {
      valid: true,
      reason: 'Vision OCR quality good'
    };
  }
}

module.exports = OCRExtractor;