from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
import warnings

# Suppress warnings that might come from scikit-learn and numpy version differences
warnings.filterwarnings('ignore')

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Load the trained model
model_path = os.path.join('models', 'diabetes_model.pkl')
try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    # Get data from request
    data = request.json
    
    # Extract features in the correct order
    try:
        features = np.array([
            data['pregnancies'],
            data['glucose'],
            data['bloodPressure'],
            data['skinThickness'],
            data['insulin'],
            data['bmi'],
            data['dpf'],
            data['age']
        ]).reshape(1, -1)  # Reshape for a single prediction
        
        # Make prediction - exactly as in your training code
        probability = model.predict_proba(features)[0][1]  # Get the probability for class 1
        prediction = int(model.predict(features)[0])  # Get the actual prediction (0 or 1)
        
        # Return result
        return jsonify({
            'prediction': bool(prediction),  # Convert to boolean for JSON
            'probability': float(probability)  # Convert to float for JSON
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # For local development, use:
    # app.run(port=5000)
    
    # For production with Render, allow binding to the PORT environment variable
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
