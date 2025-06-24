# Model Directory

Place your trained diabetes prediction model here as `diabetes_model.pkl`.

The model should be a scikit-learn model with both `predict()` and `predict_proba()` methods.

Example of expected usage:
```python
# Loading the model
import pickle
with open('diabetes_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Making predictions
import numpy as np
features = np.array([6, 148, 72, 35, 0, 33.6, 0.627, 50]).reshape(1, -1)

# Get probability (should return a value between 0 and 1)
probability = model.predict_proba(features)[0][1]
print(f"Probability of having diabetes: {probability}")

# Get binary prediction (should return 0 or 1)
prediction = model.predict(features)[0]
print(f"Prediction (0=No, 1=Yes): {prediction}")
```
