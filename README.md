# Diabetes Prediction Web Application

## Overview

This interactive web application predicts the likelihood of diabetes using machine learning based on the Pima Indian Diabetes Dataset. Users can input their health metrics and receive a personalized risk assessment with detailed visualizations.

![Diabetes Prediction App Screenshot](https://i.postimg.cc/fk55ykHy/diabetes-app-screenshot.jpg)

## Features

- **Interactive User Interface**: Clean, responsive design with intuitive navigation
- **Educational Content**: Information about diabetes and the importance of early detection
- **Predictive Analysis**: Uses a machine learning model to predict diabetes risk
- **Personalized Risk Assessment**: Detailed feedback based on prediction probability
- **Data Visualization**: Multiple interactive charts to help understand risk factors
  - Gauge chart showing overall risk percentage
  - Bar chart comparing health indicators
  - Radar chart analyzing risk factors against normal ranges
- **Detailed Summary**: Tabular view of input values with normal ranges

## Project Structure

```
DATA_MINING_PROJECT/
├── index.html             # Main HTML file
├── styles.css             # CSS styling
├── script.js              # Frontend JavaScript
├── app.py                 # Flask backend server
├── models/                # Directory for ML models
│   └── diabetes_model.pkl # Trained machine learning model
└── requirements.txt       # Python dependencies
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Chart.js, AOS.js
- **Backend**: Python, Flask
- **Machine Learning**: Scikit-learn (for model training and prediction)
- **Data Processing**: NumPy

## Installation

### Prerequisites

- Python 3.7+ installed
- Basic knowledge of command line operations

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/badar24434/DATA_MINING_PROJECT.git
   cd DATA_MINING_PROJECT
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Ensure your trained model file (`diabetes_model.pkl`) is in the `models` directory.

## Running the Application

1. Start the Flask backend server:
   ```
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## How to Use

1. **Read about Diabetes**: Start by reviewing the educational cards to understand diabetes and the importance of early detection.

2. **Enter Your Health Data**: Fill in the form with your health metrics:
   - Pregnancies (number)
   - Glucose level (mg/dL)
   - Blood Pressure (mmHg)
   - Skin Thickness (mm)
   - Insulin level (μU/mL)
   - BMI (kg/m²)
   - Diabetes Pedigree Function
   - Age (years)

3. **Get Prediction**: Click the "Predict" button to see your results.

4. **Review Results**: Examine your diabetes risk prediction and the detailed visualizations to understand which factors contribute most to your risk level.

5. **Take Action**: Use the personalized risk assessment to decide on next steps regarding your health.

## Model Information

The prediction model was trained on the Pima Indian Diabetes Dataset, which contains health data from female patients of Pima Indian heritage. The model considers various health indicators to predict diabetes risk.

## Troubleshooting

- **Server Won't Start**: Ensure no other applications are using port 5000
- **Model Loading Error**: Verify that your model file exists in the models directory
- **Prediction Error**: Check that input values are within reasonable ranges

## Contributing

Contributions to improve the application are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is for educational purposes only. Please see the LICENSE file for details.

## Acknowledgments

- The Pima Indian Diabetes Dataset from [Kaggle](https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database)
- Chart.js for data visualization
- AOS.js for scroll animations


## Important Deployment Notes

- Make sure your model file (`diabetes_model.pkl`) is included in your repository or uploaded to the service
- Free tiers of hosting services may have limited resources or "sleep" after periods of inactivity
- Consider adding proper error handling for production environments
