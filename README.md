# Teoría de Juegos: Guía Interactiva y Resoluciones Dinámicas

Una aplicación web interactiva y visual diseñada para explorar los conceptos fundamentales de la **Teoría de Juegos de Suma Cero**, permitiendo a los usuarios modificar matrices y observar los cálculos matemáticos, gráficos de intersección y reducciones por dominancia en tiempo real.

El proyecto está diseñado con una estética estilo boceto a mano alzada (*hand-drawn sketch-note*) inspirada en apuntes de cuaderno escolar con stickers, doodles y tipografías manuscritas.

## 📝 Introducción

En la toma de decisiones clásica, el entorno suele ser pasivo. Sin embargo, en la **Teoría de Juegos** nos enfrentamos a oponentes inteligentes que actúan bajo su propio interés, afectando directamente nuestros resultados. Esta herramienta facilita la comprensión intuitiva y formal de cómo modelar y resolver estos conflictos estratégicos utilizando criterios conservadores y aleatorizados.

## 📚 Temas y Contenido del Proyecto

El simulador está organizado en 5 secciones temáticas interactivas:

1. **Introducción y Conceptos Clave**
   - Concepto de conflicto racional.
   - Juegos de Suma Cero y la matriz de pagos.
   - Criterios Maximin (Jugador Filas) y Minimax (Jugador Columnas).
   - Identificación del Punto de Silla (Equilibrio de Nash en estrategias puras).
   - Fundamentos de Estrategias Mixtas y la fórmula de valor del juego esperada:
     $$V = a_{11}(p^*) + a_{21}(1 - p^*)$$

2. **Clásico Paceño (Bolívar vs. The Strongest)**
   - Planteamiento de un juego táctico de fútbol 2x2.
   - Cálculo del valor óptimo de estrategias mixtas.
   - Gráfico dinámico de intersección de rectas de pago esperado generado en SVG.

3. **Final del Mundial (España vs. Argentina)**
   - Caso práctico y deportivo basado en estadísticas reales de FBref del encuentro de la Copa del Mundo.
   - Evaluación interactiva de puntos de equilibrio.
   - Flexibilidad para experimentar con valores reales u optimizaciones simuladas.

4. **Reducción Interactiva de Matrices (3x3)**
   - Simulador general donde puedes ingresar cualquier matriz de 3x3.
   - Algoritmo visual paso a paso de dominancia de filas (Jugador A) y dominancia de columnas (Jugador B) hasta obtener la matriz reducida.

5. **Pumakatari vs. Minibuses (Caso de Transporte)**
   - Modelado de la competencia por la cuota de mercado en rutas urbanas paceñas.
   - Reducción dinámica por dominancia de una matriz 3x3 y resolución mediante estrategias mixtas del juego resultante.

## 👥 Equipo de Trabajo

* **Sección 1:** Silva Condori Gina Liz
* **Sección 2:** Flores Tapia Ruddy
* **Sección 3:** Muñoz Callisaya Gabriel Marcelo
* **Sección 4:** Toledo Lopez Milton Josue
* **Sección 5:** Vasquez Condori Fioela Katherine

---

## 🛠️ Tecnologías Utilizadas

* **HTML5** (Estructura semántica)
* **CSS3** (Diseño totalmente responsive con cuadrícula de cuaderno e ilustraciones hechas con SVG)
* **JavaScript (Vanilla)** (Cálculos dinámicos de teoría de juegos, renderizado interactivo sin dependencias y gráficos SVG interactivos)
* **Google Fonts** (Fuentes manuscritas y monoespaciadas para fórmulas)
