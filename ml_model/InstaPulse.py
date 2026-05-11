#!/usr/bin/env python
# coding: utf-8

import os
import ollama
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.ensemble import RandomForestClassifier, IsolationForest, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score
from textblob import TextBlob
import warnings
import json

# Headless matplotlib only when imported by the web backend
import matplotlib
if __name__ != "__main__":
    matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

warnings.filterwarnings('ignore')

# --- ENVIRONMENT & MODEL SETTINGS ---
# Load .env file manually so it works in both Terminal and Backend
def load_env_file():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    # Remove potential quotes
                    value = value.strip().strip('"').strip("'")
                    os.environ[key] = value

load_env_file()
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
print(f"Using AI Model: {OLLAMA_MODEL}")

# Global path settings
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, 'Instagram_Analytics.csv')

# --- GLOBAL DATA & MODEL CACHE ---
_GLOBAL_DF = None
_CACHED_MODEL = None
_CACHED_STATS = None

def get_data():
    global _GLOBAL_DF
    if _GLOBAL_DF is None:
        try:
            _GLOBAL_DF = pd.read_csv(CSV_PATH)
        except:
            _GLOBAL_DF = pd.read_csv('Instagram_Analytics.csv')
    return _GLOBAL_DF

def get_trained_model():
    """Cached global model trained on the FULL dataset (all media types).
    Used by the web API for fast predictions."""
    global _CACHED_MODEL
    if _CACHED_MODEL is not None:
        return _CACHED_MODEL

    df = get_data()
    df['is_success'] = df['performance_bucket_label'].isin(['high', 'viral']).astype(int)

    num_features = ['follower_count', 'caption_length', 'hashtags_count', 'post_hour', 'has_call_to_action']
    df_encoded = pd.get_dummies(df, columns=['media_type', 'day_of_week', 'content_category'])
    all_features = num_features + [col for col in df_encoded.columns
                                    if col.startswith('media_type_') or col.startswith('day_of_week_') or col.startswith('content_category_')]

    X = df_encoded[all_features]
    y = df_encoded['is_success']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_scaled, y)
    
    iso_model = IsolationForest(contamination=0.05, random_state=42)
    iso_model.fit(X_scaled)
    
    nn_model = NearestNeighbors(n_neighbors=5, metric='manhattan')
    nn_model.fit(X_scaled)

    _CACHED_MODEL = (rf_model, iso_model, nn_model, scaler, all_features)
    return _CACHED_MODEL

# --- ORIGINAL CODE LOGIC ---

def show_trending_niches(day, hour):
    df = get_data()
    time_df = df[(df['day_of_week'] == day) & (df['post_hour'] == hour)]

    if time_df.empty:
        time_df = df[df['post_hour'] == hour]

    if not time_df.empty:
        niche_stats = time_df.groupby('content_category')['engagement_rate'].mean().sort_values(ascending=False).head(3)
        print(f"\n==================================================")
        print(f"      TRENDING NICHES AT {hour}:00 ON {day.upper()} ")
        print(f"==================================================")
        for rank, (niche, eng_rate) in enumerate(niche_stats.items(), 1):
            print(f"#{rank} {niche} (Avg Engagement: {eng_rate:.4f})")
    else:
        print("\nNot enough historical data to determine trending niches for this time slot.")


def instagram_ai_pipeline(follower_count, caption_length, hashtags_count, post_hour,
                           day_of_week, media_type, content_category, has_call_to_action,
                           verbose=False):
    """Core AI pipeline.
    - verbose=True  → full terminal output (model comparison, A/B test, anomaly, sentiment)
    - verbose=False → silent, returns data dict for the web API
    """
    rf_model, iso_model, nn_model, scaler, all_features = get_trained_model()
    df = get_data()

    # Filter for baseline stats (K-NN)
    df_filtered = df[df['media_type'].str.lower() == media_type.lower()].copy()
    if df_filtered.empty:
        df_filtered = df.copy()

    # ========== USER INPUT VECTOR (Using global feature set) ==========
    input_row = {
        'follower_count': follower_count,
        'caption_length': caption_length,
        'hashtags_count': hashtags_count,
        'post_hour': post_hour,
        'has_call_to_action': has_call_to_action
    }
    
    # Dynamic dummy encoding for the input row (case-insensitive)
    for col in all_features:
        if col.startswith('media_type_') and col.lower().endswith(f'_{media_type.lower()}'):
            input_row[col] = 1
        elif col.startswith('day_of_week_') and col.lower().endswith(f'_{day_of_week.lower()}'):
            input_row[col] = 1
        elif col.startswith('content_category_') and col.lower().endswith(f'_{content_category.lower()}'):
            input_row[col] = 1
        elif col not in input_row:
            input_row[col] = 0

    input_df = pd.DataFrame([input_row])[all_features]
    user_input_scaled = scaler.transform(input_df)

    # ========== MODEL EVALUATION & COMPARISON (terminal only) ==========
    if verbose:
        print("\n" + "=" * 50)
        print("MODEL STATUS: Using Globally Trained Brain")
        print("=" * 50)
        print(f"Algorithm: Random Forest Classifier (100 estimators)")
        print(f"Features: {len(all_features)} mapped tokens")
        print(f"Caching: ACTIVE (Retraining skipped for speed)")

    # K-NN neighbor analysis (uses the global dataframe for indexing)
    distances, indices = nn_model.kneighbors(user_input_scaled)
    neighbors = df.iloc[indices[0]]
    avg_likes = neighbors['likes'].mean()
    avg_engagement = neighbors['engagement_rate'].mean()

    # Current prediction
    current_prob = rf_model.predict_proba(user_input_scaled)[0][1] * 100

    # ========== A/B TESTING SIMULATOR ==========
    best_prob = current_prob
    best_hour = post_hour
    best_hashtags = hashtags_count
    best_scaled_input = user_input_scaled

    for hour in range(24):
        for tags in range(3, 16):
            temp_df = input_df.copy()
            temp_df['post_hour'] = hour
            temp_df['hashtags_count'] = tags
            temp_scaled = scaler.transform(temp_df)
            prob = rf_model.predict_proba(temp_scaled)[0][1] * 100
            if prob > best_prob:
                best_prob = prob
                best_hour = hour
                best_hashtags = tags
                best_scaled_input = temp_scaled

    # Anomaly detection
    anomaly_score = iso_model.decision_function(best_scaled_input)[0]
    viral_capacity = min(99.9, max(1.0, (0.5 - anomaly_score) * 100))


    # ========== AI CONTENT GENERATION ==========
    ai_generated_text = ""
    prompt = f"""
    You are an expert Instagram Growth Hacker & Content Strategist.
    User Context: {follower_count} followers | Niche: {content_category} | Format: {media_type} | Post Time: {best_hour}:00.

    TASK:
    1. CAPTIONS: Create 3 high-conversion captions. 
       - Variation 1: Educational/Value-driven.
       - Variation 2: Short & Punchy (Viral style).
       - Variation 3: Storytelling with a strong Call-To-Action (CTA).
    2. HASHTAGS: Provide 20 niche-specific hashtags divided into:
       - 10 Low-competition (Niche specific).
       - 5 Medium-competition (Trending).
       - 5 High-reach (Broad).

    RULES: Use emojis, strong hooks, and NO generic hashtags like #instagram or #explore. Output ONLY the captions and hashtags.
    """
    try:
        response = ollama.chat(messages=[{"role": "user", "content": prompt}], model=OLLAMA_MODEL)
        ai_generated_text = response['message']['content']
    except Exception as e:
        print(f"Error calling Ollama ({OLLAMA_MODEL}): {e}")
        ai_generated_text = f"#growth #viral #{content_category.lower()} #{media_type.lower()}"

    # ========== TERMINAL OUTPUT (only when verbose) ==========
    if verbose:
        print(f"\n==================================================")
        print(f"      A/B TESTING SIMULATOR & PREDICTION          ")
        print(f"==================================================")
        print(f"K-NN Baseline - Expected Likes: {avg_likes:.0f} | Engagement: {avg_engagement:.4f}")
        print("-" * 50)
        print("VARIANT A (User Original Plan)")
        print(f"Time: {post_hour}:00 | Hashtags: {hashtags_count}")
        print(f"Success Probability: {current_prob:.2f}%\n")

        print("VARIANT B (AI Optimized Plan)")
        print(f"Time: {best_hour}:00 | Hashtags: {best_hashtags}")
        print(f"Success Probability: {best_prob:.2f}%")
        print("-" * 50)

        if best_prob > current_prob:
            print(f"WINNER: Variant B. By shifting parameters, probability increases by {best_prob - current_prob:.2f}%.")
        else:
            print("WINNER: Variant A. Your current plan is fully optimized.")

        print(f"\n==================================================")
        print(f"      VIRAL ANOMALY DETECTION (ISOLATION FOREST)  ")
        print(f"==================================================")
        if anomaly_score < 0:
            print(f"ALERT: This post setup is an OUTLIER compared to normal posts!")
            print(f"Analysis: Aapki is post mein aam posts se hat kar ek Viral Anomaly banne ki {viral_capacity:.1f}% capacity hai.")
        else:
            print(f"Analysis: This post follows normal historical patterns.")
            print(f"Viral Anomaly Capacity: {viral_capacity:.1f}% (Consider experimenting with highly trending niches to increase this).")

        print(f"\n{'='*50}")
        header = "AI CONTENT GENERATOR (LOCALLY HOSTED)"
        print(f"{header.center(50)}")
        print(f"{'='*50}")
        print(ai_generated_text)

        # NLP Sentiment Analysis
        blob = TextBlob(ai_generated_text)
        sentiment_score = blob.sentiment.polarity

        print(f"\n==================================================")
        print(f"      NLP SENTIMENT ANALYSIS (TONE CHECKER)       ")
        print(f"==================================================")
        print(f"Overall Sentiment Polarity Score: {sentiment_score:.2f} (Range: -1.0 to 1.0)")
        if sentiment_score > 0.3:
            print("Tone Evaluation: Highly Positive & Engaging! Perfect for social media reach.")
        elif sentiment_score > 0:
            print("Tone Evaluation: Mildly Positive. Good, but could use stronger hook words.")
        elif sentiment_score == 0:
            print("Tone Evaluation: Neutral. Consider adding emojis or an emotional angle.")
        else:
            print("Tone Evaluation: Negative/Aggressive. Might not perform well for general audiences.")

    # ========== RETURN DATA (for web API) ==========
    return {
        "current_prob": current_prob,
        "best_prob": best_prob,
        "best_hour": best_hour,
        "best_hashtags": best_hashtags,
        "ai_text": ai_generated_text,
        "avg_likes": avg_likes,
        "avg_engagement": avg_engagement,
        "viral_capacity": viral_capacity
    }


# =====================================================
# WEB API HELPER FUNCTIONS (called by backend/ml.py)
# =====================================================

def get_dashboard_stats():
    global _CACHED_STATS
    if _CACHED_STATS is not None:
        return _CACHED_STATS
        
    df = get_data()
    if df.empty:
        return {"avgEngagement": "0.0%", "postsAnalyzed": 0, "recentPosts": []}

    avg_eng = df['engagement_rate'].mean()
    days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly = df.groupby('day_of_week')['engagement_rate'].mean().reindex(days_order).fillna(0).tolist()
    hour_agg = df.groupby('post_hour')['engagement_rate'].mean().reindex(range(24)).fillna(0)
    best_hour_int = int(hour_agg.idxmax())
    best_hour_str = f"{best_hour_int % 12 or 12}:00 {'PM' if best_hour_int >= 12 else 'AM'}"
    chart_hours = [6, 9, 12, 15, 18, 21]
    hourly_data = [float(hour_agg[h]) * 100 for h in chart_hours]

    _CACHED_STATS = {
        "avgEngagement": f"{avg_eng * 100:.1f}%",
        "postsAnalyzed": len(df),
        "optimizationScore": "92/100",
        "bestTimeToday": best_hour_str,
        "weeklyTrend": [float(v) * 100 for v in weekly],
        "hourlyEngagement": hourly_data,
        "recentPosts": [
            {"title": "Morning Coffee", "engagement": "4.2%", "change": "+1.2%", "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&q=80"},
            {"title": "Beach Sunset", "engagement": "8.5%", "change": "+2.4%", "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&q=80"},
            {"title": "Tech Setup", "engagement": "5.1%", "change": "-0.5%", "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&q=80"}
        ]
    }
    return _CACHED_STATS


def get_optimization_advice(content_category="Technology", media_type="reel", followers=5000, day="Monday", hour=12):
    data = instagram_ai_pipeline(followers, 150, 10, hour, day, media_type, content_category, 1, verbose=False)
    boost = max(15, data['best_prob'] - data['current_prob'] + 5)
    hashtags = [word for word in data['ai_text'].split() if word.startswith('#')][:8]
    if not hashtags:
        hashtags = ['#growth', '#viral', f'#{content_category.lower()}']

    return {
        "potentialBoost": f"+{boost:.1f}%",
        "pulseScore": int(data['current_prob']),
        "bestHour": f"{data['best_hour'] % 12 or 12}:00 {'PM' if data['best_hour'] >= 12 else 'AM'}",
        "bestHashtagsCount": data['best_hashtags'],
        "suggestedHashtags": hashtags,
        "captionTips": ["Use a strong hook in line 1", "Keep it under 150 chars", "Ask a question"],
        "hashtagsImpact": f"+{boost * 0.4:.0f}%",
        "timeImpact": f"+{boost * 0.4:.0f}%",
        "captionImpact": f"+{boost * 0.2:.0f}%",
        "reach": f"{(followers * (1 + data['best_prob'] / 100)):.1f}k"
    }


def refine_caption(original_caption):
    prompt = f"""
    Instagram Expert: Refine this caption. Provide 3 high-engaging variations.
    Original: {original_caption}
    
    You MUST output ONLY a valid JSON object with exactly these keys: "Hook", "Story", "Pro".
    No conversational filler.
    """
    try:
        response = ollama.chat(messages=[{"role": "user", "content": prompt}], model=OLLAMA_MODEL)
        text = response['message']['content']
        
        # More robust JSON extraction
        import re
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        
        # Fallback if AI didn't provide JSON structure
        return {
            "Hook": f"🔥 {original_caption}",
            "Story": f"Story: {original_caption}",
            "Pro": f"Pro: {original_caption}"
        }
    except Exception as e:
        print(f"Refine Caption Error: {e}")
        return {"Hook": f"🔥 {original_caption}", "Story": f"Story: {original_caption}", "Pro": f"Pro: {original_caption}"}


# =====================================================
# TERMINAL INTERACTIVE BLOCK
# =====================================================
if __name__ == "__main__":
    df = get_data()
    print("Dataset loaded successfully!")
    print(f"Total rows (Data points): {df.shape[0]}")
    print(f"Total columns (Features): {df.shape[1]}")
    print(df.head(3))

    print("\nPlease provide the details for your Instagram post:")
    user_media_type = input("Enter Media Type (reel, image, carousel): ").lower()
    user_content_category = input("Enter Content Category (e.g., Technology, Photography, Fitness): ")
    user_day_of_week = input("Enter Day of Week (e.g., Monday, Sunday): ")
    user_follower_count = int(input("Enter your Follower Count: "))
    user_caption_length = int(input("Enter estimated Caption Length (number of characters): "))
    user_hashtags_count = int(input("Enter current number of Hashtags you plan to use: "))
    user_post_hour = int(input("Enter Post Hour (0-23): "))
    user_cta = int(input("Does it have a Call to Action? (Enter 1 for Yes, 0 for No): "))

    show_trending_niches(user_day_of_week, user_post_hour)

    instagram_ai_pipeline(
        follower_count=user_follower_count,
        caption_length=user_caption_length,
        hashtags_count=user_hashtags_count,
        post_hour=user_post_hour,
        day_of_week=user_day_of_week,
        media_type=user_media_type,
        content_category=user_content_category,
        has_call_to_action=user_cta,
        verbose=True
    )

    # Visualization blocks
    media_agg = df.groupby('media_type')['engagement_rate'].mean().reset_index()
    plt.figure(figsize=(8, 5))
    sns.barplot(data=media_agg, x='media_type', y='engagement_rate', palette='viridis')
    plt.title('Average Engagement Rate by Media Type', fontsize=14)
    plt.ylabel('Average Engagement Rate', fontsize=12)
    plt.xlabel('Media Type', fontsize=12)
    plt.show()

    hour_agg = df.groupby('post_hour')['engagement_rate'].mean().reset_index()
    plt.figure(figsize=(10, 5))
    sns.lineplot(data=hour_agg, x='post_hour', y='engagement_rate', marker='o', color='blue', linewidth=2)
    plt.title('Average Engagement Rate by Post Hour', fontsize=14)
    plt.ylabel('Average Engagement Rate', fontsize=12)
    plt.xlabel('Post Hour (0-23)', fontsize=12)
    plt.xticks(range(0, 24))
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.show()
