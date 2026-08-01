# Exercise 3: Measure and Optimize Latency

> **Connects to:** [Lecture 3: Performance Strategy](../README.md#3-performance-strategy)
>
> **Time to complete:** 45-60 minutes
>
> **What you'll need:** Python 3.10+, `pip install redis flask requests locust`

---

## Objective

Build a small API, measure its latency, add caching, and prove (with numbers) that caching makes it faster. Then run a load test to see how it behaves under pressure.

---

## Scenario

You have a "slow" API endpoint that simulates an expensive computation (like an LLM call or a complex database query). Your job is to make it fast using Redis caching and measure the improvement.

---

## Part A: Build the Slow API (10 minutes)

Create a file called `slow_api.py`:

```python
"""A deliberately slow API that simulates an expensive operation."""
import time
import random
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/compute', methods=['GET'])
def compute():
    """
    Simulates an expensive operation.
    In real life, this might be:
    - An LLM API call (~1000ms)
    - A complex SQL query with joins (~200ms)
    - A vector search (~150ms)
    """
    input_value = request.args.get('value', 'default')
    
    # Simulate "thinking time" — 500-800ms
    think_time = random.uniform(0.5, 0.8)
    time.sleep(think_time)
    
    result = {
        'input': input_value,
        'output': f'Processed: {input_value.upper()}',
        'compute_time_ms': round(think_time * 1000, 2),
        'cached': False
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=False)
```

Run it in a terminal:
```bash
python slow_api.py
```

Test it (in another terminal):
```bash
time curl "http://localhost:5000/api/compute?value=hello"
# Should take ~500-800ms
```

---

## Part B: Measure Baseline Latency (10 minutes)

Create a benchmark script called `benchmark.py`:

```python
"""Measure API latency — before and after optimization."""
import time
import requests
import statistics

API_URL = "http://localhost:5000/api/compute"
NUM_REQUESTS = 20

def measure_latency(url: str, n: int = NUM_REQUESTS) -> dict:
    """Make N requests and return latency statistics."""
    latencies = []
    
    for i in range(n):
        start = time.perf_counter()
        resp = requests.get(url, params={"value": f"test_{i}"})
        elapsed_ms = (time.perf_counter() - start) * 1000
        latencies.append(elapsed_ms)
        print(f"  Request {i+1}/{n}: {elapsed_ms:.1f}ms — {resp.json()['output']}")
    
    latencies.sort()
    return {
        'min': min(latencies),
        'max': max(latencies),
        'mean': statistics.mean(latencies),
        'median': statistics.median(latencies),
        'p95': latencies[int(len(latencies) * 0.95)],
        'p99': latencies[int(len(latencies) * 0.99)],
    }

if __name__ == '__main__':
    print("=" * 60)
    print("BASELINE: No caching")
    print("=" * 60)
    baseline = measure_latency(API_URL)
    
    print("\n📊 Results (20 requests):")
    for metric, value in baseline.items():
        print(f"  {metric:>8}: {value:>8.1f} ms")
    
    print("\n💡 The P95 means '95% of requests were faster than this.'")
    print("   It's often more important than the average because it")
    print("   tells you about the worst user experiences.")
```

Run it:
```bash
python benchmark.py
```

Record your baseline numbers in a table:

| Metric | Baseline (No Cache) | With Cache (Part C) |
|---|---|---|
| Min | ___ ms | ___ ms |
| Mean | ___ ms | ___ ms |
| Median | ___ ms | ___ ms |
| P95 | ___ ms | ___ ms |
| Max | ___ ms | ___ ms |

---

## Part C: Add Redis Caching (15 minutes)

### Step 1: Install and Start Redis

```bash
# macOS
brew install redis && brew services start redis

# Linux (Ubuntu/Debian)
sudo apt install redis-server && sudo systemctl start redis

# Verify it's running
redis-cli ping
# Should respond: PONG
```

### Step 2: Create the Fast Version

Create `fast_api.py`:

```python
"""The same API, but with Redis caching."""
import time
import random
import hashlib
import redis
from flask import Flask, request, jsonify

app = Flask(__name__)
cache = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

CACHE_TTL = 30  # Cache results for 30 seconds

@app.route('/api/compute', methods=['GET'])
def compute():
    input_value = request.args.get('value', 'default')
    
    # Create a cache key from the input
    cache_key = f"compute:{hashlib.sha256(input_value.encode()).hexdigest()[:12]}"
    
    # CHECK CACHE FIRST — this is the key change
    cached = cache.get(cache_key)
    if cached:
        import json
        result = json.loads(cached)
        result['cached'] = True
        result['cache_hit'] = True
        return jsonify(result)
    
    # Cache miss — do the expensive work
    think_time = random.uniform(0.5, 0.8)
    time.sleep(think_time)
    
    result = {
        'input': input_value,
        'output': f'Processed: {input_value.upper()}',
        'compute_time_ms': round(think_time * 1000, 2),
        'cached': False,
        'cache_hit': False
    }
    
    # STORE IN CACHE — set with TTL
    cache.setex(cache_key, CACHE_TTL, json.dumps(result))
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001, debug=False)
```

Run it on port 5001 (so the slow one can keep running on 5000):
```bash
python fast_api.py
```

### Step 3: Benchmark the Fast Version

Update `benchmark.py` to test both. Or run it manually:

```bash
# First request — cache miss, slow
time curl "http://localhost:5001/api/compute?value=hello"
# Should take ~500-800ms. Note: "cache_hit": false

# Second request with same value — cache hit, FAST
time curl "http://localhost:5001/api/compute?value=hello"
# Should take < 5ms. Note: "cache_hit": true
```

Now run the full benchmark:
```bash
# Edit benchmark.py: change API_URL to port 5001
# Then run:
python benchmark.py
```

Fill in your "With Cache" column. You should see the mean drop from ~650ms to something much lower (depending on cache hit ratio).

---

## Part D: Load Test with Locust (15 minutes)

### Step 1: Create a Locust Test

Create `locustfile.py`:

```python
from locust import HttpUser, task, between

class ComputeUser(HttpUser):
    wait_time = between(0.5, 1.5)  # Wait 0.5-1.5s between tasks
    
    @task(3)  # Weight: 3x more likely
    def popular_query(self):
        """Simulates a frequently-asked question (will be cached)"""
        self.client.get("/api/compute?value=popular_query")
    
    @task(1)  # Weight: 1x less likely
    def unique_query(self):
        """Simulates a unique question (cache miss)"""
        import uuid
        self.client.get(f"/api/compute?value={uuid.uuid4().hex[:8]}")
```

### Step 2: Run the Test

Start the fast API (port 5001) if not already running:
```bash
python fast_api.py
```

Run Locust against it:
```bash
locust -f locustfile.py --host=http://localhost:5001
```

Open http://localhost:8089 in your browser. Set:
- Number of users: **100**
- Spawn rate: **10** users/second
- Host: `http://localhost:5001`

Click "Start swarming."

### Step 3: Read the Results

Watch the Locust dashboard. Key metrics to observe:

| Metric | What to look for |
|---|---|
| **RPS (Requests/sec)** | How many requests your API handles per second |
| **Median (P50)** | Should be very low (< 10ms) because 75% of requests are cached |
| **P95** | Higher — the unique queries that miss the cache |
| **Failures** | Should be 0% |

After 2 minutes, click "Stop." Take a screenshot of the Charts tab.

---

## Part E: Answer These Questions (10 minutes)

1. **What was your cache hit ratio?** (Look at the responses — what % had `cache_hit: true`?)
2. **Why didn't P95 drop to near-zero like the median?** What requests make up the P95?
3. **What happens if you set `CACHE_TTL = 5` (5 seconds) and then run the benchmark?** Try it.
4. **What's the trade-off of a longer TTL?** When could stale cache data cause problems?
5. **In our real blueprint, what are we caching in Redis?** (Hint: Check Guide #3)

---

## Stuck?

| Symptom | Likely Cause | Fix |
|---|---|---|
| `redis.exceptions.ConnectionError` | Redis is not running | Run `redis-cli ping`. If it fails, start Redis: `brew services start redis` (macOS) or `sudo systemctl start redis` (Linux). |
| `ImportError: No module named 'redis'` | Virtual environment not activated or package not installed | Run `which python` — it should show the path inside your venv. Then run `pip install redis`. |
| Benchmark shows no improvement after adding cache | Your cache keys are different on every request | Check your `cache_key` hash. Make sure the same input produces the same key. Add `print(cache_key)` to debug. |
| Locust web UI does not open | Port 8089 already in use | Try `locust -f locustfile.py --host=http://localhost:5001 --web-port 8090`. Then open `http://localhost:8089` (Locust always uses 8089 by default — if it says something else, read the terminal output). |
| Only one Flask app can run at a time | Port already in use | Run the slow API on port 5000 and the fast API on port 5001, as shown in the instructions. Kill existing processes first: `lsof -ti:5000 | xargs kill`. |
| `json` module not found (in fast_api.py) | Missing import | Add `import json` at the top of `fast_api.py`. The example code uses `json.dumps()` without showing the import. |

**Expected output:** Your baseline benchmark should show mean latency of 500-800ms. After adding Redis caching, the mean should drop below 100ms (how far it drops depends on cache hit ratio). The Locust dashboard should show 100 concurrent users with 0% failure rate.

---

## What You've Practiced

- ✅ Measured API latency programmatically (min, mean, median, P95, P99)
- ✅ Implemented Redis caching with TTL-based expiration
- ✅ Proven (with numbers) that caching reduces latency by 100x+
- ✅ Understood cache hit ratios and why P95 matters
- ✅ Run a load test with Locust simulating 100 concurrent users

---

## Cleanup

```bash
# Stop Redis
brew services stop redis  # macOS
# or: sudo systemctl stop redis  # Linux

# Stop Flask apps (Ctrl+C in their terminals)
```

---

**Done?** You now have concrete evidence that "add caching" is not just a buzzword — it's a 100x performance improvement backed by measurements. This is exactly how we reason about performance in our blueprint.
