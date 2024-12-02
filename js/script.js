document.addEventListener("DOMContentLoaded", function () {
  // Arrays to track calories and muscle group intensity
  let muscleGroupCalories = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0
  };

  let muscleGroupIntensity = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0
  };

  let weeklyCaloriesBurned = [0, 0, 0, 0, 0, 0, 0];  // Dummy weekly data for total calories burned per day (Sun to Sat)

  const exercises = {
    chest: ['Bench Press', 'Incline Bench Press', 'Push-ups'],
    back: ['Pull-ups', 'Deadlift', 'Lat Pulldown'],
    legs: ['Squats', 'Lunges', 'Leg Press'],
    shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises'],
    arms: ['Bicep Curls', 'Tricep Dips', 'Hammer Curls']
  };

  // Base calorie burn rate per rep
  const calorieBurnRates = {
    chest: 0.1, // 0.1 cal per rep
    back: 0.1,
    legs: 0.12,
    shoulders: 0.1,
    arms: 0.1
  };

  // Update exercises dropdown based on selected muscle group
  document.getElementById('muscle-group').addEventListener('change', function () {
    const muscleGroup = this.value;
    const exerciseSelect = document.getElementById('exercise');
    exerciseSelect.innerHTML = '<option value="">Choose Exercise</option>';  // Clear previous exercises
    if (muscleGroup) {
      exercises[muscleGroup].forEach(function (exercise) {
        const option = document.createElement('option');
        option.value = exercise;
        option.textContent = exercise;
        exerciseSelect.appendChild(option);
      });
    }
  });

  // Generate input fields for sets
  document.getElementById('sets').addEventListener('input', function () {
    const numSets = parseInt(this.value);
    const setsInputsDiv = document.getElementById('sets-inputs');
    setsInputsDiv.innerHTML = '';  // Clear previous inputs

    for (let i = 0; i < numSets; i++) {
      const setInputDiv = document.createElement('div');
      setInputDiv.classList.add('set-input');
      setInputDiv.innerHTML = `
        <input type="number" id="set-${i + 1}-weight" placeholder="Weight (kg)" required>
        <input type="number" id="set-${i + 1}-reps" placeholder="Reps" required>
      `;
      setsInputsDiv.appendChild(setInputDiv);
    }
  });

  // Handle form submission
  document.getElementById('workout-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const muscleGroup = document.getElementById('muscle-group').value;
    const exercise = document.getElementById('exercise').value;
    const numSets = parseInt(document.getElementById('sets').value);
    const setsData = [];
    let totalCalories = 0;

    for (let i = 0; i < numSets; i++) {
      const setWeight = parseInt(document.getElementById(`set-${i + 1}-weight`).value);
      const setReps = parseInt(document.getElementById(`set-${i + 1}-reps`).value);
      const caloriesPerSet = setWeight * setReps * calorieBurnRates[muscleGroup];
      totalCalories += caloriesPerSet;

      setsData.push({ weight: setWeight, reps: setReps, calories: caloriesPerSet });
    }

    // Log the workout
    const workoutLog = document.getElementById('exercise-tables');
    let exerciseTable = document.getElementById(`table-${exercise}`);
    if (!exerciseTable) {
      exerciseTable = document.createElement('table');
      exerciseTable.classList.add('table', 'table-striped');
      exerciseTable.id = `table-${exercise}`;
      exerciseTable.innerHTML = `
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Calories Burned</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      workoutLog.appendChild(exerciseTable);
    }

    // Add logged data to the table
    const listItem = document.createElement('tr');
    listItem.innerHTML = `
      <td><strong>${exercise}</strong></td>
      <td>${setsData.map(set => `${set.weight}kg x ${set.reps} reps`).join('<br>')}</td>
      <td>${totalCalories.toFixed(2)} kcal</td>
    `;
    exerciseTable.querySelector('tbody').appendChild(listItem);

    // Update charts
    muscleGroupCalories[muscleGroup] += totalCalories;
    muscleGroupIntensity[muscleGroup] += 2;
    weeklyCaloriesBurned[Math.floor(Math.random() * 7)] += totalCalories;
    updateCharts();
  });

  // Create charts
  let barChart, radarChart, weeklyChart;

  function updateCharts() {
    if (barChart) barChart.destroy();
    if (radarChart) radarChart.destroy();
    if (weeklyChart) weeklyChart.destroy();

    barChart = new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
        datasets: [{
          label: 'Calories Burned',
          data: Object.values(muscleGroupCalories),
          backgroundColor: 'rgba(26, 188, 156, 0.6)',
          borderColor: 'rgba(26, 188, 156, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    radarChart = new Chart(document.getElementById('radarChart'), {
      type: 'radar',
      data: {
        labels: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
        datasets: [{
          label: 'Muscle Group Activity',
          data: Object.values(muscleGroupIntensity),
          backgroundColor: 'rgba(26, 188, 156, 0.3)',
          borderColor: 'rgba(26, 188, 156, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });

    weeklyChart = new Chart(document.getElementById('weeklyChart'), {
      type: 'line',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Total Calories Burned per Day',
          data: weeklyCaloriesBurned,
          fill: false,
          borderColor: 'rgba(46, 204, 113, 1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  updateCharts(); // Initial chart render
});
