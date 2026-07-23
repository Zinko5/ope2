### 2.5.1 Caso: clásico paceño Bolívar vs. The Strongest

#### El clásico del fútbol paceño
En el clásico entre **Club Bolívar** (que juega a la ofensiva) y **The Strongest** (que defiende), el entrenador de Bolívar debe decidir cómo atacar y el de The Strongest cómo defenderse. Las estrategias disponibles son:

**Bolívar (ofensiva):**
* $a_1$: Ataque por **bandas** (desbordes laterales).
* $a_2$: Ataque por el **centro** (pases filtrados entre líneas).

**The Strongest (defensa):**
* $b_1$: Defensa concentrada en **bandas**.
* $b_2$: Defensa concentrada en el **centro**.

El cuerpo técnico de Bolívar estima las yardas promedio ganadas por jugada según la combinación de estrategias:

---

**Tabla 2.8:** Yardas promedio ganadas por Bolívar según combinación de estrategias.

| | Defensa bandas $b_1$ | Defensa centro $b_2$ | Mín. fila |
| :--- | :---: | :---: | :---: |
| **Ataque bandas $a_1$** | $1$ | $6$ | **1** $\leftarrow$ maximin |
| **Ataque centro $a_2$** | $15$ | $0$ | $0$ |
| **Máx. columna** | $15$ | **6** | |
| | | $\uparrow$ minimax | |