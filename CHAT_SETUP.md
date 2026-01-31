# FoodConnect Chat Setup

## 1. Install Python Dependencies
```bash
cd OCR
pip install -r requirements.txt
```

## 2. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

## 3. Configure API Key
Replace `YOUR_GEMINI_API_KEY` in `OCR/test_ocr_simple.py` line 62 with your actual API key:

```python
genai.configure(api_key="your-actual-api-key-here")
```

## 4. Start the Backend
```bash
cd OCR
python test_ocr_simple.py
```

## 5. Start the Frontend
```bash
npm run dev
```

## Chat Features
- 💬 Conversational AI powered by Google Gemini
- 🍎 Context-aware responses about scanned food
- 📊 Ingredient explanations and safety reasoning
- 🎯 Suggested questions for quick insights
- 📱 Floating chat button on both Generic and Customized pages

## Example Conversations
- "What does palm oil do in this product?"
- "Why is the safety score low?"
- "Is this okay to eat occasionally?"
- "What are the main health concerns?"
- "How much sugar is too much?"