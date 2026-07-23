document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. NAVEGACIÓN DE SECCIONES (TABS PRINCIPALES)
       ========================================================================== */
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.presenter-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            // Recalcular al cambiar de pestaña
            calculateAll();
        });
    });

    /* ==========================================================================
       2. NAVEGACIÓN INTERNA POR PASOS (SLIDESHOW INTERACTIVO)
       ========================================================================== */
    const sectionSteps = {
        1: { current: 1, max: 5, names: ["Decisiones con Rivales", "Suma Cero y Matriz de Pagos", "Criterios Maximin y Minimax", "Punto de Silla y Estabilidad", "Estrategias Mixtas y Simplificación"] },
        2: { current: 1, max: 4, names: ["Planteamiento", "Maximin y Minimax", "Estrategias Mixtas", "Gráfico y Conclusión"] },
        3: { current: 1, max: 4, names: ["Planteamiento", "Punto de Silla", "Cálculo de Probabilidades", "Conclusiones"] },
        4: { current: 1, max: 4, names: ["Planteamiento 3x3", "Dominancia de Filas", "Dominancia de Columnas", "Resultado Reducido"] },
        5: { current: 1, max: 4, names: ["Planteamiento", "Reducción por Dominancia", "Estrategias Mixtas", "Interpretación"] }
    };

    function updateStepUI(secNum) {
        const state = sectionSteps[secNum];
        const indicator = document.getElementById(`step-indicator-${secNum}`);
        if (indicator) {
            indicator.textContent = `Paso ${state.current} de ${state.max}: ${state.names[state.current - 1]}`;
        }

        const sectionEl = document.getElementById(`section-${secNum}`);
        if (sectionEl) {
            const contents = sectionEl.querySelectorAll('.step-content');
            contents.forEach(content => {
                const step = parseInt(content.getAttribute('data-step'), 10);
                if (step === state.current) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        }
    }

    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sec = parseInt(btn.getAttribute('data-section'), 10);
            if (sectionSteps[sec] && sectionSteps[sec].current > 1) {
                sectionSteps[sec].current--;
                updateStepUI(sec);
                calculateAll();
            }
        });
    });

    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sec = parseInt(btn.getAttribute('data-section'), 10);
            if (sectionSteps[sec] && sectionSteps[sec].current < sectionSteps[sec].max) {
                sectionSteps[sec].current++;
                updateStepUI(sec);
                calculateAll();
            }
        });
    });

    /* ==========================================================================
       3. SEGURIDAD Y RENDERIZADO DE MATEMÁTICAS SIN XSS
       ========================================================================== */
    function setMathContent(element, parts) {
        if (!element) return;
        element.replaceChildren();
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
            } else if (part.tag === 'strong') {
                const strong = document.createElement('strong');
                strong.textContent = part.text;
                element.appendChild(strong);
            } else if (part.tag === 'span') {
                const span = document.createElement('span');
                span.textContent = part.text;
                if (part.className) span.className = part.className;
                element.appendChild(span);
            } else if (part.tag === 'br') {
                element.appendChild(document.createElement('br'));
            }
        });
    }

    function createMathParagraph(parts) {
        const p = document.createElement('p');
        p.style.margin = "0.5rem 0";
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
            } else if (part.tag === 'strong') {
                const strong = document.createElement('strong');
                strong.textContent = part.text;
                p.appendChild(strong);
            } else if (part.tag === 'span') {
                const span = document.createElement('span');
                span.textContent = part.text;
                if (part.className) span.className = part.className;
                p.appendChild(span);
            } else if (part.tag === 'br') {
                p.appendChild(document.createElement('br'));
            }
        });
        return p;
    }

    /* Helper para crear tablas wobbly */
    function renderPayoffMatrix2x2(container, m11, m12, m21, m22, rowLabels, colLabels, highlightedCells = {}) {
        container.replaceChildren();
        const table = document.createElement('table');
        table.className = 'sketch-table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const emptyTh = document.createElement('th');
        emptyTh.textContent = `${rowLabels[0]} \\ ${colLabels[0]}`;
        headerRow.appendChild(emptyTh);

        for (let i = 1; i < colLabels.length; i++) {
            const th = document.createElement('th');
            th.textContent = colLabels[i];
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const vals = [[m11, m12], [m21, m22]];

        for (let r = 0; r < 2; r++) {
            const tr = document.createElement('tr');
            const thRow = document.createElement('td');
            const strong = document.createElement('strong');
            strong.textContent = rowLabels[r + 1];
            thRow.appendChild(strong);
            tr.appendChild(thRow);

            for (let c = 0; c < 2; c++) {
                const td = document.createElement('td');
                td.textContent = vals[r][c].toFixed(1);
                const key = `${r},${c}`;
                if (highlightedCells[key]) {
                    td.className = highlightedCells[key];
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        container.appendChild(table);
    }

    /* ==========================================================================
       4. CÁLCULO DE SOLUCIONES Y REDUCCIÓN DE JUEGOS
       ========================================================================== */

    function solve2x2(a11, a12, a21, a22) {
        const minRow1 = Math.min(a11, a12);
        const minRow2 = Math.min(a21, a22);
        const maximin = Math.max(minRow1, minRow2);

        const maxCol1 = Math.max(a11, a21);
        const maxCol2 = Math.max(a12, a22);
        const minimax = Math.min(maxCol1, maxCol2);

        const hasSaddlePoint = maximin === minimax;
        let p_opt, q_opt, v;

        if (hasSaddlePoint) {
            v = maximin;
            p_opt = (v === minRow1) ? 1 : 0;
            q_opt = (v === maxCol1) ? 1 : 0;
        } else {
            const denom = (a11 - a12 - a21 + a22);
            if (denom !== 0) {
                p_opt = (a22 - a21) / denom;
                q_opt = (a22 - a12) / denom;

                if (p_opt < 0 || p_opt > 1 || q_opt < 0 || q_opt > 1) {
                    p_opt = p_opt < 0 ? 0 : 1;
                    q_opt = q_opt < 0 ? 0 : 1;
                    v = p_opt * (q_opt * a11 + (1 - q_opt) * a12) + (1 - p_opt) * (q_opt * a21 + (1 - q_opt) * a22);
                } else {
                    v = a11 * p_opt + a21 * (1 - p_opt);
                }
            } else {
                p_opt = 0.5;
                q_opt = 0.5;
                v = (a11 + a12 + a21 + a22) / 4;
            }
        }

        return { maximin, minimax, hasSaddlePoint, p_opt, q_opt, v };
    }

    function drawGraph(svgId, a11, a12, a21, a22, p_opt, v) {
        const svg = document.getElementById(svgId);
        if (!svg) return;
        svg.replaceChildren();

        const width = 400;
        const height = 240;
        const padding = { top: 30, right: 40, bottom: 40, left: 40 };

        const allVals = [a11, a12, a21, a22, 0, 5, 10];
        const minVal = Math.min(...allVals) - 2;
        const maxVal = Math.max(...allVals) + 2;

        function getX(p) {
            return padding.left + p * (width - padding.left - padding.right);
        }

        function getY(val) {
            const range = maxVal - minVal;
            const pct = (val - minVal) / range;
            return height - padding.bottom - pct * (height - padding.top - padding.bottom);
        }

        function createWobblyPath(x1, y1, x2, y2) {
            const segments = 10;
            let path = `M ${x1} ${y1}`;
            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const cx = x1 + (x2 - x1) * t;
                const cy = y1 + (y2 - y1) * t;
                const offset = (Math.random() - 0.5) * 1.5;
                path += ` L ${cx + offset} ${cy + offset}`;
            }
            return path;
        }

        const ns = "http://www.w3.org/2000/svg";

        // Ejes
        const axisX = document.createElementNS(ns, "path");
        axisX.setAttribute("d", createWobblyPath(padding.left - 10, getY(0), width - padding.right + 10, getY(0)));
        axisX.setAttribute("stroke", "#333333");
        axisX.setAttribute("stroke-width", "2");
        axisX.setAttribute("fill", "none");
        svg.appendChild(axisX);

        const axisY0 = document.createElementNS(ns, "path");
        axisY0.setAttribute("d", createWobblyPath(getX(0), height - padding.bottom + 10, getX(0), padding.top - 10));
        axisY0.setAttribute("stroke", "#333333");
        axisY0.setAttribute("stroke-width", "2");
        axisY0.setAttribute("fill", "none");
        svg.appendChild(axisY0);

        const axisY1 = document.createElementNS(ns, "path");
        axisY1.setAttribute("d", createWobblyPath(getX(1), height - padding.bottom + 10, getX(1), padding.top - 10));
        axisY1.setAttribute("stroke", "#333333");
        axisY1.setAttribute("stroke-width", "1.5");
        axisY1.setAttribute("stroke-dasharray", "3 3");
        axisY1.setAttribute("fill", "none");
        svg.appendChild(axisY1);

        // Línea contra b1
        const line1 = document.createElementNS(ns, "path");
        line1.setAttribute("d", createWobblyPath(getX(0), getY(a21), getX(1), getY(a11)));
        line1.setAttribute("stroke", "#0000FF");
        line1.setAttribute("stroke-width", "3");
        line1.setAttribute("fill", "none");
        svg.appendChild(line1);

        // Línea contra b2
        const line2 = document.createElementNS(ns, "path");
        line2.setAttribute("d", createWobblyPath(getX(0), getY(a22), getX(1), getY(a12)));
        line2.setAttribute("stroke", "#D12828");
        line2.setAttribute("stroke-width", "3");
        line2.setAttribute("fill", "none");
        svg.appendChild(line2);

        // Intersección óptima
        if (!isNaN(p_opt) && !isNaN(v)) {
            const projX = document.createElementNS(ns, "path");
            projX.setAttribute("d", `M ${getX(p_opt)} ${getY(0)} L ${getX(p_opt)} ${getY(v)}`);
            projX.setAttribute("stroke", "#333333");
            projX.setAttribute("stroke-width", "1");
            projX.setAttribute("stroke-dasharray", "4 4");
            svg.appendChild(projX);

            const projY = document.createElementNS(ns, "path");
            projY.setAttribute("d", `M ${getX(0)} ${getY(v)} L ${getX(p_opt)} ${getY(v)}`);
            projY.setAttribute("stroke", "#333333");
            projY.setAttribute("stroke-width", "1");
            projY.setAttribute("stroke-dasharray", "4 4");
            svg.appendChild(projY);

            const eqCircle = document.createElementNS(ns, "circle");
            eqCircle.setAttribute("cx", getX(p_opt).toString());
            eqCircle.setAttribute("cy", getY(v).toString());
            eqCircle.setAttribute("r", "6");
            eqCircle.setAttribute("fill", "#FFFFA5");
            eqCircle.setAttribute("stroke", "#D12828");
            eqCircle.setAttribute("stroke-width", "2.5");
            svg.appendChild(eqCircle);

            // Valor óptimo de p*
            const txtP = document.createElementNS(ns, "text");
            txtP.setAttribute("x", getX(p_opt).toString());
            txtP.setAttribute("y", (height - padding.bottom + 18).toString());
            txtP.setAttribute("text-anchor", "middle");
            txtP.setAttribute("class", "svg-text font-accent");
            txtP.textContent = `p* = ${p_opt.toFixed(2)}`;
            svg.appendChild(txtP);

            // Valor de la ordenada V* (eje Y)
            const txtV = document.createElementNS(ns, "text");
            txtV.setAttribute("x", (padding.left - 6).toString());
            txtV.setAttribute("y", (getY(v) + 4).toString());
            txtV.setAttribute("text-anchor", "end");
            txtV.setAttribute("class", "svg-text font-accent");
            txtV.textContent = `V* = ${v.toFixed(2)}`;
            svg.appendChild(txtV);
        }

        // Etiquetas de ejes
        const labelXAxis = document.createElementNS(ns, "text");
        labelXAxis.setAttribute("x", (width / 2).toString());
        labelXAxis.setAttribute("y", (height - 6).toString());
        labelXAxis.setAttribute("text-anchor", "middle");
        labelXAxis.setAttribute("class", "svg-text font-accent");
        labelXAxis.textContent = "Probabilidad p (Ataque Bandas)";
        svg.appendChild(labelXAxis);

        const labelYAxis = document.createElementNS(ns, "text");
        labelYAxis.setAttribute("x", "10");
        labelYAxis.setAttribute("y", "18");
        labelYAxis.setAttribute("class", "svg-text");
        labelYAxis.textContent = "Pago Esperado (VE)";
        svg.appendChild(labelYAxis);

        // Extremidades de probabilidad
        const labelP0 = document.createElementNS(ns, "text");
        labelP0.setAttribute("x", getX(0).toString());
        labelP0.setAttribute("y", (height - padding.bottom + 18).toString());
        labelP0.setAttribute("text-anchor", "middle");
        labelP0.setAttribute("class", "svg-text");
        labelP0.textContent = "p = 0";
        svg.appendChild(labelP0);

        const labelP1 = document.createElementNS(ns, "text");
        labelP1.setAttribute("x", getX(1).toString());
        labelP1.setAttribute("y", (height - padding.bottom + 18).toString());
        labelP1.setAttribute("text-anchor", "middle");
        labelP1.setAttribute("class", "svg-text");
        labelP1.textContent = "p = 1";
        svg.appendChild(labelP1);

        // Leyendas de las líneas
        const legend1 = document.createElementNS(ns, "text");
        legend1.setAttribute("x", (getX(0.15)).toString());
        legend1.setAttribute("y", (getY(a21 * 0.85 + a11 * 0.15) - 8).toString());
        legend1.setAttribute("class", "svg-text font-blue");
        legend1.textContent = "VE(b1)";
        svg.appendChild(legend1);

        const legend2 = document.createElementNS(ns, "text");
        legend2.setAttribute("x", (getX(0.85)).toString());
        legend2.setAttribute("y", (getY(a22 * 0.15 + a12 * 0.85) - 8).toString());
        legend2.setAttribute("class", "svg-text font-accent");
        legend2.textContent = "VE(b2)";
        svg.appendChild(legend2);
    }

    /* ==========================================================================
       5. SOLVER DE LA SECCIÓN 2: CLÁSICO PACEÑO
       ========================================================================== */
    function calculateSection2() {
        const m11 = parseFloat(document.getElementById('sec2-m11').value) || 0;
        const m12 = parseFloat(document.getElementById('sec2-m12').value) || 0;
        const m21 = parseFloat(document.getElementById('sec2-m21').value) || 0;
        const m22 = parseFloat(document.getElementById('sec2-m22').value) || 0;

        const sol = solve2x2(m11, m12, m21, m22);

        // Paso 2: Análisis de silla
        const step2Div = document.getElementById('sec2-step2-results');
        if (step2Div) {
            step2Div.replaceChildren();
            
            const minRow1 = Math.min(m11, m12);
            const minRow2 = Math.min(m21, m22);
            const maxCol1 = Math.max(m11, m21);
            const maxCol2 = Math.max(m12, m22);

            step2Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Mínimos de Fila (Peor escenario para Bolívar):" }, { tag: "br", text: "" },
                `- Ataque por Bandas (a1): mín(${m11}, ${m12}) = ${minRow1}`, { tag: "br", text: "" },
                `- Ataque por Centro (a2): mín(${m21}, ${m22}) = ${minRow2}`, { tag: "br", text: "" },
                `➔ Maximin (Máximo de los mínimos) = `, { tag: "strong", text: `${sol.maximin.toFixed(1)}` }
            ]));

            step2Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Máximos de Columna (Peor escenario para The Strongest):" }, { tag: "br", text: "" },
                `- Defensa de Bandas (b1): máx(${m11}, ${m21}) = ${maxCol1}`, { tag: "br", text: "" },
                `- Defensa de Centro (b2): máx(${m12}, ${m22}) = ${maxCol2}`, { tag: "br", text: "" },
                `➔ Minimax (Mínimo de los máximos) = `, { tag: "strong", text: `${sol.minimax.toFixed(1)}` }
            ]));

            if (sol.hasSaddlePoint) {
                step2Div.appendChild(createMathParagraph([
                    { tag: "span", text: "¡Existe Punto de Silla Puro!", className: "font-blue" }, { tag: "br", text: "" },
                    `Dado que Maximin (${sol.maximin.toFixed(1)}) = Minimax (${sol.minimax.toFixed(1)}), el juego tiene una solución estable en estrategias puras.`
                ]));
            } else {
                step2Div.appendChild(createMathParagraph([
                    { tag: "span", text: "No existe Punto de Silla Puro.", className: "font-accent" }, { tag: "br", text: "" },
                    `Dado que Maximin (${sol.maximin.toFixed(1)}) ≠ Minimax (${sol.minimax.toFixed(1)}), los entrenadores deben usar estrategias mixtas.`
                ]));
            }
        }

        // Paso 3: Estrategias Mixtas
        const step3Div = document.getElementById('sec2-step3-results');
        if (step3Div) {
            step3Div.replaceChildren();

            if (sol.hasSaddlePoint) {
                step3Div.appendChild(createMathParagraph([
                    "Al haber un punto de silla, la probabilidad óptima es de frontera (100% a la opción de equilibrio).", { tag: "br", text: "" },
                    `Bolívar jugará la estrategia del punto de silla con probabilidad `, { tag: "strong", text: `${(sol.p_opt * 100).toFixed(1)}%` },
                    ` y Strongest con `, { tag: "strong", text: `${(sol.q_opt * 100).toFixed(1)}%` }, "."
                ]));
            } else {
                step3Div.appendChild(createMathParagraph([
                    { tag: "strong", text: "Estrategias de Bolívar (p):" }, { tag: "br", text: "" },
                    `Igualamos los pagos esperados de Strongest:`, { tag: "br", text: "" },
                    `${m11}p + ${m21}(1-p) = ${m12}p + ${m22}(1-p)`, { tag: "br", text: "" },
                    `Resolviendo para p*: `, { tag: "strong", text: `p* = ${(sol.p_opt).toFixed(3)} (${(sol.p_opt * 100).toFixed(1)}%)` }
                ]));

                step3Div.appendChild(createMathParagraph([
                    { tag: "strong", text: "Estrategias de The Strongest (q):" }, { tag: "br", text: "" },
                    `Igualamos los pagos esperados de Bolívar:`, { tag: "br", text: "" },
                    `${m11}q + ${m12}(1-q) = ${m21}q + ${m22}(1-q)`, { tag: "br", text: "" },
                    `Resolviendo para q*: `, { tag: "strong", text: `q* = ${(sol.q_opt).toFixed(3)} (${(sol.q_opt * 100).toFixed(1)}%)` }
                ]));
            }
        }

        // Paso 4: Gráfico e Interpretación
        drawGraph('sec2-graph', m11, m12, m21, m22, sol.p_opt, sol.v);
        const step4Div = document.getElementById('sec2-step4-results');
        if (step4Div) {
            step4Div.replaceChildren();
            
            let calcParts = [];
            if (sol.hasSaddlePoint) {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = maximin = minimax = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            } else {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "a" }, { tag: "sub", text: "11" }, "·", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, " + ",
                    { tag: "i", text: "a" }, { tag: "sub", text: "21" }, "·(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${m11.toFixed(1)}·${sol.p_opt.toFixed(3)} + ${m21.toFixed(1)}·${(1 - sol.p_opt).toFixed(3)}`, { tag: "br" },
                    " = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            }

            const calcParagraph = createMathParagraph(calcParts);
            calcParagraph.className = "math-calc";

            step4Div.appendChild(createMathParagraph([
                { tag: "strong", text: `Valor del Juego (Avance esperado): V = ${sol.v.toFixed(2)} yardas.` }
            ]));
            step4Div.appendChild(calcParagraph);
            step4Div.appendChild(createMathParagraph([
                `Bolívar tiene una ventaja ofensiva promedio de ${sol.v.toFixed(2)} yardas por jugada al ejecutar la mezcla de estrategias óptima.`
            ]));
        }
    }

    /* ==========================================================================
       6. SOLVER DE LA SECCIÓN 3: ESPAÑA VS ARGENTINA
       ========================================================================== */
    function calculateSection3() {
        const m11 = parseFloat(document.getElementById('sec3-m11').value) || 0;
        const m12 = parseFloat(document.getElementById('sec3-m12').value) || 0;
        const m21 = parseFloat(document.getElementById('sec3-m21').value) || 0;
        const m22 = parseFloat(document.getElementById('sec3-m22').value) || 0;

        const sol = solve2x2(m11, m12, m21, m22);

        // Paso 2: Punto de Silla
        const step2Div = document.getElementById('sec3-step2-results');
        if (step2Div) {
            step2Div.replaceChildren();
            const minRow1 = Math.min(m11, m12);
            const minRow2 = Math.min(m21, m22);
            const maxCol1 = Math.max(m11, m21);
            const maxCol2 = Math.max(m12, m22);

            step2Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Mínimos de Filas (España):" }, { tag: "br", text: "" },
                `- Ataque Bandas: mín(${m11}, ${m12}) = ${minRow1}`, { tag: "br", text: "" },
                `- Remates a Puerta: mín(${m21}, ${m22}) = ${minRow2}`, { tag: "br", text: "" },
                `➔ Maximin = ${sol.maximin.toFixed(1)}`
            ]));

            step2Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Máximos de Columnas (Argentina):" }, { tag: "br", text: "" },
                `- Presión Física: máx(${m11}, ${m21}) = ${maxCol1}`, { tag: "br", text: "" },
                `- Quites Limpios: máx(${m12}, ${m22}) = ${maxCol2}`, { tag: "br", text: "" },
                `➔ Minimax = ${sol.minimax.toFixed(1)}`
            ]));
        }

        // Paso 3: Estrategias Mixtas
        const step3Div = document.getElementById('sec3-step3-results');
        if (step3Div) {
            step3Div.replaceChildren();
            if (sol.hasSaddlePoint) {
                step3Div.appendChild(createMathParagraph([
                    `El juego cuenta con un punto de silla puro en el valor: V = ${sol.v.toFixed(1)}.`, { tag: "br", text: "" },
                    `España debe jugar 100% la estrategia del equilibrio.`
                ]));
            } else {
                step3Div.appendChild(createMathParagraph([
                    { tag: "strong", text: "Cálculos mediante indiferencia:" }, { tag: "br", text: "" },
                    `- España (p) Bandas: `, { tag: "strong", text: `p* = ${sol.p_opt.toFixed(3)} (${(sol.p_opt * 100).toFixed(1)}%)` }, { tag: "br", text: "" },
                    `- Argentina (q) Presión Física: `, { tag: "strong", text: `q* = ${sol.q_opt.toFixed(3)} (${(sol.q_opt * 100).toFixed(1)}%)` }
                ]));
            }
        }

        // Paso 4: Conclusiones
        const step4Div = document.getElementById('sec3-step4-results');
        if (step4Div) {
            step4Div.replaceChildren();
            
            let calcParts = [];
            if (sol.hasSaddlePoint) {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = maximin = minimax = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            } else {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "a" }, { tag: "sub", text: "11" }, "·", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, " + ",
                    { tag: "i", text: "a" }, { tag: "sub", text: "21" }, "·(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${m11.toFixed(1)}·${sol.p_opt.toFixed(3)} + ${m21.toFixed(1)}·${(1 - sol.p_opt).toFixed(3)}`, { tag: "br" },
                    " = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            }

            const calcParagraph = createMathParagraph(calcParts);
            calcParagraph.className = "math-calc";

            step4Div.appendChild(createMathParagraph([
                { tag: "strong", text: `Valor del Juego: V = ${sol.v.toFixed(2)}` }
            ]));
            step4Div.appendChild(calcParagraph);
            step4Div.appendChild(createMathParagraph([
                sol.v > 0 
                ? "El dominio táctico favorece a España. Argentina debe ser sumamente cautelosa y no depender únicamente de un tipo de defensa." 
                : "El dominio táctico favorece a Argentina en su capacidad de bloquear eficientemente los embates españoles."
            ]));
        }
    }

    /* ==========================================================================
       7. SOLVER DE LA SECCIÓN 4: REDUCCIÓN GENERAL DE MATRICES
       ========================================================================== */
    function calculateSection4() {
        const m = [
            [
                parseFloat(document.getElementById('sec4-m11').value) || 0,
                parseFloat(document.getElementById('sec4-m12').value) || 0,
                parseFloat(document.getElementById('sec4-m13').value) || 0
            ],
            [
                parseFloat(document.getElementById('sec4-m21').value) || 0,
                parseFloat(document.getElementById('sec4-m22').value) || 0,
                parseFloat(document.getElementById('sec4-m23').value) || 0
            ],
            [
                parseFloat(document.getElementById('sec4-m31').value) || 0,
                parseFloat(document.getElementById('sec4-m32').value) || 0,
                parseFloat(document.getElementById('sec4-m33').value) || 0
            ]
        ];

        // Paso 2: Dominancia de filas
        const step2Div = document.getElementById('sec4-step2-results');
        step2Div.replaceChildren();

        let rowEliminated = -1;
        let rowDominator = -1;

        for (let r1 = 0; r1 < 3; r1++) {
            for (let r2 = 0; r2 < 3; r2++) {
                if (r1 === r2) continue;
                let dominates = true;
                for (let c = 0; c < 3; c++) {
                    if (m[r1][c] < m[r2][c]) {
                        dominates = false;
                        break;
                    }
                }
                if (dominates) {
                    rowEliminated = r2;
                    rowDominator = r1;
                    break;
                }
            }
            if (rowEliminated !== -1) break;
        }

        const table2 = document.createElement('table');
        table2.className = 'sketch-table';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `<tr><th>A \\ B</th><th>b1</th><th>b2</th><th>b3</th></tr>`;
        table2.appendChild(thead);

        const tbody2 = document.createElement('tbody');
        for (let r = 0; r < 3; r++) {
            const tr = document.createElement('tr');
            if (r === rowEliminated) tr.className = 'struck-out';
            
            const th = document.createElement('td');
            th.innerHTML = `<strong>a${r+1}</strong>`;
            tr.appendChild(th);

            for (let c = 0; c < 3; c++) {
                const td = document.createElement('td');
                td.textContent = m[r][c];
                if (r === rowEliminated) td.className = 'struck-out';
                tr.appendChild(td);
            }
            tbody2.appendChild(tr);
        }
        table2.appendChild(tbody2);
        step2Div.appendChild(table2);

        if (rowEliminated !== -1) {
            step2Div.appendChild(createMathParagraph([
                { tag: "span", text: "¡Dominancia encontrada! ", className: "font-accent" },
                "La fila ", { tag: "strong", text: `a${rowDominator + 1}` }, " domina a la fila ", 
                { tag: "strong", text: `a${rowEliminated + 1}` }, " puesto que sus pagos son mayores o iguales en todas las columnas. Se elimina la fila ",
                { tag: "strong", text: `a${rowEliminated + 1}` }, "."
            ]));
        } else {
            step2Div.appendChild(createMathParagraph([
                "No se encontró dominancia de filas estricta en el primer paso."
            ]));
        }

        // Paso 3: Dominancia de columnas
        const step3Div = document.getElementById('sec4-step3-results');
        step3Div.replaceChildren();

        let colEliminated = -1;
        let colDominator = -1;
        const activeRows = [0, 1, 2].filter(r => r !== rowEliminated);

        for (let c1 = 0; c1 < 3; c1++) {
            for (let c2 = 0; c2 < 3; c2++) {
                if (c1 === c2) continue;
                let dominates = true;
                for (const r of activeRows) {
                    if (m[r][c1] > m[r][c2]) {
                        dominates = false;
                        break;
                    }
                }
                if (dominates) {
                    colEliminated = c2;
                    colDominator = c1;
                    break;
                }
            }
            if (colEliminated !== -1) break;
        }

        const table3 = document.createElement('table');
        table3.className = 'sketch-table';
        
        const thead3 = document.createElement('thead');
        const hr3 = document.createElement('tr');
        hr3.appendChild(document.createElement('th'));
        for (let c = 0; c < 3; c++) {
            const th = document.createElement('th');
            th.textContent = `b${c+1}`;
            if (c === colEliminated) th.className = 'struck-out';
            hr3.appendChild(th);
        }
        thead3.appendChild(hr3);
        table3.appendChild(thead3);

        const tbody3 = document.createElement('tbody');
        for (const r of activeRows) {
            const tr = document.createElement('tr');
            const th = document.createElement('td');
            th.innerHTML = `<strong>a${r+1}</strong>`;
            tr.appendChild(th);

            for (let c = 0; c < 3; c++) {
                const td = document.createElement('td');
                td.textContent = m[r][c];
                if (c === colEliminated) td.className = 'struck-out';
                tr.appendChild(td);
            }
            tbody3.appendChild(tr);
        }
        table3.appendChild(tbody3);
        step3Div.appendChild(table3);

        if (colEliminated !== -1) {
            step3Div.appendChild(createMathParagraph([
                { tag: "span", text: "¡Dominancia encontrada! ", className: "font-blue" },
                "Buscando minimizar el pago, la columna ", { tag: "strong", text: `b${colDominator + 1}` }, " domina a ",
                { tag: "strong", text: `b${colEliminated + 1}` }, ". Se elimina la columna ", { tag: "strong", text: `b${colEliminated + 1}` }, "."
            ]));
        } else {
            step3Div.appendChild(createMathParagraph([
                "No se encontró dominancia de columnas en la matriz reducida."
            ]));
        }

        // Paso 4: Matriz final reducida
        const step4Div = document.getElementById('sec4-step4-results');
        step4Div.replaceChildren();

        const finalRows = [0, 1, 2].filter(r => r !== rowEliminated);
        const finalCols = [0, 1, 2].filter(c => c !== colEliminated);

        if (finalRows.length === 2 && finalCols.length === 2) {
            const f11 = m[finalRows[0]][finalCols[0]];
            const f12 = m[finalRows[0]][finalCols[1]];
            const f21 = m[finalRows[1]][finalCols[0]];
            const f22 = m[finalRows[1]][finalCols[1]];

            renderPayoffMatrix2x2(
                step4Div, f11, f12, f21, f22,
                ["Jugador A", `a${finalRows[0]+1}`, `a${finalRows[1]+1}`],
                ["Jugador B", `b${finalCols[0]+1}`, `b${finalCols[1]+1}`]
            );

            const sol = solve2x2(f11, f12, f21, f22);
             
            let calcParts = [];
            if (sol.hasSaddlePoint) {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = maximin = minimax = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            } else {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "f" }, { tag: "sub", text: "11" }, "·", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, " + ",
                    { tag: "i", text: "f" }, { tag: "sub", text: "21" }, "·(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${f11.toFixed(1)}·${sol.p_opt.toFixed(3)} + ${f21.toFixed(1)}·${(1 - sol.p_opt).toFixed(3)}`, { tag: "br" },
                    " = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            }

            const calcParagraph = createMathParagraph(calcParts);
            calcParagraph.className = "math-calc";

            step4Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Resolución de la Matriz Reducida 2x2:" }, { tag: "br", text: "" },
                `- Probabilidades Jugador A: [a${finalRows[0]+1}: ${(sol.p_opt * 100).toFixed(1)}%, a${finalRows[1]+1}: ${((1-sol.p_opt) * 100).toFixed(1)}%]`, { tag: "br", text: "" },
                `- Probabilidades Jugador B: [b${finalCols[0]+1}: ${(sol.q_opt * 100).toFixed(1)}%, b${finalCols[1]+1}: ${((1-sol.q_opt) * 100).toFixed(1)}%]`, { tag: "br", text: "" },
                `- Valor del juego: `, { tag: "strong", text: `V = ${sol.v.toFixed(2)}` }
            ]));
            step4Div.appendChild(calcParagraph);
        } else {
            step4Div.appendChild(document.createTextNode("La matriz no se redujo a una forma exacta 2x2. Prueba ingresando otros valores en el Paso 1."));
        }
    }

    /* ==========================================================================
       8. SOLVER DE LA SECCIÓN 5: PUMAKATARI VS MINIBUSES
       ========================================================================== */
    function calculateSection5() {
        const m = [
            [
                parseFloat(document.getElementById('sec5-m11').value) || 0,
                parseFloat(document.getElementById('sec5-m12').value) || 0,
                parseFloat(document.getElementById('sec5-m13').value) || 0
            ],
            [
                parseFloat(document.getElementById('sec5-m21').value) || 0,
                parseFloat(document.getElementById('sec5-m22').value) || 0,
                parseFloat(document.getElementById('sec5-m23').value) || 0
            ],
            [
                parseFloat(document.getElementById('sec5-m31').value) || 0,
                parseFloat(document.getElementById('sec5-m32').value) || 0,
                parseFloat(document.getElementById('sec5-m33').value) || 0
            ]
        ];

        // Paso 2: Dominancia
        const step2Div = document.getElementById('sec5-step2-results');
        step2Div.replaceChildren();

        let colEliminated = -1;
        let colDominator = -1;
        
        for (let c1 = 0; c1 < 3; c1++) {
            for (let c2 = 0; c2 < 3; c2++) {
                if (c1 === c2) continue;
                let dominates = true;
                for (let r = 0; r < 3; r++) {
                    if (m[r][c1] > m[r][c2]) {
                        dominates = false;
                        break;
                    }
                }
                if (dominates) {
                    colEliminated = c2; 
                    colDominator = c1;
                    break;
                }
            }
            if (colEliminated !== -1) break;
        }

        let rowEliminated = -1;
        let rowDominator = -1;

        const activeCols = [0, 1, 2].filter(c => c !== colEliminated);
        for (let r1 = 0; r1 < 3; r1++) {
            for (let r2 = 0; r2 < 3; r2++) {
                if (r1 === r2) continue;
                let dominates = true;
                for (const c of activeCols) {
                    if (m[r1][c] < m[r2][c]) {
                        dominates = false;
                        break;
                    }
                }
                if (dominates) {
                    rowEliminated = r2; 
                    rowDominator = r1;
                    break;
                }
            }
            if (rowEliminated !== -1) break;
        }

        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        const table = document.createElement('table');
        table.className = 'sketch-table';

        const rowLabels = ["A1: Ampliar Frecuencia", "A2: Tarifa Estudiantil", "A3: Ruta Alimentadora"];
        const colLabels = ["B1: Rebajar pasaje", "B2: Paradas flex.", "B3: Renovación"];

        const thead = document.createElement('thead');
        const hRow = document.createElement('tr');
        hRow.appendChild(document.createElement('th'));
        colLabels.forEach((l, cIdx) => {
            const th = document.createElement('th');
            th.textContent = l;
            if (cIdx === colEliminated) th.className = 'struck-out';
            hRow.appendChild(th);
        });
        thead.appendChild(hRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        for (let r = 0; r < 3; r++) {
            const tr = document.createElement('tr');
            if (r === rowEliminated) tr.className = 'struck-out';

            const tdLabel = document.createElement('td');
            tdLabel.textContent = rowLabels[r];
            tr.appendChild(tdLabel);

            for (let c = 0; c < 3; c++) {
                const td = document.createElement('td');
                td.textContent = m[r][c];
                if (c === colEliminated || r === rowEliminated) {
                    td.className = 'struck-out';
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        step2Div.appendChild(tableContainer);

        const pDesc = document.createElement('p');
        pDesc.className = 'solver-explanation-box';
        
        if (colEliminated !== -1) {
            const span1 = document.createElement('span');
            span1.textContent = "- El Sindicato de Minibuses (B) elimina la estrategia dominada ";
            const strong1 = document.createElement('strong');
            strong1.textContent = colLabels[colEliminated];
            const span2 = document.createElement('span');
            span2.textContent = " porque la columna ";
            const strong2 = document.createElement('strong');
            strong2.textContent = colLabels[colDominator];
            const span3 = document.createElement('span');
            span3.textContent = " siempre le genera menos pérdida (o igual).";
            
            pDesc.append(span1, strong1, span2, strong2, span3, document.createElement('br'));
        }
        if (rowEliminated !== -1) {
            const span1 = document.createElement('span');
            span1.textContent = "- El Pumakatari (A) elimina la estrategia dominada ";
            const strong1 = document.createElement('strong');
            strong1.textContent = rowLabels[rowEliminated];
            const span2 = document.createElement('span');
            span2.textContent = " porque la fila ";
            const strong2 = document.createElement('strong');
            strong2.textContent = rowLabels[rowDominator];
            const span3 = document.createElement('span');
            span3.textContent = " le garantiza una mayor cuota de mercado en todos los casos activos.";
            
            pDesc.append(span1, strong1, span2, strong2, span3);
        }
        if (colEliminated === -1 && rowEliminated === -1) {
            pDesc.textContent = "- No se detectaron dominancias directas con los valores actuales.";
        }
        step2Div.appendChild(pDesc);

        // Paso 3: Resolver reducida 2x2
        const finalRows = [0, 1, 2].filter(r => r !== rowEliminated);
        const finalCols = [0, 1, 2].filter(c => c !== colEliminated);

        const step3Div = document.getElementById('sec5-step3-results');
        step3Div.replaceChildren();

        if (finalRows.length === 2 && finalCols.length === 2) {
            const f11 = m[finalRows[0]][finalCols[0]];
            const f12 = m[finalRows[0]][finalCols[1]];
            const f21 = m[finalRows[1]][finalCols[0]];
            const f22 = m[finalRows[1]][finalCols[1]];

            const sol = solve2x2(f11, f12, f21, f22);

            step3Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Matriz Reducida Resultante (2x2):" }
            ]));

            const rTableContainer = document.createElement('div');
            renderPayoffMatrix2x2(
                rTableContainer, f11, f12, f21, f22, 
                ["Pumakatari", rowLabels[finalRows[0]], rowLabels[finalRows[1]]],
                ["Minibuses", colLabels[finalCols[0]], colLabels[finalCols[1]]]
            );
            step3Div.appendChild(rTableContainer);

            step3Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Cálculos de Probabilidades Óptimas:" }, { tag: "br", text: "" },
                `- Probabilidad Pumakatari para ${rowLabels[finalRows[0]]} (p): `, { tag: "strong", text: `${(sol.p_opt * 100).toFixed(1)}%` }, { tag: "br", text: "" },
                `- Probabilidad Pumakatari para ${rowLabels[finalRows[1]]} (1-p): `, { tag: "strong", text: `${((1 - sol.p_opt) * 100).toFixed(1)}%` }, { tag: "br", text: "" },
                `- Probabilidad Minibuses para ${colLabels[finalCols[0]]} (q): `, { tag: "strong", text: `${(sol.q_opt * 100).toFixed(1)}%` }, { tag: "br", text: "" },
                `- Probabilidad Minibuses para ${colLabels[finalCols[1]]} (1-q): `, { tag: "strong", text: `${((1 - sol.q_opt) * 100).toFixed(1)}%` }
            ]));

            // Paso 4: Resultados y Valor del Juego
            const step4Div = document.getElementById('sec5-step4-results');
            step4Div.replaceChildren();
            
            let calcParts = [];
            if (sol.hasSaddlePoint) {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = maximin = minimax = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            } else {
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "f" }, { tag: "sub", text: "11" }, "·", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, " + ",
                    { tag: "i", text: "f" }, { tag: "sub", text: "21" }, "·(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${f11.toFixed(1)}·${sol.p_opt.toFixed(3)} + ${f21.toFixed(1)}·${(1 - sol.p_opt).toFixed(3)}`, { tag: "br" },
                    " = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            }

            const calcParagraph = createMathParagraph(calcParts);
            calcParagraph.className = "math-calc";

            step4Div.appendChild(createMathParagraph([
                { tag: "strong", text: `Valor del Juego: V = ${sol.v.toFixed(2)}%` }
            ]));
            step4Div.appendChild(calcParagraph);
            step4Div.appendChild(createMathParagraph([
                `Esto significa que el Pumakatari ganará en promedio un ${sol.v.toFixed(2)}% de cuota de mercado en el semestre si juega con la mezcla calculada.`, { tag: "br", text: "" },
                { tag: "strong", text: "Interpretación real: " },
                "Para implementar una probabilidad de, por ejemplo, 1/7, el administrador de rutas puede usar una ruleta con 7 divisiones al inicio del semestre o sortear un día a la semana para la estrategia comercial."
            ]));

        } else {
            step3Div.appendChild(document.createTextNode("La matriz no se pudo reducir exactamente a 2x2. Modifica los números iniciales."));
        }
    }

    /* ==========================================================================
       9. DISPARADOR DE CÁLCULOS GENERALES
       ========================================================================== */
    function calculateAll() {
        calculateSection2();
        calculateSection3();
        calculateSection4();
        calculateSection5();
    }

    // Agregar listeners a inputs
    document.querySelectorAll('.sec2-input').forEach(i => i.addEventListener('input', calculateSection2));
    document.querySelectorAll('.sec3-input').forEach(i => i.addEventListener('input', calculateSection3));
    document.querySelectorAll('.sec4-input').forEach(i => i.addEventListener('input', calculateSection4));
    document.querySelectorAll('.sec5-input').forEach(i => i.addEventListener('input', calculateSection5));

    // Agregar listeners a los botones de restablecer
    document.getElementById('reset-sec2-btn')?.addEventListener('click', () => {
        document.getElementById('sec2-m11').value = 1;
        document.getElementById('sec2-m12').value = 6;
        document.getElementById('sec2-m21').value = 15;
        document.getElementById('sec2-m22').value = 0;
        calculateSection2();
    });

    document.getElementById('reset-sec3-btn')?.addEventListener('click', () => {
        document.getElementById('sec3-m11').value = 4;
        document.getElementById('sec3-m12').value = 11;
        document.getElementById('sec3-m21').value = 15;
        document.getElementById('sec3-m22').value = -4;
        calculateSection3();
    });

    document.getElementById('reset-sec4-btn')?.addEventListener('click', () => {
        document.getElementById('sec4-m11').value = 0;
        document.getElementById('sec4-m12').value = -1;
        document.getElementById('sec4-m13').value = 2;
        document.getElementById('sec4-m21').value = 5;
        document.getElementById('sec4-m22').value = 4;
        document.getElementById('sec4-m23').value = -3;
        document.getElementById('sec4-m31').value = 2;
        document.getElementById('sec4-m32').value = 3;
        document.getElementById('sec4-m33').value = -4;
        calculateSection4();
    });

    document.getElementById('reset-sec5-btn')?.addEventListener('click', () => {
        document.getElementById('sec5-m11').value = 4;
        document.getElementById('sec5-m12').value = -2;
        document.getElementById('sec5-m13').value = 6;
        document.getElementById('sec5-m21').value = 2;
        document.getElementById('sec5-m22').value = 3;
        document.getElementById('sec5-m23').value = 2;
        document.getElementById('sec5-m31').value = 1;
        document.getElementById('sec5-m32').value = 0;
        document.getElementById('sec5-m33').value = 5;
        calculateSection5();
    });

    // Inicializar todo al cargar
    calculateAll();
});
