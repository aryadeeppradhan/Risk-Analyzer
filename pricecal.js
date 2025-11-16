function calculateBMI() {
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m
            
            if (weight && height) {
                const bmi = (weight / (height * height)).toFixed(1);
                document.getElementById('bmiDisplay').textContent = bmi;
                return parseFloat(bmi);
            }
            return 0;
        }

        document.getElementById('weight').addEventListener('input', calculateBMI);
        document.getElementById('height').addEventListener('input', calculateBMI);

        // Generate suggestions based on inputs
        function generateSuggestions(data, cost) {
            const suggestions = [];
            
            if (data.smoker === 1) {
                suggestions.push("Quitting smoking could significantly reduce your premium by 40-50%. Consider smoking cessation programs.");
            }
            
            if (data.bmi > 30) {
                suggestions.push("Your BMI indicates obesity. Losing weight could lower your premium and improve overall health.");
            } else if (data.bmi > 25) {
                suggestions.push("Maintaining a healthy weight through diet and exercise may help reduce future premium increases.");
            }
            
            if (data.age > 50) {
                suggestions.push("Regular health check-ups become more important with age. Preventive care can help manage costs.");
            }
            
            if (cost > 15000) {
                suggestions.push("Consider high-deductible health plans with HSA accounts to save on premiums.");
            }
            
            suggestions.push("Compare multiple insurance providers to find the best coverage at competitive rates.");
            suggestions.push("Look for employer-sponsored plans which often offer better rates than individual plans.");
            
            if (data.children > 0) {
                suggestions.push("Family health plans might be more cost-effective than individual policies for each member.");
            }
            
            return suggestions;
        }

        document.getElementById('predictionForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = document.getElementById('predictBtn');
            btn.disabled = true;
            btn.textContent = 'Calculating...';
            
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value === 'male' ? 1 : 0;
            const bmi = calculateBMI();
            const smoker = document.getElementById('smoker').value === 'yes' ? 1 : 0;
            const children = parseInt(document.getElementById('children').value);
            const regionValue = document.getElementById('region').value;
            
            const regionDict = {
                'southwest': 0,
                'northwest': 1,
                'northeast': 2,
                'southeast': 3
            };
            const region = regionDict[regionValue];
            
            const inputData = {
                age: age,
                sex_male: gender,
                bmi: bmi,
                smoker: smoker,
                children: children,
                region: region
            };
            
            try {
                const response = await fetch('http://localhost:5000/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputData)
                });
                
                const data = await response.json();
                const prediction = data.prediction;
                
                document.getElementById('predictedAmount').textContent = '$' + prediction.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                
                // Generate and display suggestions
                const suggestions = generateSuggestions(inputData, prediction);
                const suggestionsList = document.getElementById('suggestionsList');
                suggestionsList.innerHTML = '';
                suggestions.forEach(suggestion => {
                    const li = document.createElement('li');
                    li.textContent = suggestion;
                    suggestionsList.appendChild(li);
                });
                
                const resultDiv = document.getElementById('result');
                resultDiv.style.display = 'block';
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
            } catch (error) {
                alert('Error making prediction. Please ensure the backend server is running.');
                console.error('Error:', error);
            }
            
            btn.disabled = false;
            btn.textContent = 'Calculate Insurance Cost';
        });

        // Calculate BMI on page load
        calculateBMI();