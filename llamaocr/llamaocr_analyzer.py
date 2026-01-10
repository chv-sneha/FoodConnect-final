#!/usr/bin/env python3
import os
import sys
import json
import base64
from groq import Groq
from PIL import Image
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class FoodLabelOCR:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
    def encode_image(self, image_path):
        """Encode image to base64"""
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode('utf-8')
        except Exception as e:
            raise Exception(f"Failed to encode image: {str(e)}")
    
    def analyze_food_label(self, image_path):
        """Analyze food label using Llama3.2 Vision"""
        try:
            # Encode image
            base64_image = self.encode_image(image_path)
            
            # Create prompt for food label analysis
            prompt = """
            Analyze this food label image and extract the following information in JSON format:

            {
                "product_name": "extracted product name",
                "fssai_number": "14-digit FSSAI license number if found",
                "nutritional_info": {
                    "energy_kcal": "energy per 100g",
                    "protein_g": "protein per 100g", 
                    "carbohydrates_g": "carbs per 100g",
                    "total_fat_g": "total fat per 100g",
                    "saturated_fat_g": "saturated fat per 100g",
                    "trans_fat_g": "trans fat per 100g",
                    "sodium_mg": "sodium per 100g in mg",
                    "added_sugars_g": "added sugars per 100g"
                },
                "ingredients": ["list", "of", "ingredients", "in", "order"],
                "extracted_text": "complete raw text from image"
            }

            Rules:
            - Extract exact values with numbers only
            - If information not found, use "Not Available"
            - Ingredients should be in order listed
            - Focus on per 100g values
            - Return only valid JSON
            """
            
            # Make API call to Groq
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}",
                                },
                            },
                        ],
                    }
                ],
                model="llama-3.2-11b-vision-preview",
                temperature=0.1,
                max_tokens=2048,
            )
            
            # Extract response
            response_text = chat_completion.choices[0].message.content
            
            # Try to parse JSON from response
            try:
                # Find JSON in response
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    result = json.loads(json_str)
                    
                    # Add metadata
                    result['success'] = True
                    result['method'] = 'LlamaOCR'
                    result['confidence'] = 95
                    
                    return result
                else:
                    raise ValueError("No JSON found in response")
                    
            except json.JSONDecodeError as e:
                # Fallback: return raw text
                return {
                    'success': False,
                    'error': 'Failed to parse structured data',
                    'raw_response': response_text,
                    'method': 'LlamaOCR'
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'method': 'LlamaOCR'
            }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python llamaocr_analyzer.py <image_path>'
        }))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({
            'success': False,
            'error': f'Image file not found: {image_path}'
        }))
        sys.exit(1)
    
    # Initialize OCR
    ocr = FoodLabelOCR()
    
    # Analyze image
    result = ocr.analyze_food_label(image_path)
    
    # Output JSON result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()