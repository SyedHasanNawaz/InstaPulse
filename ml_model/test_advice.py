import InstaPulse
import json

try:
    print("Fetching advice...")
    advice = InstaPulse.get_optimization_advice("Technology")
    print(json.dumps(advice, indent=2))
except Exception as e:
    print(f"Error: {e}")
