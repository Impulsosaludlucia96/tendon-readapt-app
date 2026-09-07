// Carga y renderizado dinámico de ejercicios desde el archivo JSON

async function loadAndDisplayExercises(dailyState) {
    try {
        // 1. Petición fetch al archivo JSON
        const response = await fetch('data/achilles-exercises.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const exerciseListDiv = document.getElementById('exerciseList');
        exerciseListDiv.innerHTML = '<h3>Ejercicios Recomendados para Hoy:</h3>';

        // 2. Filtrado dinámico según el estado del semáforo
        data.exercises.forEach(exercise => {
            let isAllowed = false;
            let badgeColor = '#95a5a6';

            if (dailyState === 'VERDE') {
                isAllowed = true;
                badgeColor = exercise.loadCategory === 'AZUL' ? '#27ae60' : (exercise.loadCategory === 'NARANJA' ? '#f39c12' : '#c0392b');
            } else if (dailyState === 'NARANJA') {
                if (exercise.loadCategory === 'AZUL') {
                    isAllowed = true;
                    badgeColor = '#27ae60';
                } else if (exercise.loadCategory === 'NARANJA') {
                    isAllowed = true; // Modificado
                    badgeColor = '#f39c12';
                }
            } else if (dailyState === 'ROJO') {
                if (exercise.loadCategory === 'AZUL') {
                    isAllowed = true;
                    badgeColor = '#27ae60';
                }
            }

            // 3. Renderizado de las tarjetas en la interfaz
            if (isAllowed) {
                const card = document.createElement('div');
                card.style.cssText = `
                    background: #fff;
                    border-left: 5px solid ${badgeColor};
                    padding: 10px 15px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: left;
                `;
                
                card.innerHTML = `
                    <strong style="color: #2c3e50;">${exercise.name}</strong><br>
                    <small style="color: #7f8c8d;">
                        Carga: <strong>${exercise.loadCategory}</strong> (${exercise.bwRatio}) | Fase: ${exercise.phase}
                    </small>
                `;
                exerciseListDiv.appendChild(card);
            }
        });

    } catch (error) {
        console.error('Error al realizar el fetch de ejercicios:', error);
    }
}
