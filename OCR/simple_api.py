from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import pytesseract
import re

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
from OCR import get_text

app = Flask(__name__)
CORS(app)

def parse_with_validation(raw_text):
    result = {
        'raw_text': raw_text,
        'nutrition_facts': {},
        'ingredients': [],
        'allergens': [],
        'serving_size': None,
        'manufacturer': None,
        'best_before': None,
        'country': None,
        'fssai': None
    }
    
    text = raw_text.lower()
    
    # Enhanced nutrition patterns - more flexible
    nutrition_patterns = [
        (r'energy\s*[:\(]?\s*(?:kcal)?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(?:kcal)?', 'energy', 'kcal'),
        (r'protein\s*[:\(]?\s*g?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*g?', 'protein', 'g'),
        (r'carbohydrate\s*[:\(]?\s*g?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*g?', 'carbohydrate', 'g'),
        (r'(?:total\s+)?fat\s*[:\(]?\s*g?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*g?', 'total_fat', 'g'),
        (r'sugar\s*[:\(]?\s*g?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*g?', 'sugar', 'g'),
        (r'sodium\s*[:\(]?\s*(?:mg)?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(?:mg)?', 'sodium', 'mg'),
        (r'(?:dietary\s+)?(?:fibre|fiber)\s*[:\(]?\s*g?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*g?', 'dietary_fiber', 'g'),
        (r'saturated\s+fat\s*[:\(]?\s*g?\s*[\)]?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*g?', 'saturated_fat', 'g'),
    ]
    
    for pattern, nutrient, unit in nutrition_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            value = matches[0]
            result['nutrition_facts'][nutrient] = f"{value} {unit}"
    
    # STRICT ingredient extraction
    ing_pattern = r'ingredients?\s*[:=]?\s*([^\\n]+(?:\\n(?!.*(?:allergen|manufactured|address|lic|fssai|best before|unit|floor|tower|wing|plot|road|ltd|pvt))[^\\n]+)*?)'
    ing_match = re.search(ing_pattern, text, re.IGNORECASE | re.DOTALL)
    
    if ing_match:
        ing_text = ing_match.group(1)
        
        # Remove address/license noise
        noise_patterns = [
            r'\\b(?:unit|floor|tower|wing|plot|road|building|ltd|pvt|license|lic)\\b.*',
            r'\\b\\d+[a-z]?\\s*(?:floor|tower|wing|unit)\\b.*',
        ]
        
        for pattern in noise_patterns:
            ing_text = re.sub(pattern, '', ing_text, flags=re.IGNORECASE)
        
        ingredients = re.split(r'[,;]', ing_text)
        valid = []
        
        for ing in ingredients:
            ing = ing.strip()
            if len(ing) < 3:
                continue
            
            # Exclude address/license terms
            exclude_terms = ['unit', 'floor', 'tower', 'wing', 'plot', 'road', 'building', 'ltd', 'pvt', 'license', 'lic', 'no']
            if any(term in ing.lower() for term in exclude_terms):
                continue
            
            if sum(c.isalpha() for c in ing) / max(len(ing), 1) > 0.6:
                valid.append(ing)
        
        result['ingredients'] = valid[:10]
    
    # STRICT allergen detection
    allergen_patterns = {
        'contains': r'contains?\\s*[:=]?\\s*([^\\n]+)',
        'allergen_info': r'allergen\\s+information\\s*[:=]?\\s*([^\\n]+)'
    }
    
    allergen_keywords = ['milk', 'egg', 'peanut', 'tree nut', 'cashew', 'almond', 'soy', 'wheat', 'gluten']
    
    for pattern_name, pattern in allergen_patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            allergen_text = match.group(1).lower()
            for keyword in allergen_keywords:
                if keyword in allergen_text and keyword not in result['allergens']:
                    result['allergens'].append(keyword)
    
    # FSSAI detection - check for "Lic. No." or "FSSAI"
    if re.search(r'\\b(?:lic\\s*no|fssai)\\b', text, re.IGNORECASE):
        result['fssai'] = 'detected'
    
    # Other extractions
    if m := re.search(r'per\\s+(\\d+)\\s*g', text):
        result['serving_size'] = f"per {m.group(1)} g"
    
    if m := re.search(r'(?:manufactured|packed)\\s+by\\s*[:=]?\\s*([a-z\\s]+(?:foods|ltd|pvt)[^\\n,]*)', text, re.IGNORECASE):
        result['manufacturer'] = m.group(1).strip()
    
    if m := re.search(r'best\\s+before\\s*[:=]?\\s*([^\\n]+)', text):
        result['best_before'] = m.group(1).strip()
    
    if m := re.search(r'country\\s+of\\s+origin\\s*[:=]?\\s*([a-z]+)', text):
        result['country'] = m.group(1).strip()
    
    return result

@app.route('/api/ocr/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return jsonify({'error': 'Could not read image'}), 400
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    texts = [
        pytesseract.image_to_string(gray, lang='eng'),
        pytesseract.image_to_string(thresh, lang='eng'),
        get_text(img),
        pytesseract.image_to_string(gray, lang='eng', config='--psm 6'),
        pytesseract.image_to_string(gray, lang='eng', config='--psm 11')
    ]
    
    raw_text = max(texts, key=len)
    result = parse_with_validation(raw_text)
    
    return jsonify(result)

if __name__ == '__main__':
    print('OCR API running on http://localhost:5000')
    app.run(debug=True, host='0.0.0.0', port=5000)