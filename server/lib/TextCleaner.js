class TextCleaner {
  constructor() {
    this.unitPatterns = {
      // Weight units
      'grams': /(\d+(?:\.\d+)?)\s*(?:gms?|grams?)\b/gi,
      'milligrams': /(\d+(?:\.\d+)?)\s*(?:mgs?|milligrams?)\b/gi,
      'kilograms': /(\d+(?:\.\d+)?)\s*(?:kgs?|kilograms?)\b/gi,
      
      // Energy units
      'kcal': /(\d+(?:\.\d+)?)\s*(?:k?cals?|kcal|kilocalories?)\b/gi,
      'kj': /(\d+(?:\.\d+)?)\s*(?:kjs?|kilojoules?)\b/gi,
      
      // Volume units
      'ml': /(\d+(?:\.\d+)?)\s*(?:mls?|milliliters?|millilitres?)\b/gi,
      'liters': /(\d+(?:\.\d+)?)\s*(?:l|lts?|liters?|litres?)\b/gi
    };
  }

  cleanAndNormalize(rawText) {
    try {
      console.log('Step 3: Starting Text Cleaning & Normalization...');
      console.log('Tool: Rule-based text normalization');
      
      let cleanedText = rawText;
      
      // Step 3.1: Remove OCR noise
      cleanedText = this.removeOCRNoise(cleanedText);
      
      // Step 3.2: Standardize units
      cleanedText = this.standardizeUnits(cleanedText);
      
      // Step 3.3: Fix common OCR errors
      cleanedText = this.fixOCRErrors(cleanedText);
      
      // Step 3.4: Normalize spacing and formatting
      cleanedText = this.normalizeFormatting(cleanedText);
      
      console.log('Step 3: Text Cleaning & Normalization Complete ✓');
      
      return {
        success: true,
        originalText: rawText,
        cleanedText: cleanedText,
        improvements: this.getImprovements(rawText, cleanedText)
      };
      
    } catch (error) {
      console.error('Step 3: Text Cleaning Failed:', error.message);
      return {
        success: false,
        error: error.message,
        originalText: rawText,
        cleanedText: rawText
      };
    }
  }

  removeOCRNoise(text) {
    return text
      // Remove random special characters
      .replace(/[^\w\s\.,;:()\-\/%&]/g, ' ')
      // Remove excessive dots
      .replace(/\.{3,}/g, '...')
      // Remove random single characters
      .replace(/\b[a-zA-Z]\b/g, ' ')
      // Clean up spacing
      .replace(/\s+/g, ' ');
  }

  standardizeUnits(text) {
    let normalized = text;
    
    // Standardize weight units
    normalized = normalized.replace(this.unitPatterns.grams, '$1g');
    normalized = normalized.replace(this.unitPatterns.milligrams, '$1mg');
    normalized = normalized.replace(this.unitPatterns.kilograms, '$1kg');
    
    // Standardize energy units
    normalized = normalized.replace(this.unitPatterns.kcal, '$1kcal');
    normalized = normalized.replace(this.unitPatterns.kj, '$1kj');
    
    // Standardize volume units
    normalized = normalized.replace(this.unitPatterns.ml, '$1ml');
    normalized = normalized.replace(this.unitPatterns.liters, '$1l');
    
    return normalized;
  }

  fixOCRErrors(text) {
    const commonErrors = {
      // Common OCR misreads
      '0': /[oO]/g,
      '1': /[lI]/g,
      'S': /\$|5/g,
      'G': /6/g,
      // Nutritional terms
      'Protein': /Protien|Protain/gi,
      'Carbohydrate': /Carbohydrat|Carbohidrate/gi,
      'Sodium': /Sodum|Sodim/gi,
      'Energy': /Enrgy|Energi/gi,
      'Ingredients': /Ingredents|Ingrediants/gi,
      'FSSAI': /FSAI|FSSAI|FSS41/gi
    };
    
    let corrected = text;
    for (const [correct, pattern] of Object.entries(commonErrors)) {
      corrected = corrected.replace(pattern, correct);
    }
    
    return corrected;
  }

  normalizeFormatting(text) {
    return text
      // Normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive whitespace
      .replace(/[ \t]+/g, ' ')
      // Remove excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Trim lines
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  getImprovements(original, cleaned) {
    return {
      originalLength: original.length,
      cleanedLength: cleaned.length,
      reductionPercent: Math.round(((original.length - cleaned.length) / original.length) * 100),
      unitsStandardized: this.countUnitStandardizations(original, cleaned),
      errorsFixed: this.countErrorFixes(original, cleaned)
    };
  }

  countUnitStandardizations(original, cleaned) {
    let count = 0;
    for (const pattern of Object.values(this.unitPatterns)) {
      const originalMatches = (original.match(pattern) || []).length;
      if (originalMatches > 0) count += originalMatches;
    }
    return count;
  }

  countErrorFixes(original, cleaned) {
    // Simple heuristic: count character differences
    return Math.abs(original.length - cleaned.length);
  }
}

module.exports = TextCleaner;