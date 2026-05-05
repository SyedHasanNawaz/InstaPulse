import os

base_dir = "/Users/mba/devv/InstaPulse"
os.chdir(base_dir)

files = [
    ".gitignore", "README.md", ".env.example",
    "frontend/src/components/common/Navbar.tsx", "frontend/src/components/common/Sidebar.tsx", "frontend/src/components/common/Button.tsx", "frontend/src/components/common/Modal.tsx", "frontend/src/components/common/Avatar.tsx",
    "frontend/src/components/instagram-clone/Feed/FeedPost.tsx", "frontend/src/components/instagram-clone/Feed/FeedGrid.tsx", "frontend/src/components/instagram-clone/Feed/StoriesBar.tsx",
    "frontend/src/components/instagram-clone/Reels/ReelCard.tsx", "frontend/src/components/instagram-clone/Reels/ReelsViewer.tsx",
    "frontend/src/components/instagram-clone/Profile/ProfileHeader.tsx", "frontend/src/components/instagram-clone/Profile/ProfileGrid.tsx",
    "frontend/src/components/instagram-clone/Explore/ExploreGrid.tsx",
    "frontend/src/components/instapulse-dss/Dashboard/StatsCard.tsx", "frontend/src/components/instapulse-dss/Dashboard/EngagementChart.tsx", "frontend/src/components/instapulse-dss/Dashboard/BestTimeChart.tsx",
    "frontend/src/components/instapulse-dss/CreatePost/PostEditor.tsx", "frontend/src/components/instapulse-dss/CreatePost/InstagramPreview.tsx", "frontend/src/components/instapulse-dss/CreatePost/MediaUpload.tsx",
    "frontend/src/components/instapulse-dss/OptimizationAdvisor/SuggestionCard.tsx", "frontend/src/components/instapulse-dss/OptimizationAdvisor/ProTips.tsx",
    "frontend/src/components/instapulse-dss/History/HistoryTable.tsx", "frontend/src/components/instapulse-dss/History/TrendChart.tsx",
    "frontend/src/components/instapulse-dss/PostMetrics/MetricsCard.tsx",
    "frontend/src/pages/auth/Login.tsx", "frontend/src/pages/auth/Signup.tsx",
    "frontend/src/pages/instagram-clone/FeedPage.tsx", "frontend/src/pages/instagram-clone/ReelsPage.tsx", "frontend/src/pages/instagram-clone/ExplorePage.tsx", "frontend/src/pages/instagram-clone/ProfilePage.tsx", "frontend/src/pages/instagram-clone/UploadPage.tsx",
    "frontend/src/pages/instapulse-dss/DashboardPage.tsx", "frontend/src/pages/instapulse-dss/CreatePostPage.tsx", "frontend/src/pages/instapulse-dss/OptimizationPage.tsx", "frontend/src/pages/instapulse-dss/HistoryPage.tsx", "frontend/src/pages/instapulse-dss/FeedSimulationPage.tsx", "frontend/src/pages/instapulse-dss/ProfileSettingsPage.tsx",
    "frontend/src/hooks/useAuth.ts", "frontend/src/hooks/usePrediction.ts", "frontend/src/hooks/useFeed.ts",
    "frontend/src/services/auth.service.ts", "frontend/src/services/post.service.ts", "frontend/src/services/prediction.service.ts", "frontend/src/services/history.service.ts",
    "frontend/src/store/AuthContext.tsx", "frontend/src/store/PostContext.tsx",
    "frontend/src/types/user.types.ts", "frontend/src/types/post.types.ts", "frontend/src/types/prediction.types.ts",
    "frontend/src/utils/formatDate.ts", "frontend/src/utils/hashtagParser.ts",
    "frontend/src/App.tsx", "frontend/src/main.tsx", "frontend/src/index.css",
    "frontend/tailwind.config.js", "frontend/tsconfig.json", "frontend/vite.config.ts", "frontend/package.json",
    "backend/app/__init__.py", "backend/app/config.py",
    "backend/app/models/user.py", "backend/app/models/post.py", "backend/app/models/like.py", "backend/app/models/comment.py", "backend/app/models/session.py", "backend/app/models/history.py",
    "backend/app/routes/auth.py", "backend/app/routes/posts.py", "backend/app/routes/feed.py", "backend/app/routes/likes.py", "backend/app/routes/comments.py", "backend/app/routes/profile.py", "backend/app/routes/history.py",
    "backend/app/middleware/auth_middleware.py", "backend/app/middleware/error_handler.py",
    "backend/app/utils/validators.py", "backend/app/utils/media_handler.py",
    "backend/migrations/init_schema.sql",
    "backend/tests/test_auth.py", "backend/tests/test_posts.py",
    "backend/requirements.txt", "backend/run.py",
    "ml_model/notebooks/01_eda.ipynb", "ml_model/notebooks/02_preprocessing.ipynb", "ml_model/notebooks/03_model_training.ipynb",
    "ml_model/src/preprocess.py", "ml_model/src/train.py", "ml_model/src/evaluate.py", "ml_model/src/predict.py",
    "ml_model/saved_models/engagement_model.pkl",
    "ml_model/api/prediction_api.py", "ml_model/api/requirements.txt",
    "ml_model/accuracy_report.md",
    "docs/SRS_v1.1.docx", "docs/user_manual.md", "docs/api_reference.md", "docs/demo_presentation.pptx", "docs/postman_collection.json"
]

dirs = [
    "frontend/public/assets/images",
    "frontend/public/assets/icons",
    "ml_model/data/raw",
    "ml_model/data/processed"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

for f in files:
    os.makedirs(os.path.dirname(f) or ".", exist_ok=True)
    open(f, 'a').close()

print("Creation done via Python.")
