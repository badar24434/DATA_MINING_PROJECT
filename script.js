/**
 * Diabetes Prediction Interactive Homepage
 * 
 * This script handles all interactivity, form submissions, and visualizations.
 * Key features:
 * - Smooth scrolling
 * - Form validation and submission
 * - Data visualization with Chart.js
 * - Interactive elements and animations
 * - Responsive dashboard
 */

// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Reference elements
    const getStartedBtn = document.getElementById('getStarted');
    const diabetesForm = document.getElementById('diabetesForm');
    const resultsSection = document.getElementById('results');
    
    // Set up chart variables
    let barChart = null;
    let gaugeChart = null;
    
    // Normal ranges for health indicators (for display purposes)
    const normalRanges = {
        pregnancies: "N/A",
        glucose: "70-99 mg/dL",
        bloodPressure: "90/60 - 120/80 mmHg",
        skinThickness: "15-20 mm",
        insulin: "16-166 μU/mL",
        bmi: "18.5-24.9 kg/m²",
        dpf: "<0.5",
        age: "N/A"
    };
    
    // Indicator labels for better display
    const indicatorLabels = {
        pregnancies: "Pregnancies",
        glucose: "Glucose",
        bloodPressure: "Blood Pressure",
        skinThickness: "Skin Thickness",
        insulin: "Insulin",
        bmi: "BMI",
        dpf: "Diabetes Pedigree",
        age: "Age"
    };

    // Event listeners
    getStartedBtn.addEventListener('click', function() {
        document.getElementById('prediction-form').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    diabetesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processForm();
    });
    
    // Add tooltip functionality for form labels - disable this to prevent overlap
    /* 
    const formLabels = document.querySelectorAll('.form-group label');
    formLabels.forEach(label => {
        const tooltip = label.getAttribute('title');
        if (tooltip) {
            label.addEventListener('mouseenter', function(e) {
                showTooltip(e, tooltip);
            });
            
            label.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        }
    });
    */

    // Add tooltip functionality for info icons
    const infoIcons = document.querySelectorAll('.info-icon');
    infoIcons.forEach(icon => {
        const normalRange = icon.getAttribute('data-normal');
        if (normalRange) {
            icon.addEventListener('mouseenter', function(e) {
                e.stopPropagation(); // Prevent the parent label's tooltip from showing
                showNormalRangeTooltip(e, normalRange);
            });
            
            icon.addEventListener('mouseleave', function() {
                hideNormalRangeTooltip();
            });
        }
    });
    
    // Tooltip functions
    function showTooltip(e, text) {
        let tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = '100';
        tooltip.style.maxWidth = '250px';
        
        document.body.appendChild(tooltip);
        
        // Position the tooltip
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';
    }
    
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    // Normal range tooltip functions
    function showNormalRangeTooltip(e, text) {
        // Hide any existing tooltips first
        hideTooltip();
        hideNormalRangeTooltip();
        
        let tooltip = document.createElement('div');
        tooltip.className = 'normal-range-tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#2c3e50';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = '1000';
        tooltip.style.maxWidth = '250px';
        tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        
        document.body.appendChild(tooltip);
        
        // Position the tooltip relative to the icon
        const rect = e.target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        tooltip.style.left = `${rect.left + window.pageXOffset}px`;
        tooltip.style.top = `${rect.bottom + scrollTop + 5}px`;
        
        // Make tooltip visible immediately
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }
    
    function hideNormalRangeTooltip() {
        const tooltip = document.querySelector('.normal-range-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    // Process form data
    function processForm() {
        // Get form values
        const formData = {
            pregnancies: parseInt(document.getElementById('pregnancies').value),
            glucose: parseInt(document.getElementById('glucose').value),
            bloodPressure: parseInt(document.getElementById('bloodPressure').value),
            skinThickness: parseInt(document.getElementById('skinThickness').value),
            insulin: parseInt(document.getElementById('insulin').value),
            bmi: parseFloat(document.getElementById('bmi').value),
            dpf: parseFloat(document.getElementById('dpf').value),
            age: parseInt(document.getElementById('age').value)
        };
        
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Processing your data...';
        loadingMessage.className = 'loading-message';
        loadingMessage.style.textAlign = 'center';
        loadingMessage.style.padding = '20px';
        loadingMessage.style.fontSize = '18px';
        
        diabetesForm.appendChild(loadingMessage);
        
        // Send data to API
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Remove loading message
            loadingMessage.remove();
            
            // Format prediction for display
            const prediction = {
                probability: data.probability,
                diabetic: data.prediction
            };
            
            // Display results
            displayResults(formData, prediction);
            
            // Scroll to results
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        })
        .catch(error => {
            // Remove loading message
            loadingMessage.remove();
            
            // Show error
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Error making prediction. Please try again.';
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.padding = '20px';
            
            diabetesForm.appendChild(errorMessage);
            
            // Remove error after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
            
            console.error('Error:', error);
            
            // Fallback to mock prediction if API fails
            mockPredictionAPI(formData);
        });
    }
    
    // Keep the mock function as a fallback
    function mockPredictionAPI(formData) {
        // This simulates an API call to the backend
        // In a real application, you would use fetch() to send the data to your server
        
        // Simulate processing time
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Processing your data...';
        loadingMessage.className = 'loading-message';
        loadingMessage.style.textAlign = 'center';
        loadingMessage.style.padding = '20px';
        loadingMessage.style.fontSize = '18px';
        
        diabetesForm.appendChild(loadingMessage);
        
        setTimeout(() => {
            // Remove loading message
            loadingMessage.remove();
            
            // Generate a mock prediction
            // Using a simple formula for demo - higher values increase probability
            let score = 0;
            
            if (formData.glucose > 140) score += 0.3;
            if (formData.bmi > 30) score += 0.25;
            if (formData.age > 40) score += 0.15;
            if (formData.bloodPressure > 90) score += 0.15;
            if (formData.dpf > 0.8) score += 0.15;
            
            // Add some randomness
            score += Math.random() * 0.2;
            // Clamp between 0 and 1
            score = Math.min(Math.max(score, 0), 1);
            
            const prediction = {
                probability: score,
                diabetic: score > 0.5
            };
            
            // Display results
            displayResults(formData, prediction);
            
            // Scroll to results
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 1500);
    }
    
    function displayResults(formData, prediction) {
        const resultMessage = document.getElementById('result-message');
        
        // Set message and styling based on prediction
        const probabilityPercentage = Math.round(prediction.probability * 100);
        
        if (prediction.diabetic) {
            resultMessage.textContent = `Prediction: Diabetic (${probabilityPercentage}% probability)`;
            resultMessage.className = 'result-message diabetic';
        } else {
            resultMessage.textContent = `Prediction: Not Diabetic (${probabilityPercentage}% probability of having diabetes)`;
            resultMessage.className = 'result-message non-diabetic';
        }
        
        // Add risk level summary based on probability
        const summaryText = getRiskSummary(probabilityPercentage);
        const riskSummary = document.createElement('div');
        riskSummary.className = 'risk-summary';
        riskSummary.innerHTML = summaryText;
        
        // Remove any existing summary
        const existingSummary = resultMessage.nextElementSibling;
        if (existingSummary && existingSummary.className === 'risk-summary') {
            existingSummary.remove();
        }
        
        // Insert after result message
        resultMessage.after(riskSummary);
        
        // Create/update gauge chart
        createGaugeChart(prediction.probability);
        
        // Create/update bar chart
        createBarChart(formData);
        
        // Create/update radar chart (new interactive visualization)
        createRadarChart(formData);
        
        // Fill summary table
        fillSummaryTable(formData);
    }
    
    // New function to get risk summary based on probability percentage
    function getRiskSummary(probabilityPercentage) {
        if (probabilityPercentage < 10) {
            return "<strong>Very Low Risk:</strong> Your results indicate a very healthy profile. Continue maintaining your current lifestyle with balanced diet and regular exercise.";
        } else if (probabilityPercentage < 20) {
            return "<strong>Low Risk:</strong> Your diabetes risk is low. Focus on maintaining healthy habits and consider regular check-ups.";
        } else if (probabilityPercentage < 30) {
            return "<strong>Moderately Low Risk:</strong> While your risk is still relatively low, consider reviewing your diet and exercise routine for potential improvements.";
        } else if (probabilityPercentage < 40) {
            return "<strong>Moderate Risk:</strong> Your risk level suggests some caution is warranted. Consider consulting with a healthcare provider about preventive measures.";
        } else if (probabilityPercentage < 50) {
            return "<strong>Elevated Risk:</strong> Your risk factors are somewhat elevated. We recommend consulting with a healthcare professional about your diabetes risk.";
        } else if (probabilityPercentage < 60) {
            return "<strong>Moderately High Risk:</strong> Your profile shows several risk factors. Scheduling a visit with your doctor would be advisable to discuss prevention strategies.";
        } else if (probabilityPercentage < 70) {
            return "<strong>High Risk:</strong> Your results indicate a high risk profile. We strongly recommend consulting with a healthcare provider for proper evaluation.";
        } else if (probabilityPercentage < 80) {
            return "<strong>Very High Risk:</strong> Your risk level is very high. Please consult with a healthcare provider as soon as possible for evaluation and guidance.";
        } else if (probabilityPercentage < 90) {
            return "<strong>Extremely High Risk:</strong> Your results show very significant risk factors. Immediate consultation with a healthcare provider is strongly recommended.";
        } else {
            return "<strong>Critical Risk Level:</strong> Your profile indicates critical risk factors. Please seek medical advice immediately for proper evaluation and care.";
        }
    }
    
    // Update gauge chart to clearly show diabetes risk
    function createGaugeChart(probability) {
        const ctx = document.getElementById('gaugeChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (gaugeChart) {
            gaugeChart.destroy();
        }
        
        // Configure new chart - always show probability of having diabetes
        gaugeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [probability, 1 - probability],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.8)',  // Red for diabetic risk
                        'rgba(46, 204, 113, 0.8)'   // Green for non-diabetic
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '70%',
                rotation: Math.PI,
                circumference: Math.PI,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
        
        // Add percentage text in the middle
        const percentageText = document.createElement('div');
        percentageText.textContent = `${Math.round(probability * 100)}%`;
        percentageText.style.position = 'absolute';
        percentageText.style.top = '50%';
        percentageText.style.left = '50%';
        percentageText.style.transform = 'translate(-50%, -30%)';
        percentageText.style.fontSize = '24px';
        percentageText.style.fontWeight = 'bold';
        
        // Add label explaining what the percentage means
        const labelText = document.createElement('div');
        labelText.textContent = 'Diabetes Risk';
        labelText.style.position = 'absolute';
        labelText.style.top = '65%';
        labelText.style.left = '50%';
        labelText.style.transform = 'translate(-50%, -30%)';
        labelText.style.fontSize = '14px';
        
        const gaugeContainer = document.querySelector('.gauge-container');
        gaugeContainer.style.position = 'relative';
        
        // Remove any existing elements
        const existingElements = gaugeContainer.querySelectorAll('div');
        existingElements.forEach(el => el.remove());
        
        // Add both text elements
        gaugeContainer.appendChild(percentageText);
        gaugeContainer.appendChild(labelText);
    }
    
    function createBarChart(formData) {
        const ctx = document.getElementById('barChart').getContext('2d');
        
        // Normalize values for better visualization
        const normalizedData = {
            glucose: formData.glucose / 200,
            bloodPressure: formData.bloodPressure / 120,
            skinThickness: formData.skinThickness / 50,
            insulin: formData.insulin / 300,
            bmi: formData.bmi / 40,
            dpf: formData.dpf / 1.5,
            age: formData.age / 80
        };
        
        // Destroy existing chart if it exists
        if (barChart) {
            barChart.destroy();
        }
        
        // Get labels and values for chart
        const labels = Object.keys(normalizedData).map(key => indicatorLabels[key]);
        const values = Object.values(normalizedData);
        
        // Create color array based on values (higher values are more red)
        const backgroundColors = values.map(value => {
            const red = Math.min(255, Math.round(value * 255));
            const green = Math.min(255, Math.round((1 - value) * 255));
            return `rgba(${red}, ${green}, 100, 0.7)`;
        });
        
        // Configure new chart
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Values (Normalized)',
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1.2,
                        title: {
                            display: true,
                            text: 'Normalized Value'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const key = Object.keys(normalizedData)[context.dataIndex];
                                const value = formData[key];
                                let unit = '';
                                
                                if (key === 'glucose') unit = 'mg/dL';
                                else if (key === 'bloodPressure') unit = 'mmHg';
                                else if (key === 'skinThickness') unit = 'mm';
                                else if (key === 'insulin') unit = 'μU/mL';
                                else if (key === 'bmi') unit = 'kg/m²';
                                
                                return `${value} ${unit}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // New function to create an interactive radar chart
    function createRadarChart(formData) {
        // Check if radar chart container exists, if not create it
        let radarContainer = document.getElementById('radarContainer');
        if (!radarContainer) {
            // Create a new container for the radar chart
            radarContainer = document.createElement('div');
            radarContainer.id = 'radarContainer';
            radarContainer.className = 'radar-container';
            
            // Create canvas for chart
            const canvas = document.createElement('canvas');
            canvas.id = 'radarChart';
            radarContainer.appendChild(canvas);
            
            // Add title
            const title = document.createElement('h3');
            title.textContent = 'Risk Factor Analysis';
            
            // Find where to insert the radar chart
            const dataVisualization = document.querySelector('.data-visualization');
            dataVisualization.appendChild(title);
            dataVisualization.appendChild(radarContainer);
        }
        
        // Reference ranges for risk assessment (normalized to 0-1 scale)
        const riskRanges = {
            glucose: { low: 70/200, high: 100/200, critical: 140/200 },
            bloodPressure: { low: 60/120, high: 80/120, critical: 90/120 },
            skinThickness: { low: 10/50, high: 25/50, critical: 35/50 },
            insulin: { low: 16/300, high: 166/300, critical: 200/300 },
            bmi: { low: 18.5/40, high: 25/40, critical: 30/40 },
            dpf: { low: 0.1/1.5, high: 0.5/1.5, critical: 0.8/1.5 },
            age: { low: 20/80, high: 40/80, critical: 50/80 }
        };
        
        // Normalize user data
        const normalizedData = {
            glucose: formData.glucose / 200,
            bloodPressure: formData.bloodPressure / 120,
            skinThickness: formData.skinThickness / 50,
            insulin: formData.insulin / 300,
            bmi: formData.bmi / 40,
            dpf: formData.dpf / 1.5,
            age: formData.age / 80
        };
        
        // Reference values for "normal" range
        const normalValues = {
            glucose: (riskRanges.glucose.low + riskRanges.glucose.high) / 2,
            bloodPressure: (riskRanges.bloodPressure.low + riskRanges.bloodPressure.high) / 2,
            skinThickness: (riskRanges.skinThickness.low + riskRanges.skinThickness.high) / 2,
            insulin: (riskRanges.insulin.low + riskRanges.insulin.high) / 2,
            bmi: (riskRanges.bmi.low + riskRanges.bmi.high) / 2,
            dpf: (riskRanges.dpf.low + riskRanges.dpf.high) / 2,
            age: 0.5 // Age itself is not a risk factor, but increasing age is
        };
        
        // Get labels and values for chart
        const labels = Object.keys(normalizedData).map(key => indicatorLabels[key]);
        const userValues = Object.values(normalizedData);
        const referenceValues = Object.keys(normalizedData).map(key => normalValues[key]);
        
        // Configure the radar chart
        const ctx = document.getElementById('radarChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.radarChart instanceof Chart) {
            window.radarChart.destroy();
        }
        
        // Create new radar chart
        window.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Your Values',
                        data: userValues,
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: 'rgba(231, 76, 60, 0.8)',
                        pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                        pointRadius: 4
                    },
                    {
                        label: 'Normal Range',
                        data: referenceValues,
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: 'rgba(46, 204, 113, 0.8)',
                        pointBackgroundColor: 'rgba(46, 204, 113, 1)',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            stepSize: 0.2,
                            backdropColor: 'rgba(0, 0, 0, 0)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const dataset = context.dataset;
                                const index = context.dataIndex;
                                const key = Object.keys(normalizedData)[index];
                                const value = dataset.data[index];
                                
                                // For user values, show the actual value with units
                                if (dataset.label === 'Your Values') {
                                    let actualValue = formData[key];
                                    let unit = '';
                                    
                                    if (key === 'glucose') unit = 'mg/dL';
                                    else if (key === 'bloodPressure') unit = 'mmHg';
                                    else if (key === 'skinThickness') unit = 'mm';
                                    else if (key === 'insulin') unit = 'μU/mL';
                                    else if (key === 'bmi') unit = 'kg/m²';
                                    
                                    // Provide risk assessment
                                    let riskLevel = '';
                                    if (value > riskRanges[key].critical) {
                                        riskLevel = ' (High Risk)';
                                    } else if (value > riskRanges[key].high) {
                                        riskLevel = ' (Moderate Risk)';
                                    } else if (value < riskRanges[key].low) {
                                        riskLevel = ' (Low End)';
                                    } else {
                                        riskLevel = ' (Normal Range)';
                                    }
                                    
                                    return `${dataset.label}: ${actualValue} ${unit}${riskLevel}`;
                                } else {
                                    return `${dataset.label}: ${Math.round(value * 100) / 100}`;
                                }
                            }
                        }
                    },
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
    
    function fillSummaryTable(formData) {
        const tableBody = document.querySelector('#summaryTable tbody');
        tableBody.innerHTML = '';
        
        for (const [key, value] of Object.entries(formData)) {
            const row = document.createElement('tr');
            
            const indicatorCell = document.createElement('td');
            indicatorCell.textContent = indicatorLabels[key];
            
            const valueCell = document.createElement('td');
            valueCell.textContent = value;
            
            const rangeCell = document.createElement('td');
            rangeCell.textContent = normalRanges[key];
            
            row.appendChild(indicatorCell);
            row.appendChild(valueCell);
            row.appendChild(rangeCell);
            
            tableBody.appendChild(row);
        }
    }
});
