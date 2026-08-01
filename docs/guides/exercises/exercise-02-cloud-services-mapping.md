# Exercise 2: Cloud Services Mapping

> **Connects to:** [Lecture 2: AWS Services](../README.md#2-aws-services)
>
> **Time to complete:** 45-60 minutes
>
> **What you'll need:** An AWS free tier account (create one at [aws.amazon.com/free](https://aws.amazon.com/free)), Python 3.10+ installed locally, `boto3` installed (`pip install boto3`)

---

## Objective

Deploy a **single-page "Hello, Cloud!" website** using S3 and CloudFront. Then extend it by adding a Lambda function and DynamoDB table. By the end, you'll have touched 4 AWS services with real code.

> **COST WARNING:** This exercise uses AWS free tier, but some resources cost money if left running. Estimated cost if you complete the exercise and clean up: **$0.00**. Estimated cost if you forget to delete resources and leave them for a month: **$5-50/month**. Before starting, set a $5 AWS Budget Alert (AWS Console → Billing → Budgets). **Delete all resources when done** — follow the cleanup section at the bottom of this exercise.

---

## Scenario

You're building a personal "business card" website. It shows your name, role, and a visitor counter. Every time someone visits, the counter increments.

---

## Part A: S3 Static Website (15 minutes)

### Step 1: Create an S3 Bucket

Open the AWS Console → S3 → Create bucket.

- Bucket name: `hello-cloud-<your-name>-<random-chars>` (must be globally unique)
- Region: `us-east-1` (or your closest region)
- **Uncheck** "Block all public access" (we want this public)
- Acknowledge the warning
- Click "Create bucket"

### Step 2: Upload Your Website

Create a file called `index.html` on your local machine:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello, Cloud!</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { font-size: 2.5rem; margin: 0 0 0.5rem; }
        .role { font-size: 1.2rem; opacity: 0.8; margin-bottom: 2rem; }
        .counter { font-size: 3rem; font-weight: bold; }
        .counter-label { font-size: 0.9rem; opacity: 0.7; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello, I'm [Your Name]</h1>
        <p class="role">Junior Software Engineer</p>
        <div class="counter" id="visitor-count">...</div>
        <p class="counter-label">visitors</p>
    </div>
</body>
</html>
```

Upload `index.html` to your S3 bucket (drag and drop in the console).

### Step 3: Enable Static Website Hosting

- Go to your bucket → Properties tab
- Scroll to "Static website hosting" → Edit → Enable
- Index document: `index.html`
- Save

### Step 4: Make It Public

- Go to Permissions tab → Bucket policy → Edit
- Paste this policy (replace `YOUR-BUCKET-NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

### Step 5: Visit Your Website

Go to Properties → Static website hosting. Copy the URL (looks like `http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com`). Open it in your browser. You should see your page!

---

## Part B: DynamoDB Visitor Counter (15 minutes)

### Step 1: Create a DynamoDB Table

Console → DynamoDB → Create table.

- Table name: `visitor-counter`
- Partition key: `id` (String)
- Default settings → Create table

### Step 2: Create a Lambda Function

Console → Lambda → Create function.

- Name: `getVisitorCount`
- Runtime: Python 3.12
- Create a new role with basic Lambda permissions
- Create function

Replace the Lambda code with:

```python
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('visitor-counter')

# Custom JSON encoder to handle DynamoDB Decimal types
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super().default(obj)

def lambda_handler(event, context):
    # Atomically increment the counter
    response = table.update_item(
        Key={'id': 'main'},
        UpdateExpression='ADD visitor_count :inc',
        ExpressionAttributeValues={':inc': 1},
        ReturnValues='UPDATED_NEW'
    )
    
    count = response['Attributes']['visitor_count']
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'visitor_count': count}, cls=DecimalEncoder)
    }
```

**Before testing:** Go to Configuration → Permissions → click the role name → Add permissions → Attach policies → search "DynamoDBFullAccess" → attach. (In production you'd use a narrower policy, but this is fine for learning.)

### Step 3: Create a Function URL

Go to Configuration → Function URL → Create function URL.

- Auth type: **NONE** (public access)
- Save

Copy the Function URL. Test it in your browser or with curl:

```bash
curl https://<your-function-url>.lambda-url.us-east-1.on.aws/
# {"visitor_count": 1}

curl https://<your-function-url>.lambda-url.us-east-1.on.aws/
# {"visitor_count": 2}
```

---

## Part C: Connect Everything (15 minutes)

Now update your `index.html` to call the Lambda function and show the real visitor count.

Add this `<script>` block just before `</body>`:

```html
<script>
async function updateCounter() {
    try {
        const response = await fetch('https://<YOUR-LAMBDA-FUNCTION-URL>/');
        const data = await response.json();
        document.getElementById('visitor-count').textContent = data.visitor_count;
    } catch (err) {
        document.getElementById('visitor-count').textContent = '...';
        console.error('Failed to fetch count:', err);
    }
}
updateCounter();
</script>
```

Re-upload `index.html` to S3. Refresh your website. The counter should now show a real number that increases on every visit!

---

## Part D: Answer These Questions (10 minutes)

Write down your answers (or discuss with a teammate):

1. **What would break if you deleted the DynamoDB table?** What would still work?
2. **Why did we set `Access-Control-Allow-Origin: *` in the Lambda response?** What happens if we remove it?
3. **Where is the Lambda function running?** On your laptop? On AWS servers? How do you know?
4. **What's the difference between S3 static hosting and CloudFront?** Why would you add CloudFront on top?
5. **How much did this cost you?** Check the AWS Billing dashboard (it should be $0.00 — all within free tier).

---

## Stuck?

| Symptom | Likely Cause | Fix |
|---|---|---|
| "Access Denied" when visiting S3 website URL | Bucket policy not applied or missing | Go to Permissions → Bucket Policy. Paste the policy exactly. Replace `YOUR-BUCKET-NAME` with your actual bucket name. |
| Lambda function times out | Default timeout is 3 seconds | Go to Configuration → General configuration → Edit → set Timeout to 10 seconds. |
| Lambda returns 502 or internal error | Missing DynamoDB permissions | Go to Configuration → Permissions → click the role name → Add permissions → Attach `AmazonDynamoDBFullAccess`. Wait 30 seconds for propagation. |
| "CORS error" in browser console when calling Lambda | Lambda response missing CORS headers | Check that your Lambda returns `Access-Control-Allow-Origin: *` in the response headers. |
| Function URL returns "{"Message":"Forbidden"}" | Auth type is set to `AWS_IAM` | Change Function URL auth type to `NONE` for this exercise. (In production, you would use IAM auth.) |
| S3 bucket name "already exists" | Bucket names are globally unique across ALL AWS accounts | Add random characters to your bucket name: `hello-cloud-jdoe-a7b3c`. |

**Expected output:** Your `index.html` page loads from an S3 URL. The visitor counter increments on every refresh. The Lambda function URL returns `{"visitor_count": N}` when called directly. Total AWS bill: $0.00.

---

## What You've Practiced

- Created and configured an S3 bucket for static website hosting
- Wrote and deployed a Lambda function with Python + boto3
- Created a DynamoDB table and performed atomic updates
- Connected a frontend (HTML) to a serverless backend (Lambda)
- Understood IAM roles (Lambda → DynamoDB permissions)
- Solved CORS issues with `Access-Control-Allow-Origin`

---

## Cleanup (Important!)

To avoid any charges, delete your resources:

1. **S3:** Empty the bucket (delete all objects), then delete the bucket
2. **Lambda:** Delete the function
3. **DynamoDB:** Delete the `visitor-counter` table

---

**Done?** Congratulations — you just built a serverless web app touching 3 AWS services with real code. This is exactly the pattern we use in production, just simpler.
