# ML Doctor - Diabetes Risk Prediction Web Application

This repository contains the **full-stack web application** for the diabetes risk prediction project. This is part of a larger project that develops a machine learning tool to predict diabetes risk based on health and lifestyle data.

🔗 **For the complete data processing and model training details, visit the main project repository: [Predicting Diabetes Risks](https://github.com/znwayoo/Predicting-Diabetes-Risks)**

## Project Overview

ML Doctor is a user-friendly web application that allows users to input their health data and receive diabetes risk predictions using trained machine learning models. The application features:

- **Frontend**: React.js with TailwindCSS for responsive UI
- **Backend**: Flask API for model inference and data processing
- **Models**: Pre-trained ML models (KNN, Decision Tree, Random Forest, etc.)

## Live Demo

🌐 **Web Application**: [https://ml-doctor-frontend.onrender.com/](https://ml-doctor-frontend.onrender.com/)

*Note: The backend is hosted on Render's free tier, so initial loading may take a few minutes.*

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Start both backend and frontend servers
2. Open your browser to `http://localhost:3000`
3. Fill in the health assessment form
4. Click "Predict" to get your diabetes risk assessment
5. View detailed results and feature importance insights

## Project Structure

```
ml-doctor/
├── backend/           # Flask API server
│   ├── models/        # Trained ML models
│   ├── app.py         # Main Flask application
│   └── requirements.txt
├── frontend/          # React.js application
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Related Links

- 📊 **Main Project Repository**: [Predicting Diabetes Risks](https://github.com/znwayoo/Predicting-Diabetes-Risks)
- 🚀 **Streamlit Prototype**: [Diabetic Doctor](https://diabetic-doctor-zno.streamlit.app/)

## Contributing

This is an academic project. For questions or suggestions, please refer to the main project repository.

## License

This project is part of an academic research conducted by Zarni NwayOo (MMDT2024.043) under the supervision of Dr Myo Thida.