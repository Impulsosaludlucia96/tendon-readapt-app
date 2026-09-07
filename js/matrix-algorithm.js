// Motor de decisión clínica - Matriz 3x3 y Reglas de Carga

function processAssessment(data) {
    let state = 'VERDE';
    let reasons = [];

    // 1. Criterio Primario: EVA y Síntomas
    if (data.eva > 3 || !data.canWalkWithoutPain) {
        state = 'ROJO';
        reasons.push('EVA superior a 3/10 o molestia en AVD (caminar).');
    } else if (data.stiffness24h === 'peor' || data.eva === 3) {
        state = 'NARANJA';
        reasons.push('Aumento de rigidez/dolor a las 24h o EVA en límite (3/10).');
    }

    // 2. Regla de Carga Acumulada (2 días en Naranja/Rojo)
    if (data.consecutiveHighLoadDays >= 2 && state !== 'ROJO') {
        state = 'NARANJA';
        reasons.push('Acumulación de 2 días consecutivos en alta carga (Naranja/Rojo).');
    }

    // 3. Modificador Sistémico (IRS < 14 puntos de 28)
    if (data.irsTotal < 14 && state === 'VERDE') {
        state = 'NARANJA';
        reasons.push('Puntuación IRS baja (elevada fatiga sistémica o estrés).');
    }

    return {
        dailyState: state,
        rules: getLoadRules(state),
        reasons: reasons
    };
}

function getLoadRules(state) {
    switch(state) {
        case 'VERDE':
            return { AZUL: 'PERMITIDO', NARANJA: 'PERMITIDO', ROJO: 'PERMITIDO' };
        case 'NARANJA':
            return { AZUL: 'PERMITIDO', NARANJA: 'MODIFICADO', ROJO: 'BLOQUEADO' };
        case 'ROJO':
            return { AZUL: 'PERMITIDO', NARANJA: 'BLOQUEADO', ROJO: 'BLOQUEADO' };
    }
}
