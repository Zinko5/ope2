<u>CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS 2.4 INTRODUCCIÓN A LA TEORÍA DE JUEGOS</u>

**Importante**

> El análisis de utilidad introduce subjetividad: diferentes tomadores de decisiones con el mismo problema pueden llegar a conclusiones distintas, y eso no es un defecto del método sino una característica deseable. Diferentes personas *deben* decidir distinto ante el mismo problema si sus circunstancias financieras y psicológicas son distintas.

## 2.4 Introducción a la teoría de juegos

Hasta aquí el tomador de decisiones enfrentaba a la *naturaleza*: una entidad sin intencionalidad que producía estados con ciertas probabilidades. La teoría de juegos generaliza el marco a situaciones donde la "incertidumbre" proviene de otro tomador de decisiones racional y consciente.

**Juego de suma cero para dos personas**

> Un **juego de suma cero para dos personas** es una situación estratégica con dos jugadores (*Jugador A* y *Jugador B*), cada uno con un conjunto finito de estrategias disponibles, en la que la ganancia de un jugador es exactamente igual a la pérdida del otro: $\text{Pago}_A + \text{Pago}_B = 0$ para toda combinación de estrategias.

Los jugadores eligen sus estrategias *simultáneamente y sin conocer la elección del otro*. La combinación de estrategias determina el pago. Tradicionalmente se presenta la matriz de pagos desde el punto de vista del Jugador A: entradas positivas son ganancias para A (pérdidas para B) y entradas negativas son pérdidas para A (ganancias para B).

## 2.4.1 Competencia por cuota de mercado

**Entel Móvil vs. Tigo Bolivia**

> Dos de las principales operadoras de telefonía móvil en Bolivia, **Entel Móvil** y **Tigo Bolivia**, compiten por cuota de mercado. Para el próximo año fiscal, cada empresa planea una estrategia comercial y considera tres opciones:
>

> * Estrategia 1: **Aumentar publicidad** (campañas nacionales, digitales y televisivas).

> * Estrategia 2: **Descuentos en planes postpago** para captar clientes de alto consumo.

> * Estrategia 3: **Ampliar cobertura rural** (departamentos con menor penetración).
>

> Los equipos de inteligencia competitiva de Entel estimaron la matriz de pagos siguiente (cambios en puntos porcentuales de cuota de mercado para Entel). Lo que Entel gana, Tigo lo pierde. Denotamos $a_i$ a las estrategias de Entel y $b_j$ a las de Tigo.

BAYESMATH • <page_number>35</page_number>

CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS 2.4. INTRODUCCIÓN A LA TEORÍA DE JUEGOS

Tabla 2.5: Matriz de pagos (cambio en cuota de mercado de Entel, en puntos porcentuales).

<table>
  <thead>
    <tr>
        <th> </th>
        <th colspan="3">Tigo Bolivia</th>
    </tr>
    <tr>
        <th><strong>Entel Móvil</strong></th>
        <th>Publicidad, $b_1$</th>
        <th>Descuentos, $b_2$</th>
        <th>Cobertura, $b_3$</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>Publicidad, $a_1$</td>
        <td>4</td>
        <td>3</td>
        <td>2</td>
    </tr>
    <tr>
        <td>Descuentos, $a_2$</td>
        <td>$-1$</td>
        <td>4</td>
        <td>1</td>
    </tr>
    <tr>
        <td>Cobertura, $a_3$</td>
        <td>5</td>
        <td>$-2$</td>
        <td>0</td>
    </tr>
  </tbody>
</table>

Interpretación rápida: si ambas empresas aumentan publicidad, Entel gana 4 puntos de cuota. Si Entel hace descuentos pero Tigo aumenta publicidad, Entel *pierde* 1 punto. Si Entel amplía cobertura y Tigo hace descuentos, Tigo gana 2 puntos (Entel pierde 2).

## 2.4.2 El razonamiento maximin y minimax

Cada jugador razona con el supuesto de que el adversario elegirá la mejor estrategia para *sí mismo*, no la peor para él. Esto lleva a comportamientos defensivos y prudentes.

**Desde el punto de vista de Entel (Jugador A).** Entel quiere maximizar su pago. Para cada estrategia propia identifica el *peor resultado posible* (mínimo de fila), porque debe protegerse contra la peor respuesta de Tigo. Luego elige la estrategia cuyo peor resultado es el mayor: el criterio **maximin**.

Tabla 2.6: Cálculo maximin para Entel.

<table>
  <thead>
    <tr>
        <th> </th>
        <th>$b_1$</th>
        <th>$b_2$</th>
        <th>$b_3$</th>
        <th><strong>Mín. fila</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>$a_1$</td>
        <td>4</td>
        <td>3</td>
        <td>2</td>
        <td><strong>2</strong> $\leftarrow$ maximin</td>
    </tr>
    <tr>
        <td>$a_2$</td>
        <td>$-1$</td>
        <td>4</td>
        <td>1</td>
        <td>$-1$</td>
    </tr>
    <tr>
        <td>$a_3$</td>
        <td>5</td>
        <td>$-2$</td>
        <td>0</td>
        <td>$-2$</td>
    </tr>
  </tbody>
</table>

Entel selecciona $a_1$ (publicidad), garantizándose al menos 2 puntos de ganancia en cuota de mercado pase lo que pase.

**Desde el punto de vista de Tigo (Jugador B).** Tigo quiere minimizar el pago de Entel (es decir, minimizar su propia pérdida). Para cada estrategia propia identifica el *peor resultado posible para sí*, que corresponde al *máximo de columna* (porque las entradas son pagos para Entel). Luego elige la estrategia cuyo máximo es el menor: el criterio **minimax**.

BAYESMATH • <page_number>36</page_number>

<u>CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS 2.4. INTRODUCCIÓN A LA TEORÍA DE JUEGOS</u>

Tabla 2.7: Cálculo minimax para Tigo.

<table>
  <thead>
    <tr>
        <th> </th>
        <th>b1</th>
        <th>b2</th>
        <th>b3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>a1</td>
        <td>4</td>
        <td>3</td>
        <td>2</td>
    </tr>
    <tr>
        <td>a2</td>
        <td>-1</td>
        <td>4</td>
        <td>1</td>
    </tr>
    <tr>
        <td>a3</td>
        <td>5</td>
        <td>-2</td>
        <td>0</td>
    </tr>
    <tr>
        <td><strong>Máx. columna</strong></td>
        <td>5</td>
        <td>4</td>
        <td><strong>2</strong> ← minimax</td>
    </tr>
  </tbody>
</table>

Tigo selecciona $b_3$ (cobertura rural), garantizándose que Entel no gane más de 2 puntos.

## 2.4.3 Estrategia pura y punto de equilibrio

> **Estrategia pura y punto de equilibrio**
> Un juego de suma cero para dos personas tiene una **solución de estrategia pura** si

$$ \max_{i} \min_{j} V_{ij} = \min_{j} \max_{i} V_{ij} . $$

> El valor común es el **valor del juego**, y la combinación de estrategias $(a_{i^*}, b_{j^*})$ donde se alcanza es un **punto de equilibrio**: ningún jugador puede mejorar su resultado cambiando unilateralmente su estrategia.

En el caso Entel-Tigo, maximin = 2 = minimax. Existe un punto de equilibrio en $(a_1, b_3)$: Entel aumenta publicidad, Tigo amplía cobertura rural, y Entel gana 2 puntos de cuota. El valor del juego es +2 (favorable a Entel).

> **Interpretación**
> Verifique la estabilidad del equilibrio. Si Tigo, conociendo la estrategia $a_1$ de Entel, cambia de $b_3$ a $b_1$, el pago para Entel sube a 4 (Tigo pierde más). Si cambia a $b_2$, sube a 3. Tigo no tiene incentivo a desviarse. Análogamente, si Entel, conociendo $b_3$, cambia de $a_1$ a $a_2$, el pago baja a 1. Si cambia a $a_3$, baja a 0. Entel tampoco tiene incentivo a desviarse. Esto es la esencia de un equilibrio: estabilidad frente a desviaciones unilaterales.

> **Procedimiento para identificar una estrategia pura**
> 

> 1. Calcular el mínimo de cada fila (jugador A).
>
> 

> 2. Identificar el máximo de los mínimos: valor *maximin*, estrategia óptima de A.
>
> 

> 3. Calcular el máximo de cada columna (jugador B).
>
> 

> 4. Identificar el mínimo de los máximos: valor *minimax*, estrategia óptima de B.
>
> 

> 5. Si maximin = minimax, existe una solución pura; el valor común es el valor del juego. Si no, el juego requiere estrategia mixta.

BAYESMATH • <page_number>37</page_number>

CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS   2.5. JUEGOS DE ESTRATEGIA MIXTA

<mark>**En palabras simples**</mark>

> Piense en el **juego del cacho boliviano**: dos jugadores, cada uno tira dados a ciegas, esperando que el otro no tenga mejor mano. La teoría de juegos formaliza ese razonamiento paranoico pero útil: "si tiro esto, ¿qué hará el otro, pensando en contrarrestarme?" El maximin es la voz del jugador cauto que se dice: "lo peor que me puede pasar con esta jugada es perder tres puntos, mejor que los cinco que podría perder con la otra". El punto de equilibrio es el momento del juego en el que ningún jugador tiene una jugada mejor escondida bajo la manga. Ambos han revelado sus mejores defensas y no hay sorpresas.

## 2.5 Juegos de estrategia mixta

No todos los juegos tienen solución de estrategia pura. Cuando maximin $\neq$ minimax, los jugadores no pueden optimizar usando una sola estrategia fija: cualquier elección pura queda expuesta a ser explotada por el adversario. En esos casos, la solución óptima consiste en *aleatorizar* entre estrategias con probabilidades específicas. Es una *estrategia mixta*.

### 2.5.1 Caso: clásico paceño Bolívar vs. The Strongest

<mark>**El clásico del fútbol paceño**</mark>

En el clásico entre **Club Bolívar** (que juega a la ofensiva) y **The Strongest** (que defiende), el entrenador de Bolívar debe decidir cómo atacar y el de The Strongest cómo defenderse. Las estrategias disponibles son:

**Bolívar (ofensiva):**

* $a_1$: Ataque por **bandas** (desbordes laterales).

* $a_2$: Ataque por el **centro** (pases filtrados entre líneas).

**The Strongest (defensa):**

* $b_1$: Defensa concentrada en **bandas**.

* $b_2$: Defensa concentrada en el **centro**.

El cuerpo técnico de Bolívar estima las metros promedio ganadas por jugada según la combinación de estrategias:

BAYESMATH • <page_number>38</page_number>

CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS    2.5. JUEGOS DE ESTRATEGIA MIXTA

Tabla 2.8: Yardas promedio ganadas por Bolívar según combinación de estrategias.

<table>
  <thead>
    <tr>
        <th> </th>
        <th>Defensa bandas $b_1$</th>
        <th>Defensa centro $b_2$</th>
        <th><strong>Mín. fila</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>Ataque bandas $a_1$</td>
        <td>1</td>
        <td>6</td>
        <td><strong>1</strong> $\leftarrow$ maximin</td>
    </tr>
    <tr>
        <td>Ataque centro $a_2$</td>
        <td>15</td>
        <td>0</td>
        <td>0</td>
    </tr>
    <tr>
        <td><strong>Máx. columna</strong></td>
        <td>15</td>
        <td><strong>6</strong></td>
        <td> </td>
    </tr>
    <tr>
        <td> </td>
        <td> </td>
        <td>$\uparrow$ minimax</td>
        <td> </td>
    </tr>
  </tbody>
</table>

El valor maximin es 1 y el minimax es 6. Como $1 \neq 6$, **no existe solución de estrategia pura**. El juego requiere estrategia mixta.

### 2.5.2 Lógica de la aleatorización

Intuitivamente, si Bolívar siempre ataca por el centro, The Strongest lo descubrirá y defenderá siempre el centro: Bolívar se queda en 0 metros por jugada. Si siempre ataca por las bandas, The Strongest defenderá bandas y Bolívar avanzará apenas 1 metro. La única manera de obtener ganancia esperada decente es *ser impredecible*: aleatorizar entre las dos opciones con probabilidades cuidadosamente calculadas.

### 2.5.3 Cálculo algebraico de la estrategia mixta de Bolívar

Sea $p$ la probabilidad de que Bolívar ataque por bandas (y $1 - p$ la de que ataque por el centro). Calculamos el pago esperado de Bolívar según cada elección del rival.

**Si The Strongest defiende bandas ($b_1$):**

$$ VE(\text{metros} \mid b_1) = 1p + 15(1 - p) = 15 - 14p. $$

**Si The Strongest defiende centro ($b_2$):**

$$ VE(\text{metros} \mid b_2) = 6p + 0(1 - p) = 6p. $$

La probabilidad óptima $p^*$ es aquella que *iguala* los dos pagos esperados. De esa forma, The Strongest resulta indiferente entre sus dos defensas y no puede mejorar cambiando la suya:

$$ 15 - 14p = 6p \implies 20p = 15 \implies p^* = 0.75. $$

Bolívar debe atacar por las bandas el 75 % del tiempo y por el centro el 25 %.

**Valor del juego.** Sustituyendo:

$$ V = 1(0.75) + 15(0.25) = 4.5 \text{ metros por jugada.} $$

BAYESMATH • 39

CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS

2.5. JUEGOS DE ESTRATEGIA MIXTA

### 2.5.4 Cálculo para The Strongest

Sea $q$ la probabilidad de que The Strongest defienda bandas. El pago esperado de Bolívar según su propia elección:

$$VE(\text{metros} \mid a_1) = 1q + 6(1 - q) = 6 - 5q$$

$$VE(\text{metros} \mid a_2) = 15q + 0(1 - q) = 15q$$

Igualando:

$$6 - 5q = 15q \implies 20q = 6 \implies q^* = 0.30.$$

The Strongest debe defender bandas el 30% del tiempo y el centro el 70%. El valor del juego confirma las 4.5 metros esperados por jugada.

> 

> **Solución del clásico paceño**
> 

> **Estrategia óptima de Bolívar:** atacar por bandas con probabilidad 0.75 y por centro con probabilidad 0.25.
> 

> **Estrategia óptima de The Strongest:** defender bandas con probabilidad 0.30 y centro con probabilidad 0.70.
> 

> **Valor del juego:** 4.5 metros por jugada esperados (favorable a la ofensiva de Bolívar).

> 

> **En palabras simples**
> 

> Las estrategias mixtas son la formalización matemática de una verdad folclórica: **“el que juega siempre igual, pierde”**. Como el vendedor de empanadas en la terminal que varía su ruta para no ser predecible, o la maestra que alterna preguntas rutinarias con preguntas sorpresa para evitar que los estudiantes se preparen solo para un estilo. El adversario, si es inteligente, aprenderá cualquier patrón. La única defensa es convertirte en un proceso verdaderamente aleatorio con frecuencias calibradas. Y lo fascinante es que esas frecuencias óptimas no son 50-50: dependen de la estructura específica de pagos.

### 2.5.5 Reducción por dominancia en juegos grandes

Cuando el juego supera la dimensión $2 \times 2$ y no hay estrategia pura, el cálculo algebraico directo no es suficiente. La herramienta clave es la **reducción por estrategias dominadas**.

> 

> **Estrategia dominada**
> 

> La estrategia $a_i$ **domina** a $a_k$ si $V_{ij} \geq V_{kj}$ para toda columna $j$, con desigualdad estricta en al menos una columna. Análogamente para estrategias de B (con el sentido invertido de las desigualdades, ya que B quiere pagos pequeños).
> 

> Una estrategia dominada *nunca* se usa en la solución óptima y puede eliminarse del juego.

BAYESMATH • <page_number>40</page_number>

CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS 2.5. JUEGOS DE ESTRATEGIA MIXTA

### 2.5.6 Ejemplo: juego $3 \times 3$ reducido a $2 \times 2$

Considere el siguiente juego genérico sin solución pura:

Tabla 2.9: Juego $3 \times 3$ sin estrategia pura.

<table>
  <thead>
    <tr>
        <th> </th>
        <th>b1</th>
        <th>b2</th>
        <th>b3</th>
        <th>Mín. fila</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>a1</td>
        <td>0</td>
        <td>-1</td>
        <td>2</td>
        <td>-1 ← maximin</td>
    </tr>
    <tr>
        <td>a2</td>
        <td>5</td>
        <td>4</td>
        <td>-3</td>
        <td>-3</td>
    </tr>
    <tr>
        <td>a3</td>
        <td>2</td>
        <td>3</td>
        <td>-4</td>
        <td>-4</td>
    </tr>
    <tr>
        <td><strong>Máx. col.</strong></td>
        <td>5</td>
        <td>4</td>
        <td>2</td>
        <td> </td>
    </tr>
    <tr>
        <td> </td>
        <td> </td>
        <td> </td>
        <td>↑ minimax</td>
        <td> </td>
    </tr>
  </tbody>
</table>

Maximin $= -1 \neq 2 =$ minimax: no hay estrategia pura.

**Paso 1: eliminar estrategias dominadas del jugador A.** Comparando $a_2$ y $a_3$ fila por fila: en $b_1$, $5 > 2$; en $b_2$, $4 > 3$; en $b_3$, $-3 > -4$. Por tanto $a_2$ domina a $a_3$. A nunca usará $a_3$. El juego reducido es:

<table>
  <thead>
    <tr>
        <th> </th>
        <th>b1</th>
        <th>b2</th>
        <th>b3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>a1</td>
        <td>0</td>
        <td>-1</td>
        <td>2</td>
    </tr>
    <tr>
        <td>a2</td>
        <td>5</td>
        <td>4</td>
        <td>-3</td>
    </tr>
  </tbody>
</table>

**Paso 2: eliminar estrategias dominadas del jugador B.** B quiere valores *pequeños*. Comparando $b_1$ y $b_2$: en $a_1$, $-1 < 0$; en $a_2$, $4 < 5$. $b_2$ domina a $b_1$: $b_2$ produce valores menores o iguales que $b_1$ contra cualquier estrategia de A. Eliminamos $b_1$:

<table>
  <thead>
    <tr>
        <th> </th>
        <th>b2</th>
        <th>b3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>a1</td>
        <td>-1</td>
        <td>2</td>
    </tr>
    <tr>
        <td>a2</td>
        <td>4</td>
        <td>-3</td>
    </tr>
  </tbody>
</table>

El juego se redujo a $2 \times 2$. Ahora se aplica el procedimiento algebraico de la subsección anterior para encontrar las probabilidades óptimas.

> **Procedimiento general para juegos de suma cero 2 personas**
> 1. Aplicar maximin/minimax. Si coinciden, existe solución pura y se termina.
> 2. Si no coinciden y el juego es mayor que $2 \times 2$, buscar estrategias dominadas y eliminarlas iterativamente.
> 3. Si el juego se reduce a $2 \times 2$, aplicar el procedimiento algebraico para encontrar

BAYESMATH • <page_number>41</page_number>

CAPÍTULO 2. UTILIDAD Y TEORÍA DE JUEGOS 2.6. RESUMEN DEL CAPÍTULO

probabilidades mixtas óptimas.

4. Si el juego no se reduce a $2 \times 2$, usar programación lineal (fuera del alcance de este capítulo).

## 2.5.7 Extensiones y panorama

La teoría de juegos se extiende mucho más allá de los juegos de suma cero para dos personas. Algunas extensiones relevantes:

* **Juegos de suma constante**: los pagos suman una constante no nula (competencia por un mercado de tamaño fijo pero con beneficios brutos positivos).

* **Juegos de $n$ personas**: más de dos jugadores, con posibilidad de coaliciones.

* **Juegos cooperativos**: los jugadores pueden comunicarse y firmar acuerdos vinculantes.

* **Juegos no cooperativos**: con concepto de *equilibrio de Nash*, que generaliza el punto de equilibrio de suma cero a contextos donde los pagos no se compensan. Por este trabajo John Nash compartió el Premio Nobel de Economía en 1994.

* **Juegos dinámicos e información incompleta**: modelan situaciones secuenciales con información asimétrica, fundamentales en economía industrial, subastas y mecanismos de regulación.

**Interpretación**

La teoría de juegos ha encontrado aplicaciones extraordinarias en Bolivia y en la región: diseño de subastas del espectro radioeléctrico por la ATT, estrategias de negociación del Gobierno con empresas petroleras, competencia entre aerolíneas domésticas, fijación de precios entre cadenas de supermercados, y en los últimos años, modelado del comportamiento estratégico en mercados cambiarios informales. Todos esos contextos comparten la estructura esencial: múltiples actores racionales que eligen simultáneamente, con el pago de cada uno dependiendo de las elecciones de los demás.

## 2.6 Resumen del capítulo

**Mapa conceptual**

* **Utilidad** extiende el análisis de decisiones al tomar en cuenta la actitud del tomador frente al riesgo y las consecuencias no monetarias.

* Se construye mediante *loterías de referencia* y *probabilidades de indiferencia*, con el mejor y peor resultado anclados a utilidades arbitrarias.

* El criterio de *utilidad esperada* puede recomendar decisiones distintas al valor mone-

BAYESMATH • 42
<page_number>42</page_number>