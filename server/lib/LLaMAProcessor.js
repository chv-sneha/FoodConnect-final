const { spawn } = require('child_process');
const path = require('path');

class LLaMAProcessor {
  constructor() {
    this.llamaScript = path.join(__dirname, '../../llamaocr/llamaocr_analyzer.py');
  }

  async processAndStructure(cleanedText, imagePath) {
    try {
      console.log('Step 4: Starting LLaMA-Based Understanding & Structuring...');
      console.log('Tool: LLaMA (Large Language Model)');
      console.log('Purpose: Understanding and structuring OCR output');
      
      // Use LLaMA for intelligent understanding
      const llamaResult = await this.callLLaMAForStructuring(imagePath, cleanedText);
      
      if (llamaResult.success && llamaResult.structuredData) {
        console.log('Step 4: LLaMA Processing Complete ✓');
        return this.formatStructuredData(llamaResult.structuredData);
      } else {
        // Fallback to rule-based processing
        console.log('LLaMA processing failed, using rule-based fallback');
        return this.ruleBasedStructuring(cleanedText);
      }
      
    } catch (error) {
      console.error('Step 4: LLaMA Processing Failed:', error.message);
      // Fallback to rule-based processing
      return this.ruleBasedStructuring(cleanedText);
    }
  }

  async callLLaMAForStructuring(imagePath, cleanedText) {
    return new Promise((resolve) => {
      const pythonProcess = spawn('python3', [this.llamaScript, imagePath]);
      
      let result = '';
      let error = '';
      
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const parsedResult = JSON.parse(result);
            resolve({
              success: parsedResult.success,
              structuredData: parsedResult,
              method: 'LLaMA'
            });
          } catch (parseError) {
            resolve({ success: false, error: 'Failed to parse LLaMA response' });
          }
        } else {
          resolve({ success: false, error: error || 'LLaMA process failed' });
        }
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        pythonProcess.kill('SIGTERM');
        resolve({ success: false, error: 'LLaMA timeout' });
      }, 30000);
    });
  }

  formatStructuredData(llamaData) {
    return {
      success: true,
      method: 'LLaMA',
      productInformation: {
        productName: llamaData.product_name || 'Not Available',
        fssaiNumber: llamaData.fssai_number || 'Not Available',
        brand: 'Not Available'
      },
      nutritionalInformation: {
        energy: llamaData.nutritional_info?.energy_kcal || 'Not Available',
        protein: llamaData.nutritional_info?.protein_g || 'Not Available',
        carbohydrates: llamaData.nutritional_info?.carbohydrates_g || 'Not Available',
        totalFat: llamaData.nutritional_info?.total_fat_g || 'Not Available',
        saturatedFat: llamaData.nutritional_info?.saturated_fat_g || 'Not Available',
        transFat: llamaData.nutritional_info?.trans_fat_g || 'Not Available',
        sodium: llamaData.nutritional_info?.sodium_mg || 'Not Available',
        addedSugars: llamaData.nutritional_info?.added_sugars_g || 'Not Available'
      },
      ingredients: llamaData.ingredients || ['Not Available'],
      extractedText: llamaData.extracted_text || '',
      confidence: llamaData.confidence || 95
    };
  }

  ruleBasedStructuring(cleanedText) {
    console.log('Using rule-based fallback for structuring');
    
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const productInfo = this.extractProductInfo(lines, cleanedText);
    const nutritionalInfo = this.extractNutritionalInfo(cleanedText);
    const ingredients = this.extractIngredients(cleanedText);
    
    return {
      success: true,
      method: 'Rule-based',
      productInformation: {
        productName: productInfo.productName,
        fssaiNumber: productInfo.fssaiNumber,
        brand: productInfo.brand
      },
      nutritionalInformation: nutritionalInfo,
      ingredients: ingredients,
      extractedText: cleanedText,
      confidence: 75
    };
  }

  extractProductInfo(lines, text) {
    let productName = 'Not Available';
    let fssaiNumber = 'Not Available';
    
    // Extract product name (first meaningful line)
    for (const line of lines.slice(0, 5)) {
      if (line.length > 3 && line.length < 50 && 
          !line.toLowerCase().includes('ingredient') && 
          !line.toLowerCase().includes('nutrition')) {
        productName = line;
        break;
      }
    }
    
    // Extract FSSAI number
    const fssaiMatch = text.match(/fssai[:\s#-]*(\d{14})/i) || text.match(/(\d{14})/);
    if (fssaiMatch) {
      fssaiNumber = fssaiMatch[1];
    }
    
    return {
      productName,
      fssaiNumber,
      brand: 'Not Available'
    };
  }

  extractNutritionalInfo(text) {
    const nutrition = {
      energy: 'Not Available',
      protein: 'Not Available',
      carbohydrates: 'Not Available',
      totalFat: 'Not Available',
      saturatedFat: 'Not Available',
      transFat: 'Not Available',
      sodium: 'Not Available',
      addedSugars: 'Not Available'
    };
    
    const patterns = {
      energy: /(?:energy|calories?)[:\s]*(\d+(?:\.\d+)?)\s*(?:kcal|cal)/i,
      protein: /protein[:\s]*(\d+(?:\.\d+)?)\s*g/i,
      carbohydrates: /(?:carbohydrate|carbs?)[:\s]*(\d+(?:\.\d+)?)\s*g/i,
      totalFat: /(?:total\s*)?fat[:\s]*(\d+(?:\.\d+)?)\s*g/i,
      saturatedFat: /saturated\s*fat[:\s]*(\d+(?:\.\d+)?)\s*g/i,
      transFat: /trans\s*fat[:\s]*(\d+(?:\.\d+)?)\s*g/i,
      sodium: /sodium[:\s]*(\d+(?:\.\d+)?)\s*(?:mg|g)/i,
      addedSugars: /(?:added\s*)?sugar[:\s]*(\d+(?:\.\d+)?)\s*g/i
    };
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        let value = parseFloat(match[1]);
        if (key === 'sodium' && value < 10) {
          value = value * 1000; // Convert g to mg
        }
        nutrition[key] = value;
      }
    }
    
    return nutrition;
  }

  extractIngredients(text) {
    const ingredientPattern = /ingredients?[:\s]+(.*?)(?:nutrition|allergen|contains|net|weight|mfg|exp|best|$)/i;
    const match = text.match(ingredientPattern);
    
    if (!match) {
      return ['Not Available'];
    }
    
    const ingredientText = match[1];
    const ingredients = ingredientText
      .split(/[,;]|\band\b/i)
      .map(item => item.trim().replace(/[()[\]{}]/g, ''))
      .filter(item => item.length > 2 && !/^\d+$/.test(item))
      .slice(0, 15);
    
    return ingredients.length > 0 ? ingredients : ['Not Available'];
  }
}

module.exports = LLaMAProcessor;