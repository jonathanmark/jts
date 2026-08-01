# Exercise 4: Build a JWT + RBAC System

> **Connects to:** [Lecture 4: Authentication & RBAC](../README.md#4-authentication-rbac)
>
> **Time to complete:** 60-75 minutes
>
> **What you'll need:** Python 3.10+, `pip install fastapi uvicorn pyjwt python-jose[cryptography] pydantic`

---

## Objective

Build a mini API with JWT authentication and role-based access control. You will:
1. Create a login endpoint that issues JWTs
2. Create protected endpoints that require valid JWTs
3. Implement RBAC: different roles get access to different endpoints
4. Test it all with `curl`

---

## Scenario

You're building an internal tool for a computer store. There are three employee roles:

| Role | Can access |
|---|---|
| `general` | `/api/products` (view product catalog) |
| `finance` | `/api/products` + `/api/refunds` (process refunds) |
| `admin` | `/api/products` + `/api/refunds` + `/api/admin/users` (manage users) |

---

## Part A: Create the Project (5 minutes)

Create a directory and file structure:

```bash
mkdir jwt-rbac-lab
cd jwt-rbac-lab
touch app.py
```

---

## Part B: Build the JWT Auth System (25 minutes)

Create `app.py` with the following code. **Type it out** (don't copy-paste) — you'll learn more.

```python
"""
Mini JWT + RBAC Lab
A simple API demonstrating authentication (JWT) and authorization (RBAC).
"""
import datetime
import hashlib
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt  # PyJWT library

# ──────────────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────────────
SECRET_KEY = "dev-secret-key-change-in-production!!"  # NEVER hardcode in real apps
ALGORITHM = "HS256"
TOKEN_EXPIRY_MINUTES = 60

# In a real app, this would be in a database
USERS_DB = {
    "sarah": {
        "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
        "role": "finance",
        "name": "Sarah Chen"
    },
    "mike": {
        "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
        "role": "general",
        "name": "Mike Johnson"
    },
    "priya": {
        "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
        "role": "admin",
        "name": "Priya Patel"
    }
}

# ──────────────────────────────────────────────────────
# RBAC PERMISSIONS MAP
# ──────────────────────────────────────────────────────
ROLE_PERMISSIONS = {
    "general":  ["view_products"],
    "finance":  ["view_products", "process_refunds"],
    "admin":    ["view_products", "process_refunds", "manage_users"]
}

# ──────────────────────────────────────────────────────
# MODELS
# ──────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str

# ──────────────────────────────────────────────────────
# FASTAPI APP
# ──────────────────────────────────────────────────────
app = FastAPI(title="JWT + RBAC Lab")
security = HTTPBearer()

# ──────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ──────────────────────────────────────────────────────

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Hash the plain password and compare to stored hash."""
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def create_jwt(username: str, role: str) -> str:
    """Create a JWT token with user claims."""
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": username,                        # Subject (who)
        "role": role,                           # Custom claim
        "iat": now,                             # Issued at
        "exp": now + datetime.timedelta(minutes=TOKEN_EXPIRY_MINUTES),  # Expiry
        "iss": "jwt-rbac-lab"                   # Issuer
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_and_verify_jwt(token: str) -> dict:
    """Verify JWT signature and expiry. Returns payload if valid."""
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_exp": True, "verify_iss": True},
            issuer="jwt-rbac-lab"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """FastAPI dependency: extracts and validates the current user from JWT."""
    return decode_and_verify_jwt(credentials.credentials)

def require_permission(required_permission: str):
    """
    Factory function that creates a dependency checking a specific permission.
    Usage: @app.get("/api/refunds", dependencies=[Depends(require_permission("process_refunds"))])
    """
    def permission_checker(user: dict = Depends(get_current_user)) -> dict:
        role = user.get("role")
        allowed = ROLE_PERMISSIONS.get(role, [])
        if required_permission not in allowed:
            raise HTTPException(
                status_code=403,
                detail=f"Role '{role}' does not have permission: '{required_permission}'"
            )
        return user
    return permission_checker

# ──────────────────────────────────────────────────────
# ENDPOINTS
# ──────────────────────────────────────────────────────

@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user and return a JWT."""
    user = USERS_DB.get(request.username)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    
    token = create_jwt(request.username, user["role"])
    
    return LoginResponse(
        access_token=token,
        role=user["role"],
        name=user["name"]
    )

@app.get("/api/me")
async def get_me(user: dict = Depends(get_current_user)):
    """Return info about the currently authenticated user."""
    return {
        "username": user["sub"],
        "role": user["role"],
        "issued_at": user["iat"],
        "expires_at": user["exp"]
    }

@app.get("/api/products")
async def list_products(user: dict = Depends(require_permission("view_products"))):
    """List products. All authenticated users can do this."""
    return {
        "products": [
            {"id": 1, "name": "Laptop Pro 15", "price": 1299.99},
            {"id": 2, "name": "Wireless Mouse", "price": 29.99},
            {"id": 3, "name": "USB-C Hub", "price": 49.99},
        ],
        "accessed_by": f"{user['sub']} ({user['role']})"
    }

@app.post("/api/refunds")
async def process_refund(user: dict = Depends(require_permission("process_refunds"))):
    """Process a refund. Finance and Admin only."""
    return {
        "message": "Refund processed successfully",
        "refund_id": "REF-2024-0815",
        "processed_by": f"{user['sub']} ({user['role']})"
    }

@app.get("/api/admin/users")
async def list_users(user: dict = Depends(require_permission("manage_users"))):
    """List all users. Admin only."""
    return {
        "users": [
            {"username": u, "role": d["role"], "name": d["name"]}
            for u, d in USERS_DB.items()
        ],
        "accessed_by": f"{user['sub']} ({user['role']})"
    }

# ──────────────────────────────────────────────────────
# RUN
# ──────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

Run it:
```bash
python app.py
# Open http://localhost:8000/docs for the interactive Swagger UI
```

---

## Part C: Test Every Scenario (20 minutes)

Use `curl` (or the Swagger UI at http://localhost:8000/docs) to test every case.

### 1. Login as each user and save their tokens

```bash
# Login as Sarah (Finance)
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sarah","password":"password123"}' | python3 -m json.tool

# Save the token (copy the access_token value)
export TOKEN_SARAH="<paste sarah's token here>"

# Login as Mike (General)
export TOKEN_MIKE=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"mike","password":"password123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# Login as Priya (Admin)
export TOKEN_PRIYA=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"priya","password":"password123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
```

### 2. Test: Who can view products?

```bash
# Sarah (Finance) — should succeed
curl -s http://localhost:8000/api/products -H "Authorization: Bearer $TOKEN_SARAH" | python3 -m json.tool

# Mike (General) — should succeed
curl -s http://localhost:8000/api/products -H "Authorization: Bearer $TOKEN_MIKE" | python3 -m json.tool

# No token — should fail with 403 (actually 401, since no Bearer token at all)
curl -s http://localhost:8000/api/products
```

### 3. Test: Who can process refunds?

```bash
# Sarah (Finance) — should succeed
curl -s -X POST http://localhost:8000/api/refunds -H "Authorization: Bearer $TOKEN_SARAH" | python3 -m json.tool

# Mike (General) — should FAIL with 403
curl -s -X POST http://localhost:8000/api/refunds -H "Authorization: Bearer $TOKEN_MIKE" | python3 -m json.tool
```

### 4. Test: Who can manage users?

```bash
# Priya (Admin) — should succeed
curl -s http://localhost:8000/api/admin/users -H "Authorization: Bearer $TOKEN_PRIYA" | python3 -m json.tool

# Sarah (Finance) — should FAIL with 403
curl -s http://localhost:8000/api/admin/users -H "Authorization: Bearer $TOKEN_SARAH" | python3 -m json.tool
```

### 5. Test: Invalid tokens

```bash
# Tampered token (change one character)
curl -s http://localhost:8000/api/products -H "Authorization: Bearer ${TOKEN_MIKE}x"

# Expired token — edit app.py: set TOKEN_EXPIRY_MINUTES = -1, restart, get a new token, test

# Wrong secret — edit app.py: change SECRET_KEY, restart, use old token
```

### Fill in this test matrix:

| Endpoint | General (Mike) | Finance (Sarah) | Admin (Priya) | No Token |
|---|---|---|---|---|
| `GET /api/products` | Yes / No | Yes / No | Yes / No | Yes / No |
| `POST /api/refunds` | Yes / No | Yes / No | Yes / No | Yes / No |
| `GET /api/admin/users` | Yes / No | Yes / No | Yes / No | Yes / No |

---

## Part D: Decode a JWT Manually (10 minutes)

Visit [jwt.io](https://jwt.io) and paste one of your tokens into the "Encoded" box. Observe:

1. **Header:** `{"alg": "HS256", "typ": "JWT"}`
2. **Payload:** Your username, role, expiry time
3. **Signature:** The cryptographic proof

Now do it in Python. Create `decode_jwt.py`:

```python
import jwt
import sys

token = sys.argv[1] if len(sys.argv) > 1 else input("Paste JWT: ")

# DO NOT VERIFY — just decode the payload (for learning only)
# In production, ALWAYS verify the signature!
try:
    decoded = jwt.decode(token, options={"verify_signature": False})
    print("=== Payload (NO verification — for learning only) ===")
    for key, value in decoded.items():
        print(f"  {key}: {value}")
    
    from datetime import datetime, timezone
    if 'exp' in decoded:
        exp_time = datetime.fromtimestamp(decoded['exp'], tz=timezone.utc)
        now = datetime.now(timezone.utc)
        remaining = exp_time - now
        print(f"\n  Token expires: {exp_time}")
        print(f"  Time remaining: {remaining}")
        print(f"  Expired: {remaining.total_seconds() <= 0}")
except Exception as e:
    print(f"Error: {e}")
```

```bash
python decode_jwt.py "$TOKEN_SARAH"
```

---

## Part E: Answer These Questions (10 minutes)

1. **Why do we return the same error for "wrong username" and "wrong password"?** (Look at the login endpoint — it returns the same message for both cases.)
2. **What's the difference between 401 and 403 in our API?** When does each occur?
3. **Where is the RBAC enforced?** Is it in the JWT payload, the `require_permission` function, or both?
4. **What would happen if you removed `verify_exp: True` from `decode_and_verify_jwt`?** Try it.
5. **Why is `HS256` (symmetric) fine for this lab but bad for our production blueprint?** (Hint: Who needs to know the SECRET_KEY?)

---

## Stuck?

| Symptom | Likely Cause | Fix |
|---|---|---|
| `ModuleNotFoundError: No module named 'jwt'` | Installed wrong package | You need `PyJWT`, not `jwt`. Run `pip install pyjwt`. The import is `import jwt` but the package name is `pyjwt`. |
| `jwt.exceptions.InvalidSignatureError` on every request | Token was tampered with or SECRET_KEY changed | Regenerate the token after any code change. Tokens are signed with the SECRET_KEY at creation time — if the key changes, old tokens become invalid. |
| 403 on endpoints that should work | Wrong token being used | Run `curl -s http://localhost:8000/api/me -H "Authorization: Bearer $TOKEN_SARAH"` to verify which user your token belongs to. The role is in the response. |
| "Method Not Allowed" (405) on refund endpoint | Using GET instead of POST | The refund endpoint is `POST /api/refunds`. Make sure you use `-X POST` in your curl command. |
| Token claims look wrong in jwt.io | Base64 padding issue | jwt.io handles padding automatically. If you decode manually in Python, use `jwt.decode()` rather than manually splitting and base64-decoding. |
| Swagger UI shows "Authorize" but token is not sent | Forgot to include "Bearer " prefix | In Swagger UI, click Authorize and paste: `Bearer eyJhbGci...` (with the word Bearer and a space before the token). |

**Expected output:** You should be able to fill in the full test matrix table with the correct pass/fail results. Specifically: Mike (General) should get 403 on `/api/refunds` and `/api/admin/users`. Sarah (Finance) should get 403 on `/api/admin/users`. Priya (Admin) should succeed on all endpoints. Invalid/expired tokens should return 401 on all endpoints.

---

## What You've Practiced

- Issued JWT tokens with custom claims (role)
- Verified JWT signatures on every request
- Implemented RBAC with FastAPI dependencies
- Tested every role-permission combination
- Understood 401 vs. 403 error semantics
- Decoded a JWT payload manually

---

## Cleanup

Just stop the server (Ctrl+C). Nothing to clean up — it's all local.

---

**Done?** You've built the exact auth pattern we use in our blueprint (Cognito replaces our manual JWT creation, but the verification and RBAC logic is the same). Understanding this end-to-end is a major milestone for a junior engineer.
