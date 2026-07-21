document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. NAVEGACIÓN ENTRE SECCIONES (TABS)
       ========================================================================== */
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.presenter-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Quitar clase activa a pestañas y secciones
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Activar la pestaña clickeada
            tab.classList.add('active');

            // Mostrar la sección correspondiente
            const targetId = tab.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       2. REGLAS DE SEGURIDAD PARA RENDERIZAR ECUACIONES SIN XSS
       ========================================================================== */
    // Helper para actualizar un elemento con una ecuación estructurada de forma segura
    function setMathContent(element, parts) {
        element.replaceChildren(); // Limpieza segura
        parts.forEach(part => {
            if (typeof part === 'string') {
                element.appendChild(document.createTextNode(part));
            } else if (part.tag === 'sub') {
                const sub = document.createElement('sub');
                sub.textContent = part.text;
                element.appendChild(sub);
            } else if (part.tag === 'sup') {
                const sup = document.createElement('sup');
                sup.textContent = part.text;
                element.appendChild(sup);
            } else if (part.tag === 'i') {
                const i = document.createElement('i');
                i.textContent = part.text;
                element.appendChild(i);
            }
        });
    }

    function appendMathParagraph(container, parts) {
        const p = document.createElement('p');
        parts.forEach(part => {
            if (typeof part === 'string') {
                p.appendChild(document.createTextNode(part));
            } else if (part.tag === 'sub') {
                const sub = document.createElement('sub');
                sub.textContent = part.text;
                p.appendChild(sub);
            } else if (part.tag === 'sup') {
                const sup = document.createElement('sup');
                sup.textContent = part.text;
                p.appendChild(sup);
            } else if (part.tag === 'i') {
                const i = document.createElement('i');
                i.textContent = part.text;
                p.appendChild(i);
            }
        });
        container.appendChild(p);
    }

    /* ==========================================================================
       3. RESOLVEDOR DE TEORÍA DE JUEGOS EN TIEMPO REAL
       ========================================================================== */
    const inputs = {
        m11: document.getElementById('m-11'),
        m12: document.getElementById('m-12'),
        m21: document.getElementById('m-21'),
        m22: document.getElementById('m-22')
    };

    const resetBtn = document.getElementById('reset-matrix-btn');
    
    // Escuchar cambios en todos los inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculateGame);
    });

    resetBtn.addEventListener('click', () => {
        inputs.m11.value = 1;
        inputs.m12.value = 6;
        inputs.m21.value = 15;
        inputs.m22.value = 0;
        calculateGame();
    });

    function calculateGame() {
        // 1. Obtener valores y validarlos (seguridad ante inyecciones de texto)
        const a11 = parseFloat(inputs.m11.value);
        const a12 = parseFloat(inputs.m12.value);
        const a21 = parseFloat(inputs.m21.value);
        const a22 = parseFloat(inputs.m22.value);

        if (isNaN(a11) || isNaN(a12) || isNaN(a21) || isNaN(a22)) {
            showError("Ingresa valores numéricos válidos en la matriz.");
            return;
        }

        // 2. Calcular Maximin y Minimax
        const minRow1 = Math.min(a11, a12);
        const minRow2 = Math.min(a21, a22);
        const maximin = Math.max(minRow1, minRow2);

        const maxCol1 = Math.max(a11, a21);
        const maxCol2 = Math.max(a12, a22);
        const minimax = Math.min(maxCol1, maxCol2);

        // Referencias del DOM para los resultados
        const valP = document.getElementById('val-p');
        const valQ = document.getElementById('val-q');
        const valMaximin = document.getElementById('val-maximin');
        const valMinimax = document.getElementById('val-minimax');
        const valV = document.getElementById('val-v');
        const eqBolivar = document.getElementById('eq-bolivar');
        const eqStrongest = document.getElementById('eq-strongest');
        const solverExplanation = document.getElementById('solver-explanation');

        // Actualizar valores de Maximin y Minimax en pantalla
        if (valMaximin) valMaximin.textContent = maximin.toFixed(2);
        if (valMinimax) valMinimax.textContent = minimax.toFixed(2);

        // Limpiar explicaciones anteriores
        solverExplanation.replaceChildren();

        // Caso 1: Punto de Silla (Estrategia Pura)
        if (maximin === minimax) {
            const v = maximin;
            let p_opt = 0;
            let q_opt = 0;
            let rowText = "";
            let colText = "";

            if (v === minRow1) {
                p_opt = 1;
                rowText = "Ataque Bandas (a1)";
            } else {
                p_opt = 0;
                rowText = "Ataque Centro (a2)";
            }

            if (v === maxCol1) {
                q_opt = 1;
                colText = "Defensa Bandas (b1)";
            } else {
                q_opt = 0;
                colText = "Defensa Centro (b2)";
            }

            valP.textContent = `${(p_opt * 100).toFixed(1)}%`;
            valQ.textContent = `${(q_opt * 100).toFixed(1)}%`;
            valV.textContent = v.toFixed(2);

            setMathContent(eqBolivar, ["Punto de Silla Puro Encontrado"]);
            setMathContent(eqStrongest, ["Valor del Juego ", {tag: "i", text: "V"}, ` = ${v}`]);

            appendMathParagraph(solverExplanation, [
                "¡Equilibrio de Estrategia Pura! Ambos jugadores prefieren usar una sola acción estable."
            ]);
            appendMathParagraph(solverExplanation, [
                "Bolívar jugará siempre por las ", rowText, " (", {tag: "i", text: "p"}, {tag: "sup", text: "*"}, ` = ${p_opt}) y Strongest defenderá siempre las `, colText, " (", {tag: "i", text: "q"}, {tag: "sup", text: "*"}, ` = ${q_opt}).`
            ]);

            drawGraph(a11, a12, a21, a22, p_opt, v, true);
        } 
        // Caso 2: Estrategia Mixta
        else {
            const denom = (a11 - a12 - a21 + a22);
            
            if (denom === 0) {
                showError("La estructura de pagos no permite resolver por estrategias mixtas clásicas (rectas paralelas).");
                return;
            }

            const p_opt = (a22 - a21) / denom;
            const q_opt = (a22 - a12) / denom;

            if (p_opt < 0 || p_opt > 1 || q_opt < 0 || q_opt > 1) {
                let p_bound = p_opt < 0 ? 0 : 1;
                let q_bound = q_opt < 0 ? 0 : 1;
                
                const v_bound = p_bound * (q_bound * a11 + (1 - q_bound) * a12) + (1 - p_bound) * (q_bound * a21 + (1 - q_bound) * a22);

                valP.textContent = `${(p_bound * 100).toFixed(1)}%`;
                valQ.textContent = `${(q_bound * 100).toFixed(1)}%`;
                valV.textContent = v_bound.toFixed(2);

                setMathContent(eqBolivar, ["Solución de Frontera"]);
                setMathContent(eqStrongest, [{tag: "i", text: "V"}, ` = ${v_bound.toFixed(2)}`]);

                appendMathParagraph(solverExplanation, [
                    "Las pendientes no se cruzan dentro de [0, 1]. Se selecciona una estrategia pura de frontera."
                ]);

                drawGraph(a11, a12, a21, a22, p_bound, v_bound, true);
                return;
            }

            const v = a11 * p_opt + a21 * (1 - p_opt);

            // Mostrar resultados principales
            valP.textContent = `${(p_opt * 100).toFixed(1)}%`;
            valQ.textContent = `${(q_opt * 100).toFixed(1)}%`;
            valV.textContent = v.toFixed(2);

            // Mostrar ecuaciones dinámicas formateadas
            setMathContent(eqBolivar, [
                `${a11}`, {tag: "i", text: "p"}, ` + ${a21}(1 - `, {tag: "i", text: "p"}, `) = ${a12}`, {tag: "i", text: "p"}, ` + ${a22}(1 - `, {tag: "i", text: "p"}, ")"
            ]);
            setMathContent(eqStrongest, [
                `${a11}`, {tag: "i", text: "q"}, ` + ${a12}(1 - `, {tag: "i", text: "q"}, `) = ${a21}`, {tag: "i", text: "q"}, ` + ${a22}(1 - `, {tag: "i", text: "q"}, ")"
            ]);

            // Explicación paso a paso
            appendMathParagraph(solverExplanation, [
                "1. Bolívar busca un ", {tag: "i", text: "p"}, " tal que a Strongest le dé igual defender bandas (", {tag: "i", text: "b"}, {tag: "sub", text: "1"}, ") o centro (", {tag: "i", text: "b"}, {tag: "sub", text: "2"}, ")."
            ]);
            
            appendMathParagraph(solverExplanation, [
                "Igualando: ", `${a11}`, {tag: "i", text: "p"}, ` + ${a21}(1 - `, {tag: "i", text: "p"}, `) = ${a12}`, {tag: "i", text: "p"}, ` + ${a22}(1 - `, {tag: "i", text: "p"}, ")"
            ]);

            appendMathParagraph(solverExplanation, [
                "Resolviendo: ", `${a11 - a21}`, {tag: "i", text: "p"}, ` + ${a21} = ${a12 - a22}`, {tag: "i", text: "p"}, ` + ${a22} ➔ `, {tag: "i", text: "p"}, {tag: "sup", text: "*"}, ` = ${p_opt.toFixed(3)} (${(p_opt * 100).toFixed(1)}%).`
            ]);

            appendMathParagraph(solverExplanation, [
                "2. Strongest busca un ", {tag: "i", text: "q"}, " tal que a Bolívar le dé igual atacar bandas (", {tag: "i", text: "a"}, {tag: "sub", text: "1"}, ") o centro (", {tag: "i", text: "a"}, {tag: "sub", text: "2"}, ")."
            ]);

            appendMathParagraph(solverExplanation, [
                "Igualando: ", `${a11}`, {tag: "i", text: "q"}, ` + ${a12}(1 - `, {tag: "i", text: "q"}, `) = ${a21}`, {tag: "i", text: "q"}, ` + ${a22}(1 - `, {tag: "i", text: "q"}, `) ➔ `, {tag: "i", text: "q"}, {tag: "sup", text: "*"}, ` = ${q_opt.toFixed(3)} (${(q_opt * 100).toFixed(1)}%).`
            ]);

            appendMathParagraph(solverExplanation, [
                "3. Avance promedio esperado (Valor de juego): ",
                {tag: "i", text: "V"},
                " = ",
                `${a11} × (`,
                {tag: "i", text: "p"},
                {tag: "sup", text: "*"},
                `) + ${a21} × (1 - `,
                {tag: "i", text: "p"},
                {tag: "sup", text: "*"},
                ")"
            ]);

            appendMathParagraph(solverExplanation, [
                "Sustituyendo: ",
                {tag: "i", text: "V"},
                ` = ${a11} × (${p_opt.toFixed(2)}) + ${a21} × (${(1 - p_opt).toFixed(2)}) = ${(a11 * p_opt).toFixed(2)} + ${(a21 * (1 - p_opt)).toFixed(2)} = ${v.toFixed(2)} yardas.`
            ]);

            drawGraph(a11, a12, a21, a22, p_opt, v, false);
        }
    }

    function showError(message) {
        const solverExplanation = document.getElementById('solver-explanation');
        solverExplanation.replaceChildren();
        const p = document.createElement('p');
        p.textContent = message;
        p.style.color = '#D12828';
        p.style.fontWeight = 'bold';
        solverExplanation.appendChild(p);
    }

    /* ==========================================================================
       4. DIBUJO DE GRÁFICO SVG ESTILO "HECHO A MANO" (WOBBLY PATHS)
       ========================================================================== */
    function drawGraph(a11, a12, a21, a22, p_opt, v, isPure) {
        const svg = document.getElementById('intersection-graph');
        svg.replaceChildren(); // Limpieza segura

        const width = 400;
        const height = 240;
        const padding = { top: 30, right: 40, bottom: 40, left: 40 };

        // Encontrar mínimos y máximos globales de la matriz para escalar el eje Y
        const allVals = [a11, a12, a21, a22, 0, 5, 10, 15]; // Rango mínimo sugerido
        const minVal = Math.min(...allVals) - 1;
        const maxVal = Math.max(...allVals) + 1;

        // Funciones de mapeo de coordenadas
        function getX(p) {
            return padding.left + p * (width - padding.left - padding.right);
        }

        function getY(val) {
            const range = maxVal - minVal;
            const pct = (val - minVal) / range;
            // Eje Y invertido en SVG
            return height - padding.bottom - pct * (height - padding.top - padding.bottom);
        }

        // Función para trazar una línea con ligeras ondulaciones (estilo a mano alzada)
        function createWobblyPath(x1, y1, x2, y2) {
            const segments = 10;
            let path = `M ${x1} ${y1}`;
            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const cx = x1 + (x2 - x1) * t;
                const cy = y1 + (y2 - y1) * t;
                
                // Añadir pequeña perturbación aleatoria
                const offset = (Math.random() - 0.5) * 1.8;
                path += ` L ${cx + offset} ${cy + offset}`;
            }
            return path;
        }

        const namespace = "http://www.w3.org/2000/svg";

        // Ejes X e Y dibujados a mano
        const axisX = document.createElementNS(namespace, "path");
        axisX.setAttribute("d", createWobblyPath(padding.left - 10, getY(0), width - padding.right + 10, getY(0)));
        axisX.setAttribute("stroke", "#333333");
        axisX.setAttribute("stroke-width", "2");
        axisX.setAttribute("fill", "none");
        svg.appendChild(axisX);

        const axisY0 = document.createElementNS(namespace, "path");
        axisY0.setAttribute("d", createWobblyPath(getX(0), height - padding.bottom + 10, getX(0), padding.top - 10));
        axisY0.setAttribute("stroke", "#333333");
        axisY0.setAttribute("stroke-width", "2");
        axisY0.setAttribute("fill", "none");
        svg.appendChild(axisY0);

        const axisY1 = document.createElementNS(namespace, "path");
        axisY1.setAttribute("d", createWobblyPath(getX(1), height - padding.bottom + 10, getX(1), padding.top - 10));
        axisY1.setAttribute("stroke", "#333333");
        axisY1.setAttribute("stroke-width", "1.5");
        axisY1.setAttribute("stroke-dasharray", "3 3");
        axisY1.setAttribute("fill", "none");
        svg.appendChild(axisY1);

        // Línea 1: Pago contra b1 (Defensa Bandas) -> va de (p=0: a21) a (p=1: a11)
        const line1 = document.createElementNS(namespace, "path");
        line1.setAttribute("d", createWobblyPath(getX(0), getY(a21), getX(1), getY(a11)));
        line1.setAttribute("stroke", "#0000FF");
        line1.setAttribute("stroke-width", "3");
        line1.setAttribute("fill", "none");
        svg.appendChild(line1);

        // Línea 2: Pago contra b2 (Defensa Centro) -> va de (p=0: a22) a (p=1: a12)
        const line2 = document.createElementNS(namespace, "path");
        line2.setAttribute("d", createWobblyPath(getX(0), getY(a22), getX(1), getY(a12)));
        line2.setAttribute("stroke", "#D12828");
        line2.setAttribute("stroke-width", "3");
        line2.setAttribute("fill", "none");
        svg.appendChild(line2);

        // Marcación del punto de intersección óptimo
        if (!isNaN(p_opt) && !isNaN(v)) {
            // Líneas proyectadas
            const projX = document.createElementNS(namespace, "path");
            projX.setAttribute("d", `M ${getX(p_opt)} ${getY(0)} L ${getX(p_opt)} ${getY(v)}`);
            projX.setAttribute("stroke", "#333333");
            projX.setAttribute("stroke-width", "1");
            projX.setAttribute("stroke-dasharray", "4 4");
            projX.setAttribute("fill", "none");
            svg.appendChild(projX);

            const projY = document.createElementNS(namespace, "path");
            projY.setAttribute("d", `M ${getX(0)} ${getY(v)} L ${getX(p_opt)} ${getY(v)}`);
            projY.setAttribute("stroke", "#333333");
            projY.setAttribute("stroke-width", "1");
            projY.setAttribute("stroke-dasharray", "4 4");
            projY.setAttribute("fill", "none");
            svg.appendChild(projY);

            // Círculo de intersección
            const eqCircle = document.createElementNS(namespace, "circle");
            eqCircle.setAttribute("cx", getX(p_opt).toString());
            eqCircle.setAttribute("cy", getY(v).toString());
            eqCircle.setAttribute("r", "6");
            eqCircle.setAttribute("fill", "#FFFFA5");
            eqCircle.setAttribute("stroke", "#D12828");
            eqCircle.setAttribute("stroke-width", "2.5");
            svg.appendChild(eqCircle);

            // Texto de etiquetas en el gráfico
            // Crear el tspan para el superíndice de p*
            const txtP = document.createElementNS(namespace, "text");
            txtP.setAttribute("x", getX(p_opt).toString());
            txtP.setAttribute("y", (height - padding.bottom + 18).toString());
            txtP.setAttribute("text-anchor", "middle");
            txtP.setAttribute("class", "svg-text font-accent");
            
            const tspanPBase = document.createElementNS(namespace, "tspan");
            tspanPBase.textContent = "p";
            const tspanPStar = document.createElementNS(namespace, "tspan");
            tspanPStar.setAttribute("dy", "-4");
            tspanPStar.setAttribute("font-size", "10");
            tspanPStar.textContent = "*";
            const tspanPEnd = document.createElementNS(namespace, "tspan");
            tspanPEnd.setAttribute("dy", "4");
            tspanPEnd.setAttribute("font-size", "14");
            tspanPEnd.textContent = ` = ${p_opt.toFixed(2)}`;

            txtP.appendChild(tspanPBase);
            txtP.appendChild(tspanPStar);
            txtP.appendChild(tspanPEnd);
            svg.appendChild(txtP);

            const txtV = document.createElementNS(namespace, "text");
            txtV.setAttribute("x", (padding.left - 8).toString());
            txtV.setAttribute("y", (getY(v) + 4).toString());
            txtV.setAttribute("text-anchor", "end");
            txtV.setAttribute("class", "svg-text font-accent");
            txtV.textContent = `V = ${v.toFixed(1)}`;
            svg.appendChild(txtV);
        }

        // Etiquetas de los ejes
        const labelP0 = document.createElementNS(namespace, "text");
        labelP0.setAttribute("x", getX(0).toString());
        labelP0.setAttribute("y", (height - padding.bottom + 18).toString());
        labelP0.setAttribute("text-anchor", "middle");
        labelP0.setAttribute("class", "svg-text");
        labelP0.textContent = "p = 0";
        svg.appendChild(labelP0);

        const labelP1 = document.createElementNS(namespace, "text");
        labelP1.setAttribute("x", getX(1).toString());
        labelP1.setAttribute("y", (height - padding.bottom + 18).toString());
        labelP1.setAttribute("text-anchor", "middle");
        labelP1.setAttribute("class", "svg-text");
        labelP1.textContent = "p = 1";
        svg.appendChild(labelP1);

        // Leyendas de las funciones
        // VE(b1)
        const legend1 = document.createElementNS(namespace, "text");
        legend1.setAttribute("x", (getX(0.15)).toString());
        legend1.setAttribute("y", (getY(a21 * 0.85 + a11 * 0.15) - 10).toString());
        legend1.setAttribute("class", "svg-text font-blue");
        
        const tspanL1Base = document.createElementNS(namespace, "tspan");
        tspanL1Base.textContent = "VE(b";
        const tspanL1Sub = document.createElementNS(namespace, "tspan");
        tspanL1Sub.setAttribute("dy", "3");
        tspanL1Sub.setAttribute("font-size", "10");
        tspanL1Sub.textContent = "1";
        const tspanL1End = document.createElementNS(namespace, "tspan");
        tspanL1End.setAttribute("dy", "-3");
        tspanL1End.setAttribute("font-size", "14");
        tspanL1End.textContent = ")";
        
        legend1.appendChild(tspanL1Base);
        legend1.appendChild(tspanL1Sub);
        legend1.appendChild(tspanL1End);
        svg.appendChild(legend1);

        // VE(b2)
        const legend2 = document.createElementNS(namespace, "text");
        legend2.setAttribute("x", (getX(0.8)).toString());
        legend2.setAttribute("y", (getY(a22 * 0.2 + a12 * 0.8) - 10).toString());
        legend2.setAttribute("class", "svg-text font-accent");
        
        const tspanL2Base = document.createElementNS(namespace, "tspan");
        tspanL2Base.textContent = "VE(b";
        const tspanL2Sub = document.createElementNS(namespace, "tspan");
        tspanL2Sub.setAttribute("dy", "3");
        tspanL2Sub.setAttribute("font-size", "10");
        tspanL2Sub.textContent = "2";
        const tspanL2End = document.createElementNS(namespace, "tspan");
        tspanL2End.setAttribute("dy", "-3");
        tspanL2End.setAttribute("font-size", "14");
        tspanL2End.textContent = ")";
        
        legend2.appendChild(tspanL2Base);
        legend2.appendChild(tspanL2Sub);
        legend2.appendChild(tspanL2End);
        svg.appendChild(legend2);
    }

    // Inicializar el resolvedor al cargar la página
    calculateGame();
});
