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
        2: { current: 1, max: 5, names: ["Planteamiento", "Maximin y Minimax", "Estrategias Mixtas", "Gráfico y Conclusión", "Verificación y Simulación"] },
        3: { current: 1, max: 4, names: ["Planteamiento", "Punto de Silla", "Cálculo de Probabilidades", "Conclusiones"] },
        4: { current: 1, max: 4, names: ["Planteamiento 3x3", "Dominancia de Filas", "Dominancia de Columnas", "Resultado Reducido"] },
        5: { current: 1, max: 4, names: ["Planteamiento", "Reducción por Dominancia", "Estrategias Mixtas", "Interpretación"] }
    };

    let sec3Stats = {
        crs: 27,
        sot: 12,
        fls: 23,
        tklw: 16
    };
    let sec3Cells = {
        m11: 4,
        m12: 11,
        m21: -11,
        m22: -4
    };
    let sec3IsFictional = false;

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

        if (secNum === 3) {
            const m11Input = document.getElementById('sec3-m11');
            const m12Input = document.getElementById('sec3-m12');
            const m21Input = document.getElementById('sec3-m21');
            const m22Input = document.getElementById('sec3-m22');
            const fictionalBtn = document.getElementById('fictional-sec3-btn');

            if (m11Input && m12Input && m21Input && m22Input) {
                if (state.current === 1) {
                    m11Input.readOnly = true;
                    m12Input.readOnly = true;
                    m21Input.readOnly = true;
                    m22Input.readOnly = true;

                    if (fictionalBtn) fictionalBtn.style.display = "none";
                    m11Input.type = "text";
                    m12Input.type = "text";
                    m21Input.type = "text";
                    m22Input.type = "text";

                    m11Input.style.fontSize = "0.82rem";
                    m12Input.style.fontSize = "0.82rem";
                    m21Input.style.fontSize = "0.82rem";
                    m22Input.style.fontSize = "0.82rem";

                    m11Input.style.padding = "4px 2px";
                    m12Input.style.padding = "4px 2px";
                    m21Input.style.padding = "4px 2px";
                    m22Input.style.padding = "4px 2px";

                    m11Input.value = `${sec3Stats.crs} - ${sec3Stats.fls} = ${sec3Stats.crs - sec3Stats.fls}`;
                    m12Input.value = `${sec3Stats.crs} - ${sec3Stats.tklw} = ${sec3Stats.crs - sec3Stats.tklw}`;
                    m21Input.value = `${sec3Stats.sot} - ${sec3Stats.fls} = ${sec3Stats.sot - sec3Stats.fls}`;
                    m22Input.value = `${sec3Stats.sot} - ${sec3Stats.tklw} = ${sec3Stats.sot - sec3Stats.tklw}`;
                } else {
                    m11Input.readOnly = false;
                    m12Input.readOnly = false;
                    m21Input.readOnly = false;
                    m22Input.readOnly = false;

                    if (fictionalBtn) fictionalBtn.style.display = "block";
                    m11Input.type = "number";
                    m12Input.type = "number";
                    m21Input.type = "number";
                    m22Input.type = "number";

                    m11Input.style.fontSize = "";
                    m12Input.style.fontSize = "";
                    m21Input.style.fontSize = "";
                    m22Input.style.fontSize = "";

                    m11Input.style.padding = "";
                    m12Input.style.padding = "";
                    m21Input.style.padding = "";
                    m22Input.style.padding = "";

                    m11Input.value = sec3Cells.m11;
                    m12Input.value = sec3Cells.m12;
                    m21Input.value = sec3Cells.m21;
                    m22Input.value = sec3Cells.m22;
                }
            }
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

    function drawGraph(svgId, a11, a12, a21, a22, p_opt, v, xLabel = "Probabilidad p", yLabel = "Pago Esperado (VE)", leg1 = "VE(b1)", leg2 = "VE(b2)") {
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
        labelXAxis.textContent = xLabel;
        svg.appendChild(labelXAxis);

        const labelYAxis = document.createElementNS(ns, "text");
        labelYAxis.setAttribute("x", "10");
        labelYAxis.setAttribute("y", "18");
        labelYAxis.setAttribute("class", "svg-text");
        labelYAxis.textContent = yLabel;
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
        legend1.textContent = leg1;
        svg.appendChild(legend1);

        const legend2 = document.createElementNS(ns, "text");
        legend2.setAttribute("x", (getX(0.85)).toString());
        legend2.setAttribute("y", (getY(a22 * 0.15 + a12 * 0.85) - 8).toString());
        legend2.setAttribute("class", "svg-text font-accent");
        legend2.textContent = leg2;
        svg.appendChild(legend2);
    }

    function updateSidebarStrikethrough(secNum, rowElim, colElim) {
        const grid = document.querySelector(`#section-${secNum} .matrix-input-grid`);
        if (!grid) return;

        // Clear existing strikethrough classes
        grid.querySelectorAll('.struck-out').forEach(el => el.classList.remove('struck-out'));
        grid.querySelectorAll('input').forEach(el => el.classList.remove('struck-out'));

        // If row is eliminated (0, 1, 2)
        if (rowElim !== -1) {
            const startIndex = (rowElim + 1) * 4;
            for (let i = 0; i < 4; i++) {
                const cell = grid.children[startIndex + i];
                if (cell) {
                    cell.classList.add('struck-out');
                    const input = cell.querySelector('input');
                    if (input) input.classList.add('struck-out');
                }
            }
        }

        // If col is eliminated (0, 1, 2)
        if (colElim !== -1) {
            const colIndex = colElim + 1;
            for (let r = 0; r < 4; r++) {
                const cell = grid.children[r * 4 + colIndex];
                if (cell) {
                    cell.classList.add('struck-out');
                    const input = cell.querySelector('input');
                    if (input) input.classList.add('struck-out');
                }
            }
        }
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
                const term1 = m11 * sol.p_opt;
                const term2 = m21 * (1 - sol.p_opt);
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "a" }, { tag: "sub", text: "11" }, "(", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ") + ",
                    { tag: "i", text: "a" }, { tag: "sub", text: "21" }, "(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${m11.toFixed(1)}(${sol.p_opt.toFixed(3)}) + ${m21.toFixed(1)}(${(1 - sol.p_opt).toFixed(3)})`, { tag: "br" },
                    " = ", `${term1.toFixed(2)} + ${term2.toFixed(2)}`, { tag: "br" },
                    " = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            }

            const calcParagraph = createMathParagraph(calcParts);
            calcParagraph.className = "math-calc";

            step4Div.appendChild(createMathParagraph([
                { tag: "strong", text: `Valor del Juego (Avance esperado): V = ${sol.v.toFixed(2)} metros.` }
            ]));
            step4Div.appendChild(calcParagraph);
            step4Div.appendChild(createMathParagraph([
                `Bolívar tiene una ventaja ofensiva promedio de ${sol.v.toFixed(2)} metros por jugada al ejecutar la mezcla de estrategias óptima.`
            ]));
        }

        // Paso 5: Verificación de indiferencia, explotabilidad y estado para Monte Carlo
        sec2LastState = { m11, m12, m21, m22, sol };

        const step5Div = document.getElementById('sec2-step5-verification');
        if (step5Div) {
            step5Div.replaceChildren();

            if (sol.hasSaddlePoint) {
                step5Div.appendChild(createMathParagraph([
                    { tag: "span", text: "Prueba de estabilidad (punto de silla): ", className: "font-blue" },
                    `Como existe equilibrio puro, ningún jugador puede mejorar desviándose unilateralmente. Cambiar de estrategia solo empeora (o iguala) su resultado, por lo que no aplica un análisis de explotabilidad probabilística.`
                ]));
            } else {
                // Prueba de indiferencia de Strongest ante p*
                const veB1 = m11 * sol.p_opt + m21 * (1 - sol.p_opt);
                const veB2 = m12 * sol.p_opt + m22 * (1 - sol.p_opt);
                step5Div.appendChild(createMathParagraph([
                    { tag: "strong", text: "Prueba de indiferencia de The Strongest: " },
                    `con p* = ${sol.p_opt.toFixed(3)}, VE(b1) = ${veB1.toFixed(2)} y VE(b2) = ${veB2.toFixed(2)}. `,
                    Math.abs(veB1 - veB2) < 0.01
                        ? { tag: "span", text: "Ambos coinciden: The Strongest es indiferente y no puede mejorar cambiando su defensa.", className: "font-blue" }
                        : { tag: "span", text: "Pequeña discrepancia numérica por redondeo; en el óptimo exacto ambos valores son iguales a V.", className: "font-accent" }
                ]));

                // Explotabilidad: si Strongest se desvía a estrategia pura, ¿cuánto puede ganar Bolívar?
                const gainIfB1 = Math.max(m11, m21) - sol.v;
                const gainIfB2 = Math.max(m12, m22) - sol.v;
                const worstDeviation = Math.max(gainIfB1, gainIfB2);
                const deviationLabel = gainIfB1 >= gainIfB2 ? "bandas (b1)" : "centro (b2)";

                step5Div.appendChild(createMathParagraph([
                    { tag: "strong", text: "Explotabilidad si Strongest se desvía: " },
                    `si el técnico rival abandonara la mezcla y defendiera siempre por ${deviationLabel}, Bolívar podría responder con su mejor estrategia pura y ganar `,
                    { tag: "strong", text: `${worstDeviation.toFixed(2)} metros extra por jugada` },
                    ` sobre el valor del juego (${sol.v.toFixed(2)}). Esto es precisamente lo que la aleatorización óptima evita: jugar siempre igual se paga caro.`
                ]));
            }
        }

        // Resumen ejecutivo (barra lateral, siempre visible)
        const summaryPanel = document.getElementById('sec2-summary-panel');
        if (summaryPanel) {
            summaryPanel.replaceChildren();
            summaryPanel.appendChild(createMathParagraph([
                { tag: "strong", text: "Tipo de solución: " },
                sol.hasSaddlePoint ? "Estrategia pura (punto de silla)" : "Estrategia mixta"
            ]));
            summaryPanel.appendChild(createMathParagraph([
                { tag: "strong", text: "p* (Bolívar, bandas): " }, `${(sol.p_opt * 100).toFixed(1)}%`
            ]));
            summaryPanel.appendChild(createMathParagraph([
                { tag: "strong", text: "q* (Strongest, bandas): " }, `${(sol.q_opt * 100).toFixed(1)}%`
            ]));
            summaryPanel.appendChild(createMathParagraph([
                { tag: "strong", text: "Valor del juego V: " }, `${sol.v.toFixed(2)} metros/jugada`
            ]));
        }
    }

    /* ==========================================================================
       5.b SIMULACIÓN DE MONTE CARLO PARA LA SECCIÓN 2
       ========================================================================== */
    let sec2LastState = null;
    let sec2MCRunning = [];

    function drawMonteCarloChart(svgId, runningAvg, v) {
        const svg = document.getElementById(svgId);
        if (!svg) return;
        svg.replaceChildren();

        const width = 400, height = 200;
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const ns = "http://www.w3.org/2000/svg";

        if (!runningAvg.length) return;

        const allVals = runningAvg.concat([v]);
        const minVal = Math.min(...allVals) - 1;
        const maxVal = Math.max(...allVals) + 1;

        function getX(i) {
            return padding.left + (i / (runningAvg.length - 1 || 1)) * (width - padding.left - padding.right);
        }
        function getY(val) {
            const range = maxVal - minVal || 1;
            const pct = (val - minVal) / range;
            return height - padding.bottom - pct * (height - padding.top - padding.bottom);
        }

        // Línea de referencia V (valor teórico del juego)
        const vLine = document.createElementNS(ns, "line");
        vLine.setAttribute("x1", padding.left); vLine.setAttribute("x2", width - padding.right);
        vLine.setAttribute("y1", getY(v)); vLine.setAttribute("y2", getY(v));
        vLine.setAttribute("stroke", "#D12828");
        vLine.setAttribute("stroke-width", "2");
        vLine.setAttribute("stroke-dasharray", "5 3");
        svg.appendChild(vLine);

        const vLabel = document.createElementNS(ns, "text");
        vLabel.setAttribute("x", width - padding.right - 4);
        vLabel.setAttribute("y", getY(v) - 6);
        vLabel.setAttribute("text-anchor", "end");
        vLabel.setAttribute("class", "svg-text font-accent");
        vLabel.textContent = `V teórico = ${v.toFixed(2)}`;
        svg.appendChild(vLabel);

        // Curva del promedio acumulado empírico
        let d = `M ${getX(0)} ${getY(runningAvg[0])}`;
        for (let i = 1; i < runningAvg.length; i++) {
            d += ` L ${getX(i)} ${getY(runningAvg[i])}`;
        }
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#0000FF");
        path.setAttribute("stroke-width", "2.5");
        path.setAttribute("fill", "none");
        svg.appendChild(path);

        const empLabel = document.createElementNS(ns, "text");
        empLabel.setAttribute("x", padding.left + 4);
        empLabel.setAttribute("y", padding.top + 10);
        empLabel.setAttribute("class", "svg-text font-blue");
        empLabel.textContent = "Promedio empírico acumulado";
        svg.appendChild(empLabel);
    }

    function runMonteCarloSection2(numTrials = 500) {
        if (!sec2LastState) return;
        const { m11, m12, m21, m22, sol } = sec2LastState;
        const p = sol.p_opt, q = sol.q_opt;

        const matrix = [[m11, m12], [m21, m22]];
        let cumulative = 0;
        const runningAvg = [];

        for (let t = 1; t <= numTrials; t++) {
            const row = Math.random() < p ? 0 : 1;
            const col = Math.random() < q ? 0 : 1;
            cumulative += matrix[row][col];
            runningAvg.push(cumulative / t);
        }

        drawMonteCarloChart('sec2-mc-graph', runningAvg, sol.v);

        const summaryDiv = document.getElementById('sec2-mc-summary');
        if (summaryDiv) {
            summaryDiv.replaceChildren();
            const finalAvg = runningAvg[runningAvg.length - 1];
            const diff = Math.abs(finalAvg - sol.v);
            summaryDiv.appendChild(createMathParagraph([
                { tag: "strong", text: `Resultado tras ${numTrials} jugadas simuladas: ` },
                `promedio empírico = ${finalAvg.toFixed(3)} metros/jugada, valor teórico V = ${sol.v.toFixed(2)}. `,
                { tag: "span", text: `Diferencia absoluta: ${diff.toFixed(3)} metros.`, className: diff < 0.5 ? "font-blue" : "font-accent" }
            ]));
            summaryDiv.appendChild(createMathParagraph([
                `A medida que aumenta el número de jugadas, la Ley de los Grandes Números garantiza que el promedio empírico converge al valor teórico del juego, validando la solución analítica de forma experimental.`
            ]));
        }
    }

    function calculateSection3() {
        const m11Input = document.getElementById('sec3-m11');
        const m12Input = document.getElementById('sec3-m12');
        const m21Input = document.getElementById('sec3-m21');
        const m22Input = document.getElementById('sec3-m22');

        if (sec3Cells.m11 === 8 && sec3Cells.m12 === 46 && sec3Cells.m21 === 68 && sec3Cells.m22 === 15) {
            sec3IsFictional = true;
        }

        const heartEl = document.getElementById('footer-heart');
        if (heartEl) {
            const isSection3Active = document.getElementById('section-3')?.classList.contains('active');
            heartEl.style.display = (sec3IsFictional && isSection3Active) ? 'inline' : 'none';
        }

        if (m11Input && m12Input && m21Input && m22Input) {
            if (sectionSteps[3].current === 1) {
                m11Input.value = `${sec3Stats.crs} - ${sec3Stats.fls} = ${sec3Stats.crs - sec3Stats.fls}`;
                m12Input.value = `${sec3Stats.crs} - ${sec3Stats.tklw} = ${sec3Stats.crs - sec3Stats.tklw}`;
                m21Input.value = `${sec3Stats.sot} - ${sec3Stats.fls} = ${sec3Stats.sot - sec3Stats.fls}`;
                m22Input.value = `${sec3Stats.sot} - ${sec3Stats.tklw} = ${sec3Stats.sot - sec3Stats.tklw}`;
            } else {
                m11Input.value = sec3Cells.m11;
                m12Input.value = sec3Cells.m12;
                m21Input.value = sec3Cells.m21;
                m22Input.value = sec3Cells.m22;
            }
        }

        const sol = solve2x2(sec3Cells.m11, sec3Cells.m12, sec3Cells.m21, sec3Cells.m22);

        // Paso 2: Punto de Silla
        const step2Div = document.getElementById('sec3-step2-results');
        if (step2Div) {
            step2Div.replaceChildren();
            const minRow1 = Math.min(sec3Cells.m11, sec3Cells.m12);
            const minRow2 = Math.min(sec3Cells.m21, sec3Cells.m22);
            const maxCol1 = Math.max(sec3Cells.m11, sec3Cells.m21);
            const maxCol2 = Math.max(sec3Cells.m12, sec3Cells.m22);

            step2Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Mínimos de Filas (España):" }, { tag: "br", text: "" },
                `- Ataque Centros: mín(${sec3Cells.m11}, ${sec3Cells.m12}) = ${minRow1}`, { tag: "br", text: "" },
                `- Remates: mín(${sec3Cells.m21}, ${sec3Cells.m22}) = ${minRow2}`, { tag: "br", text: "" },
                `➔ Maximin = ${sol.maximin.toFixed(1)}`
            ]));

            step2Div.appendChild(createMathParagraph([
                { tag: "strong", text: "Máximos de Columnas (Argentina):" }, { tag: "br", text: "" },
                `- Presión Física: máx(${sec3Cells.m11}, ${sec3Cells.m21}) = ${maxCol1}`, { tag: "br", text: "" },
                `- Quites Limpios: máx(${sec3Cells.m12}, ${sec3Cells.m22}) = ${maxCol2}`, { tag: "br", text: "" },
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
                    `- España (p) Centros: `, { tag: "strong", text: `p* = ${sol.p_opt.toFixed(3)} (${(sol.p_opt * 100).toFixed(1)}%)` }, { tag: "br", text: "" },
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
                const term1 = sec3Cells.m11 * sol.p_opt;
                const term2 = sec3Cells.m21 * (1 - sol.p_opt);
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "a" }, { tag: "sub", text: "11" }, "(", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ") + ",
                    { tag: "i", text: "a" }, { tag: "sub", text: "21" }, "(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${sec3Cells.m11.toFixed(1)}(${sol.p_opt.toFixed(3)}) + ${sec3Cells.m21.toFixed(1)}(${(1 - sol.p_opt).toFixed(3)})`, { tag: "br" },
                    " = ", `${term1.toFixed(2)} + ${term2.toFixed(2)}`, { tag: "br" },
                    " = ", { tag: "strong", text: sol.v.toFixed(2) }
                ];
            }

            const calcParagraph = createMathParagraph(calcParts);
            calcParagraph.className = "math-calc";

            step4Div.appendChild(createMathParagraph([
                { tag: "strong", text: `Valor del Juego: V = ${sol.v.toFixed(2)}` }
            ]));
            step4Div.appendChild(calcParagraph);

            let strategyExplanation = "";
            const pPct = (sol.p_opt * 100).toFixed(1);
            const pRestPct = ((1 - sol.p_opt) * 100).toFixed(1);
            const qPct = (sol.q_opt * 100).toFixed(1);
            const qRestPct = ((1 - sol.q_opt) * 100).toFixed(1);

            if (sol.hasSaddlePoint) {
                const A_opt_label = sol.p_opt === 1 ? "dar centros (A1)" : "probar remates directos (A2)";
                const B_opt_label = sol.q_opt === 1 ? "faltas tácticas (B1)" : "barridas/quites de balón (B2)";
                strategyExplanation = `España debe jugar la estrategia pura de ${A_opt_label} en un 100% de las veces, mientras que Argentina debe concentrar el 100% de su respuesta táctica en ${B_opt_label}.`;
            } else {
                strategyExplanation = `España debe alternar entre dar centros (A1) un ${pPct}% de las veces y probar remates directos (A2) en un ${pRestPct}%, mientras que Argentina debe distribuir su estrategia defensiva entre cometer faltas tácticas (B1) un ${qPct}% y realizar barridas/quites (B2) en un ${qRestPct}%.`;
            }

            step4Div.appendChild(createMathParagraph([
                sol.v > 0 ? "El dominio táctico favorece a España. " : "El dominio táctico favorece a Argentina. ",
                strategyExplanation
            ]));
        }

        drawGraph('sec3-graph', sec3Cells.m11, sec3Cells.m12, sec3Cells.m21, sec3Cells.m22, sol.p_opt, sol.v, "Probabilidad p (Ataque Centros)", "Pago Esperado (VE)", "VE(B1)", "VE(B2)");
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
                const term1 = f11 * sol.p_opt;
                const term2 = f21 * (1 - sol.p_opt);
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "f" }, { tag: "sub", text: "11" }, "(", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ") + ",
                    { tag: "i", text: "f" }, { tag: "sub", text: "21" }, "(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${f11.toFixed(1)}(${sol.p_opt.toFixed(3)}) + ${f21.toFixed(1)}(${(1 - sol.p_opt).toFixed(3)})`, { tag: "br" },
                    " = ", `${term1.toFixed(2)} + ${term2.toFixed(2)}`, { tag: "br" },
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
        const currentStep = sectionSteps[4].current;
        let rElimToPass = -1;
        let cElimToPass = -1;
        if (currentStep === 2) {
            rElimToPass = rowEliminated;
        } else if (currentStep >= 3) {
            rElimToPass = rowEliminated;
            cElimToPass = colEliminated;
        }
        updateSidebarStrikethrough(4, rElimToPass, cElimToPass);
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

            // (La tabla de la matriz reducida se omitió aquí para evitar redundancia con el widget lateral derecho)

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
                const term1 = f11 * sol.p_opt;
                const term2 = f21 * (1 - sol.p_opt);
                calcParts = [
                    { tag: "strong", text: "Cálculo: " }, { tag: "br" },
                    { tag: "i", text: "V" }, " = ", 
                    { tag: "i", text: "f" }, { tag: "sub", text: "11" }, "(", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ") + ",
                    { tag: "i", text: "f" }, { tag: "sub", text: "21" }, "(1 - ", { tag: "i", text: "p" }, { tag: "sup", text: "*" }, ")", { tag: "br" },
                    " = ", `${f11.toFixed(1)}(${sol.p_opt.toFixed(3)}) + ${f21.toFixed(1)}(${(1 - sol.p_opt).toFixed(3)})`, { tag: "br" },
                    " = ", `${term1.toFixed(2)} + ${term2.toFixed(2)}`, { tag: "br" },
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

            // Recortar texto largo de las etiquetas para el gráfico
            const shortRow0 = rowLabels[finalRows[0]].split(':')[1]?.trim() || rowLabels[finalRows[0]];
            const shortCol0 = colLabels[finalCols[0]].split(':')[1]?.trim() || colLabels[finalCols[0]];
            const shortCol1 = colLabels[finalCols[1]].split(':')[1]?.trim() || colLabels[finalCols[1]];

            drawGraph('sec5-graph', f11, f12, f21, f22, sol.p_opt, sol.v, `Probabilidad p (${shortRow0})`, "Diferencial Cuota (%)", `VE(${shortCol0})`, `VE(${shortCol1})`);

        } else {
            step3Div.appendChild(document.createTextNode("La matriz no se pudo reducir exactamente a 2x2. Modifica los números iniciales."));
            const svg = document.getElementById('sec5-graph');
            if (svg) svg.replaceChildren(); // Limpiar el gráfico si no es 2x2
        }
        const currentStep = sectionSteps[5].current;
        let rElimToPass = -1;
        let cElimToPass = -1;
        if (currentStep >= 2) {
            rElimToPass = rowEliminated;
            cElimToPass = colEliminated;
        }
        updateSidebarStrikethrough(5, rElimToPass, cElimToPass);
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
    
    // Listeners para los inputs de estadísticas en la parte izquierda
    const sec3StatInputs = ['sec3-crs', 'sec3-sot', 'sec3-fls', 'sec3-tklw'];
    sec3StatInputs.forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => {
            sec3IsFictional = false;
            
            const crs = parseFloat(document.getElementById('sec3-crs')?.value) || 27;
            const sot = parseFloat(document.getElementById('sec3-sot')?.value) || 12;
            const fls = parseFloat(document.getElementById('sec3-fls')?.value) || 23;
            const tklw = parseFloat(document.getElementById('sec3-tklw')?.value) || 16;

            sec3Stats.crs = crs;
            sec3Stats.sot = sot;
            sec3Stats.fls = fls;
            sec3Stats.tklw = tklw;

            sec3Cells.m11 = crs - fls;
            sec3Cells.m12 = crs - tklw;
            sec3Cells.m21 = sot - fls;
            sec3Cells.m22 = sot - tklw;

            calculateSection3();
        });
    });

    document.querySelectorAll('.sec3-input').forEach(i => {
        i.addEventListener('input', (e) => {
            if (sectionSteps[3].current > 1) {
                sec3IsFictional = false;
                const id = e.target.id;
                const val = parseFloat(e.target.value) || 0;
                if (id === 'sec3-m11') sec3Cells.m11 = val;
                if (id === 'sec3-m12') sec3Cells.m12 = val;
                if (id === 'sec3-m21') sec3Cells.m21 = val;
                if (id === 'sec3-m22') sec3Cells.m22 = val;
                calculateSection3();
            }
        });
    });

    document.querySelectorAll('.sec4-input').forEach(i => i.addEventListener('input', calculateSection4));
    document.querySelectorAll('.sec5-input').forEach(i => i.addEventListener('input', calculateSection5));

    // Agregar listeners a los botones de restablecer
    document.getElementById('reset-sec2-btn')?.addEventListener('click', () => {
        document.getElementById('sec2-m11').value = 1;
        document.getElementById('sec2-m12').value = 6;
        document.getElementById('sec2-m21').value = 15;
        document.getElementById('sec2-m22').value = 0;
        calculateSection2();
        const mcSummary = document.getElementById('sec2-mc-summary');
        if (mcSummary) mcSummary.replaceChildren();
        const mcGraph = document.getElementById('sec2-mc-graph');
        if (mcGraph) mcGraph.replaceChildren();
    });

    document.getElementById('sec2-mc-run-btn')?.addEventListener('click', () => {
        calculateSection2(); // asegura que sec2LastState refleje la matriz actual
        runMonteCarloSection2(500);
    });

    document.getElementById('sec2-mc-reset-btn')?.addEventListener('click', () => {
        const mcSummary = document.getElementById('sec2-mc-summary');
        if (mcSummary) mcSummary.replaceChildren();
        const mcGraph = document.getElementById('sec2-mc-graph');
        if (mcGraph) mcGraph.replaceChildren();
    });

    document.getElementById('reset-sec3-btn')?.addEventListener('click', () => {
        sec3IsFictional = false;
        sec3Stats.crs = 27;
        sec3Stats.sot = 12;
        sec3Stats.fls = 23;
        sec3Stats.tklw = 16;

        sec3Cells.m11 = 4;
        sec3Cells.m12 = 11;
        sec3Cells.m21 = -11;
        sec3Cells.m22 = -4;

        const crsIn = document.getElementById('sec3-crs');
        const sotIn = document.getElementById('sec3-sot');
        const flsIn = document.getElementById('sec3-fls');
        const tklwIn = document.getElementById('sec3-tklw');

        if (crsIn) crsIn.value = 27;
        if (sotIn) sotIn.value = 12;
        if (flsIn) flsIn.value = 23;
        if (tklwIn) tklwIn.value = 16;

        calculateSection3();
    });

    document.getElementById('fictional-sec3-btn')?.addEventListener('click', () => {
        sec3IsFictional = true;
        sec3Cells.m11 = 8;
        sec3Cells.m12 = 46;
        sec3Cells.m21 = 68;
        sec3Cells.m22 = 15;
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
    for (let s = 1; s <= 5; s++) {
        updateStepUI(s);
    }
    calculateAll();
});
