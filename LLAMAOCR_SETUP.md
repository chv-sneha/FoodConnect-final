# LlamaOCR Setup for Generic Food Analysis

## Prerequisites
- Python 3.8 or higher
- Node.js project (already set up)
- Groq API key

## Installation Steps

### 1. Get Groq API Key
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up/Login
3. Navigate to API Keys section
4. Create new API key
5. Copy the key

### 2. Install Python Dependencies
```bash
cd llamaocr
pip install -r requirements.txt
```

### 3. Set Up Environment Variables
Add to your `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Test LlamaOCR
```bash
# Test with a food label image
python3 llamaocr/llamaocr_analyzer.py path/to/food_label.jpg
```

## How It Works

1. **Image Upload** → Generic analysis page
2. **LlamaOCR Processing** → Uses Llama3.2 Vision model via Groq
3. **Structured Extraction** → Product info, nutrition, ingredients
4. **Fallback** → Uses Tesseract if LlamaOCR fails
5. **Analysis** → Safety scoring and recommendations

## API Endpoint
- **POST** `/api/analyze/generic`
- **Body**: FormData with image file
- **Response**: Structured food analysis

## Features
- ✅ Advanced OCR with Llama3.2 Vision
- ✅ Structured data extraction
- ✅ Nutritional analysis
- ✅ Safety scoring
- ✅ Health recommendations
- ✅ Tesseract fallback

## Groq API Limits
- Free tier: 30 requests/minute
- Paid tier: Higher limits available
- Model: llama-3.2-11b-vision-preview