### Ejercicio: Teoría de Juegos — Final España vs. Argentina

En el marco de la final entre **España** (Atacante) y **Argentina** (Defensor), los cuerpos técnicos analizaron los registros estadísticos consolidados del partido para determinar el balance de efectividad táctica según las variables del juego.

Las alternativas tácticas priorizadas por cada selección son:

**España — Estrategias Ofensivas ($A$):**
* $A_1$: **Ataque Amplio por Bandas:** Centros al área rival (`Crs` $= 27$).
* $A_2$: **Juego Directo / Tiros a Puerta:** Remates a puerta (`SoT` $= 12$).

**Argentina — Estrategias Defensivas ($B$):**
* $B_1$: **Presión Intensa y Marca Física:** Faltas cometidas para cortar el avance (`Fls` $= 23$).
* $B_2$: **Quites Limpios y Bloque Cauteloso:** Barridas y entradas ganadas (`TklW` $= 16$).

La matriz representa el **balance táctico neto** para España según la interacción de decisiones:

| | $B_1$: Presión Física | $B_2$: Quites / Repliegue |
| :--- | :---: | :---: |
| **$A_1$**: Ataque por Bandas | $+4$ | $+11$ |
| **$A_2$**: Remates a Puerta | $-11$ | $-4$ |

---

#### Preguntas:

* **(a)** Verifique aplicando el criterio de *maximin* y *minimax* si el juego cuenta con un **punto de silla** en estrategias puras. *(3 pts)*
* **(b)** Resuelva el juego en **estrategias mixtas**: encuentre las probabilidades óptimas para ambos entrenadores ($\sigma_A = (p, 1-p)$ y $\sigma_B = (q, 1-q)$). *(8 pts)*
* **(c)** Calcule el **valor del juego** ($V$) e interprete el resultado táctico en el contexto del partido. *(4 pts)*