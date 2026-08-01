# Exercise 5: Call a Vision Model API

> **Connects to:** [Lecture 5: Multimodal Vision Pipeline](../README.md#5-multimodal-vision-pipeline)
>
> **Time to complete:** 45-60 minutes
>
> **What you'll need:** Python 3.10+, `pip install requests pillow`, an OpenAI API key ($1 of credit is more than enough) OR an AWS account with Bedrock access
>
> ⚠️ **No API key?** You can complete most of this exercise (Parts A, B, D, and E) without calling a real model. Part B (image compression) and Part D (prompt experimentation) work entirely offline. For Part C, pair with a teammate who has a key, or use the free-tier credits that come with new OpenAI accounts.

---

## Objective

Call a vision-language model (GPT-4o or Claude) with an image and get a structured analysis back. You'll practice:
1. Compressing an image before sending
2. Crafting a good vision prompt
3. Parsing structured output from the model
4. Handling errors gracefully

---

## Scenario

You're building a "receipt scanner." A user uploads a photo of a receipt, and the AI extracts: store name, date, total amount, and line items.

---

## Choose Your Path

**Path A: OpenAI (easier to set up, costs ~$0.01 per image)**
- Sign up at [platform.openai.com](https://platform.openai.com)
- Create an API key at https://platform.openai.com/api-keys
- Add $5 of credit

**Path B: AWS Bedrock (free tier, but requires AWS setup)**
- You need Bedrock model access (request via AWS Console → Bedrock → Model access)
- You need AWS credentials configured (`aws configure`)

We'll provide code for both.

---

## Part A: Setup (5 minutes)

```bash
mkdir vision-lab
cd vision-lab
python3 -m venv venv
source venv/bin/activate
pip install requests pillow
```

Create a test image: Take a photo of ANY receipt you have (grocery, coffee, any printed slip). Or use a screenshot of a fake receipt from Google Images. Save it as `receipt.jpg` in the `vision-lab/` directory.

---

## Part B: Image Compression (10 minutes)

Create `compress.py`:

```python
"""Compress an image before sending to a vision model."""
from PIL import Image
import io
import base64
import sys
import os

def compress_image(
    input_path: str,
    max_dimension: int = 1024,
    quality: int = 70,
    output_path: str = None
) -> tuple[str, dict]:
    """
    Compress an image for vision API submission.
    
    Returns:
        - base64 encoded string
        - dict with size info {original_kb, compressed_kb, dimensions}
    """
    original_size_kb = os.path.getsize(input_path) / 1024
    
    img = Image.open(input_path)
    original_dims = img.size
    
    # Convert RGBA to RGB if needed (JPEG doesn't support alpha channel)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Resize if too large (maintain aspect ratio)
    if max(img.size) > max_dimension:
        ratio = max_dimension / max(img.size)
        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Save as JPEG in memory
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=quality)
    compressed_bytes = buffer.getvalue()
    compressed_size_kb = len(compressed_bytes) / 1024
    
    # Convert to base64
    b64_string = base64.b64encode(compressed_bytes).decode('utf-8')
    
    info = {
        'original_kb': round(original_size_kb, 1),
        'compressed_kb': round(compressed_size_kb, 1),
        'original_dims': original_dims,
        'final_dims': img.size,
        'reduction_pct': round((1 - compressed_size_kb / original_size_kb) * 100, 1)
    }
    
    # Optionally save the compressed version
    if output_path:
        img.save(output_path, format='JPEG', quality=quality)
    
    return b64_string, info

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python compress.py <image_path>")
        sys.exit(1)
    
    path = sys.argv[1]
    b64, info = compress_image(path, output_path='compressed_receipt.jpg')
    
    print("Image Compression Results:")
    print(f"  Original:    {info['original_kb']} KB ({info['original_dims'][0]}x{info['original_dims'][1]})")
    print(f"  Compressed:  {info['compressed_kb']} KB ({info['final_dims'][0]}x{info['final_dims'][1]})")
    print(f"  Reduction:   {info['reduction_pct']}%")
    print(f"  Base64 len:  {len(b64)} chars")
```

Run it on your receipt:
```bash
python compress.py receipt.jpg
```

Note the size reduction. If your original was 3MB (phone photo) and compressed to 150KB, that's a 95% reduction — critical for API latency.

---

## Part C: Call the Vision Model (20 minutes)

### Path A — OpenAI GPT-4o

Create `scan_receipt_openai.py`:

```python
"""Scan a receipt using OpenAI GPT-4o Vision."""
import os
import json
import base64
import requests
from compress import compress_image

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "sk-your-key-here")

SYSTEM_PROMPT = """You are a receipt scanning assistant. 
When given an image of a receipt, extract the following information 
and return it as a JSON object:

{
  "store_name": "Name of the store",
  "date": "Date on the receipt (YYYY-MM-DD format if possible)",
  "total_amount": 0.00,
  "currency": "USD/EUR/etc",
  "line_items": [
    {"name": "Item name", "price": 0.00, "quantity": 1},
    ...
  ],
  "payment_method": "Visa/Cash/etc (if visible)",
  "confidence": "high/medium/low — how confident are you in this extraction?"
}

If you cannot read something, use null. If the image is not a receipt, 
return {"error": "Not a receipt", "description": "..."}."""

def scan_receipt(image_path: str) -> dict:
    """Send a receipt image to GPT-4o and get structured data back."""
    
    # Compress the image
    b64_image, info = compress_image(image_path)
    print(f"Image compressed: {info['original_kb']}KB → {info['compressed_kb']}KB")
    
    # Call OpenAI API
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-4o",  # Vision-capable model
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Please scan this receipt and extract the information."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64_image}",
                                "detail": "high"  # Use "low" for faster/cheaper, "high" for detailed
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 1000,
            "temperature": 0  # Deterministic output for data extraction
        },
        timeout=30
    )
    
    if response.status_code != 200:
        return {"error": f"API error: {response.status_code}", "details": response.text}
    
    result = response.json()
    content = result["choices"][0]["message"]["content"]
    
    # The model should return JSON, but sometimes it adds markdown backticks
    # Strip ```json and ``` if present
    if content.startswith("```"):
        content = content.split("\n", 1)[1]  # Remove first line (```json)
        if content.endswith("```"):
            content = content[:-3]  # Remove trailing ```
    
    try:
        receipt_data = json.loads(content)
    except json.JSONDecodeError:
        receipt_data = {"error": "Failed to parse JSON", "raw_output": content}
    
    # Add metadata
    receipt_data["_meta"] = {
        "model": result["model"],
        "tokens_used": result["usage"]["total_tokens"],
        "image_size_kb": info['compressed_kb']
    }
    
    return receipt_data

if __name__ == '__main__':
    import sys
    
    path = sys.argv[1] if len(sys.argv) > 1 else "receipt.jpg"
    print(f"Scanning: {path}\n")
    
    result = scan_receipt(path)
    print(json.dumps(result, indent=2))
```

Set your API key and run:
```bash
export OPENAI_API_KEY="sk-your-key-here"
python scan_receipt_openai.py receipt.jpg
```

### Path B — AWS Bedrock (Claude 3.5 Sonnet)

Create `scan_receipt_bedrock.py`:

```python
"""Scan a receipt using AWS Bedrock (Claude 3.5 Sonnet)."""
import os
import json
import boto3
from compress import compress_image

# Make sure you have AWS credentials configured:
# aws configure
# And Bedrock model access enabled for Claude 3.5 Sonnet

bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

SYSTEM_PROMPT = """You are a receipt scanning assistant. 
When given an image of a receipt, extract the following information 
and return it as a JSON object:

{
  "store_name": "Name of the store",
  "date": "Date on the receipt (YYYY-MM-DD format if possible)",
  "total_amount": 0.00,
  "currency": "USD/EUR/etc",
  "line_items": [
    {"name": "Item name", "price": 0.00, "quantity": 1}
  ],
  "payment_method": "Visa/Cash/etc (if visible)",
  "confidence": "high/medium/low"
}

If you cannot read something, use null. Return ONLY valid JSON, no other text."""

def scan_receipt(image_path: str) -> dict:
    """Send a receipt image to Claude Sonnet via Bedrock."""
    
    b64_image, info = compress_image(image_path)
    print(f"Image compressed: {info['original_kb']}KB → {info['compressed_kb']}KB")
    
    response = bedrock.converse(
        modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
        system=[{"text": SYSTEM_PROMPT}],
        messages=[{
            "role": "user",
            "content": [
                {
                    "image": {
                        "format": "jpeg",
                        "source": {"bytes": b64_image}
                    }
                },
                {
                    "text": "Please scan this receipt and extract the information as JSON."
                }
            ]
        }],
        inferenceConfig={
            "maxTokens": 1000,
            "temperature": 0
        }
    )
    
    content = response["output"]["message"]["content"][0]["text"]
    
    # Parse JSON from response (Claude may wrap in backticks)
    if content.startswith("```"):
        content = content.split("\n", 1)[1]
        if content.endswith("```"):
            content = content[:-3]
    
    try:
        receipt_data = json.loads(content)
    except json.JSONDecodeError:
        receipt_data = {"error": "Failed to parse JSON", "raw_output": content}
    
    receipt_data["_meta"] = {
        "model": "claude-3.5-sonnet",
        "tokens_used": response["usage"]["inputTokens"] + response["usage"]["outputTokens"],
        "image_size_kb": info['compressed_kb']
    }
    
    return receipt_data

if __name__ == '__main__':
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else "receipt.jpg"
    result = scan_receipt(path)
    print(json.dumps(result, indent=2))
```

---

## Part D: Experiment with Prompts (10 minutes)

Try these variations and observe how the output changes:

### Experiment 1: No system prompt
Remove the system prompt or make it empty. Does the model still produce JSON?

### Experiment 2: Temperature
Change `temperature` from `0` to `0.7`. Run the same image 3 times. Do you get different results? (For data extraction, you want deterministic = temperature 0.)

### Experiment 3: Bad image
Take a blurry photo or a photo of a blank wall. How does the model respond? Does your error handling catch it?

### Experiment 4: "Low" vs "High" detail (OpenAI only)
Change `"detail": "high"` to `"detail": "low"`. Compare token usage and accuracy.

---

## Part E: Answer These Questions (10 minutes)

1. **How many tokens did your image consume?** Check `_meta.tokens_used`. How does this compare to text-only requests (typically < 50 tokens for a simple question)?
2. **Why did we ask the model to return JSON?** What would happen if we asked for plain text and then tried to parse numbers from it?
3. **What happens if the image is a sensitive document (like a medical record or ID card)?** Should you send it to OpenAI/Bedrock?
4. **In our blueprint, when do we use Haiku vs. Sonnet for vision tasks?** Why not always use Sonnet?

---

## Stuck?

| Symptom | Likely Cause | Fix |
|---|---|---|
| `ModuleNotFoundError: No module named 'PIL'` | Pillow not installed | Run `pip install pillow`. Note: the import is `from PIL import Image`, not `from pillow import Image`. |
| OpenAI API returns 401 "Incorrect API key" | Key is invalid or has no credits | Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and verify your key. Check Billing → Payment methods — you need at least $1 of credit. |
| Bedrock returns "AccessDeniedException" | Model access not granted | Go to AWS Console → Bedrock → Model access → Request access for Claude 3.5 Sonnet. This is not instant — it can take a few hours for new accounts. |
| Model returns text instead of JSON | Temperature too high or prompt does not insist on JSON | Set `temperature: 0` for deterministic output. Add "Return ONLY valid JSON, no other text" to your prompt. |
| `json.JSONDecodeError` when parsing model output | Model wrapped JSON in markdown backticks | The code already handles ```json ``` wrapping, but if the model uses a different format, print `content` to see what you got and adjust the parsing. |
| Compression script says "cannot identify image file" | File is not a valid image or path is wrong | Run `file receipt.jpg` in terminal to verify it is a JPEG/PNG. Check that the file path is correct — use an absolute path if needed. |

**Expected output (Part B):** Your compression script should report at least a 70% size reduction from the original image. A 3MB phone photo should compress to under 200KB.
**Expected output (Part C):** The model should return a JSON object with `store_name`, `date`, `total_amount`, and `line_items` mostly filled in. A receipt from a major chain should get `"confidence": "high"`.

---

## What You've Practiced

- ✅ Compressed an image programmatically (Pillow → base64)
- ✅ Called a vision-language model with image + text prompt
- ✅ Received and parsed structured JSON output from the model
- ✅ Understood token usage for vision vs. text
- ✅ Experimented with temperature and prompt engineering
- ✅ Thought about data privacy implications

---

## Cleanup

No cloud resources to clean up. Just delete your API key from the environment if you hardcoded it (and rotate the key if you did).

---

**Done?** You've now done exactly what our production system does in Phase 3 — send an image to a vision model and get structured diagnostic output back. The only difference is our production system uses Bedrock with AWS IAM auth instead of an API key.
