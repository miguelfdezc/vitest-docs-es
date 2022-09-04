---
outline: deep
---

# Referencia de la API

Los siguientes tipos se utilizan en las definiciones de tipo a continuación

```ts
type Awaitable<T> = T | PromiseLike<T>;
type TestFunction = () => Awaitable<void>;
```

Cuando una función de prueba retorna una promesa, el runner esperará hasta que esté resuelta para colectar las expectativas asíncronas. Si la promesa es rechazada, la prueba fallará.

::: tip
En Jest, `TestFunction` puede ser también del tipo `(done: DoneCallback) => void`. Si se utiliza esta forma, la prueba no finalizará hasta que `done` sea llamado. Se puede lograr lo mismo utilizando una función `async`, ver la [Guía de Migración - sección del callback Done](../guide/migration#done-callback).
:::

## test

- **Tipo:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **Alias:** `it`

  `test` define un set de expectativas relacionadas. Recibe el nombre de la prueba y una función que contiene las expectativas a probar.

  Opcionalmente, se le puede proveer un tiempo de espera (en milisegundos) para especificar cuanto esperar antes de terminar. El tiempo por defecto es de 5 segundos, y puede ser configurado globalmente con [testTimeout](/config/#testtimeout)

  ```ts
  import { expect, test } from "vitest";

  test("debería funcionar como se espera", () => {
    expect(Math.sqrt(4)).toBe(2);
  });
  ```

### test.skip

- **Tipo:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **Alias:** `it.skip`

  En caso de querer omitir algunas pruebas, pero sin tener que borrar el código por el motivo que sea, se puede utilizar `test.skip` para evitar correrlas.

  ```ts
  import { assert, test } from "vitest";

  test.skip("prueba omitida", () => {
    // Prueba omitida, no hay error
    assert.equal(Math.sqrt(4), 3);
  });
  ```

### test.skipIf

- **Tipo:** `(condition: any) => Test`
- **Alias:** `it.skipIf`

  En algunos casos se puede querer correr pruebas múltiples veces bajo diferentes entornos, y algunas pruebas pueden ser específicas de cierto entorno. En vez de envolver las pruebas con `if`, se puede utilizar `test.skipIf` para omitir ciertas pruebas cuando la condición sea verdadera.

  ```ts
  import { assert, test } from "vitest";

  const isDev = process.env.NODE_ENV === "development";

  test.skipIf(isDev)("test sólo de producción", () => {
    // esta prueba sólo corre en producción
  });
  ```

### test.runIf

- **Tipo:** `(condition: any) => Test`
- **Alias:** `it.runIf`

El opuesto de [test.skipIf](#testskipif).

```ts
import { assert, test } from "vitest";

const isDev = process.env.NODE_ENV === "development";

test.runIf(isDev)("prueba sólo de desarrollo", () => {
  // esta prueba sólo corre en desarrollo
});
```

### test.only

- **Tipo:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **Alias:** `it.only`

  Se utiliza `test.only` para correr solo ciertas pruebas dentro de una serie. Esto es muy útil a la hora de depurar.

  Opcionalmente, se le puede proveer un tiempo de espera (en milisegundos) para especificar cuanto esperar antes de terminar. El tiempo por defecto es de 5 segundos, y puede ser configurado globalmente con [testTimeout](/config/#testtimeout)

  ```ts
  import { assert, test } from "vitest";

  test.only("test", () => {
    // Sólo esta prueba (y otras marcas con only) corren
    assert.equal(Math.sqrt(4), 2);
  });
  ```

  A veces es muy útil correr `only` para ejecutar sólo algunas pruebas de un archivo en particular, ignorando todo el resto de las pruebas de una serie, lo cual puede contaminar el resultado final.

  Para este caso se puede correr el comando `vitest` con el archivo específico que contiene la prueba.

  ```
  # vitest interesting.test.ts
  ```

### test.concurrent

- **Tipo** `(name: string, fn: TestFunction, timeout?: number) => void`
- **Alias:** `it.concurrent`

  `test.concurrent` marca las pruebas consecutivas para ser ejecutadas en parelelo. Recibe como parámetro el nombre de la prueba, una función asíncrona con las pruebas a colectar, y un tiempo de espera opcional (en milisegundos).

  ```ts
  import { describe, test } from "vitest";

  // The two tests marked with concurrent will be run in parallel
  describe("serie", () => {
    test("prueba serial", async () => {
      /* ... */
    });
    test.concurrent("prueba concurrente 1", async () => {
      /* ... */
    });
    test.concurrent("prueba concurrente 2", async () => {
      /* ... */
    });
  });
  ```

  `test.skip`, `test.only`, y `test.todo` funcionan con pruebas concurrentes. Todas las siguientes combinaciones son válidas:

  ```ts
  test.concurrent(/* ... */);
  test.skip.concurrent(/* ... */); // o test.concurrent.skip(/* ... */)
  test.only.concurrent(/* ... */); // o test.concurrent.only(/* ... */)
  test.todo.concurrent(/* ... */); // o test.concurrent.todo(/* ... */)
  ```

  Cuando se utilizan instantáneas (snapshots) con pruebas asíncronas concurrentes, debido a limitaciones de Javascript, se necesita utilizar la función `expect` desde el [Test Context](/guide/test-context.md) para asegurar que la prueba correcta esté siendo detectada.

  ```ts
  test.concurrent("prueba 1", async ({ expect }) => {
    expect(foo).toMatchSnapshot();
  });
  test.concurrent("prueba 2", async ({ expect }) => {
    expect(foo).toMatchSnapshot();
  });
  ```

### test.todo

- **Tipo:** `(name: string) => void`
- **Alias:** `it.todo`

  Utilizar `test.todo` para sustituir pruebas que serán implementadas más tarde. Una entrada será agregada al reporte para esta prueba para saber de esa manera cuántas pruebas necesitan ser implementadas.

  ```ts
  // Una entrada será mostrada en el reporte para esta prueba
  test.todo("prueba no implementada");
  ```

### test.fails

- **Tipo:** `(name: string, fn: TestFunction, timeout?: number) => void`
- **Alias:** `it.fails`

  Utilizar `test.fails` para indicar que una expectativa va a fallar explícitamente.

  ```ts
  import { expect, test } from "vitest";
  const myAsyncFunc = () => new Promise((resolve) => resolve(1));
  test.fails("prueba a fallar", async () => {
    await expect(myAsyncFunc()).rejects.toBe(1);
  });
  ```

### test.each

- **Tipo:** `(cases: ReadonlyArray<T>) => void`
- **Alias:** `it.each`

  Utilizar `test.each` cuando se necesita ejecutar la misma prueba con diferentes variables.
  Se pueden inyectar paramétros con [formateado printf](https://nodejs.org/api/util.html#util_util_format_format_args) en el nombre de la prueba en el orden de los parámetros de la función.

  - `%s`: string
  - `%d`: number
  - `%i`: integer
  - `%f`: valor de punto flotante
  - `%j`: json
  - `%o`: objeto
  - `%#`: índice de la prueba
  - `%%`: signo de porcentaje ('%')

  ```ts
  test.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])("add(%i, %i) -> %i", (a, b, expected) => {
    expect(a + b).toBe(expected);
  });

  // Esto va a retornar
  // ✓ add(1, 1) -> 2
  // ✓ add(1, 2) -> 3
  // ✓ add(2, 1) -> 3
  ```

  Si se quiere tener acceso a `TestContext`, utilizar `describe.each` con una sóla prueba.

## describe

Cuando se utiliza `test` al principio del archivo, esas pruebas son colectadas como parte de una serie implícita. Utilizando `describe` se puede definir una nueva serie en el contexto actual, como un set de pruebas relacionadas y otras pruebas anidadas. Una serie es útil para organizar las pruebas de modo tal que los reportes sean más claros.

```ts
import { describe, expect, test } from "vitest";

const person = {
  isActive: true,
  age: 32,
};

describe("person", () => {
  test("persona está definida", () => {
    expect(person).toBeDefined();
  });

  test("está activa", () => {
    expect(person.isActive).toBeTruthy();
  });

  test("límite de edad", () => {
    expect(person.age).toBeLessThanOrEqual(32);
  });
});
```

También se pueden anidar los bloques de series si existe una jerarquía de pruebas:

```ts
import { describe, expect, test } from "vitest";

const numberToCurrency = (value) => {
  if (typeof value !== "number") throw new Error("El valor debe ser un número");

  return value
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

describe("númeroAmoneda", () => {
  describe("dado un número inválido", () => {
    test("compuesto de no-nūmeros para lanzar error", () => {
      expect(() => numberToCurrency("abc")).toThrow();
    });
  });

  describe("dado un número válido", () => {
    test("retorna el correcto formato de moneda", () => {
      expect(numberToCurrency(10000)).toBe("10,000.00");
    });
  });
});
```

### describe.skip

- **Tipo:** `(name: string, fn: TestFunction) => void`

  Utilizar `describe.skip` en una serie para evitar ejecutarla.

  ```ts
  import { assert, describe, test } from "vitest";

  describe.skip("serie omitida", () => {
    test("sqrt", () => {
      // Serie omitida, no hay error
      assert.equal(Math.sqrt(4), 3);
    });
  });
  ```

### describe.only

- **Tipo:** `(name: string, fn: TestFunction) => void`

  Utilizar `describe.only` para correr sólo la serie especificada.

  ```ts
  // Sólo esta serie (y todas las que estén marcadas con only) serán ejecutadas
  describe.only("serie", () => {
    test("sqrt", () => {
      assert.equal(Math.sqrt(4), 3);
    });
  });

  describe("otra serie", () => {
    // ... será omitida
  });
  ```

  A veces es muy útil correr `only` para ejecutar sólo algunas pruebas de un archivo en particular, ignorando todo el resto de las pruebas de una serie, lo cual puede contaminar el resultado final.

  Para este caso se puede correr el comando `vitest` con el archivo específico que contiene la prueba.

  ```
  # vitest interesting.test.ts
  ```

### describe.concurrent

- **Tipo:** `(name: string, fn: TestFunction, timeout?: number) => void`

  `describe.concurrent` en una serie marca cada prueba como concurrente.

  ```ts
  // Todas las pruebas de esta serie serán ejecutadas en paralelo
  describe.concurrent("serie", () => {
    test("prueba concurrente 1", async () => {
      /* ... */
    });
    test("prueba concurrente 2", async () => {
      /* ... */
    });
    test.concurrent("prueba concurrente 3", async () => {
      /* ... */
    });
  });
  ```

  `.skip`, `.only`, y `.todo` funcionan con series concurrentes. Todas las siguientes combinaciones son válidas:

  ```ts
  describe.concurrent(/* ... */);
  describe.skip.concurrent(/* ... */); // o describe.concurrent.skip(/* ... */)
  describe.only.concurrent(/* ... */); // o describe.concurrent.only(/* ... */)
  describe.todo.concurrent(/* ... */); // o describe.concurrent.todo(/* ... */)
  ```

### describe.shuffle

- **Tipo:** `(name: string, fn: TestFunction, timeout?: number) => void`

  Vitest provee un método para ejecutar todas las pruebas en orden aleatorio mediante un parámetro en el CLI [`--sequence.shuffle`](/guide/cli) o mediante una opción en la configuración [`sequence.shuffle`](/config/#sequence-shuffle), pero si solamente se quieren ejecutar algunas pruebas de manera aleatoria, se pueden marcar con el parámetro del CLI.

  ```ts
  describe.shuffle("serie", () => {
    test("prueba aleatoria 1", async () => {
      /* ... */
    });
    test("prueba aleatoria 2", async () => {
      /* ... */
    });
    test("prueba aleatoria 3", async () => {
      /* ... */
    });
  });
  // El orden depende de la opción sequence.seed en el archivo de configuración (Date.now() es el predeterminado)
  ```

`.skip`, `.only`, y `.todo` funcionan con series aleatorias.

### describe.todo

- **Tipo:** `(name: string) => void`

  Utilizar `describe.todo` para sustituir series que serán implementadas más tarde. Una entrada será agregada al reporte para las pruebas de esa serie para saber de esa manera cuántas pruebas necesitan ser implementadas.

  ```ts
  // Una entrada para esta serie será agregada al reporte.
  describe.todo("serie no implementada");
  ```

### describe.each

- **Tipo:** `(cases: ReadonlyArray<T>): (name: string, fn: (...args: T[]) => void) => void`

  Utilizar `describe.each` en caso de tener varias pruebas que dependan de la misma data.

  ```ts
  describe.each([
    { a: 1, b: 1, expected: 2 },
    { a: 1, b: 2, expected: 3 },
    { a: 2, b: 1, expected: 3 },
  ])("describe el objeto add($a, $b)", ({ a, b, expected }) => {
    test(`retorna ${expected}`, () => {
      expect(a + b).toBe(expected);
    });

    test(`returned un valor no mayor a ${expected}`, () => {
      expect(a + b).not.toBeGreaterThan(expected);
    });

    test(`returned un valor no menor a ${expected}`, () => {
      expect(a + b).not.toBeLessThan(expected);
    });
  });
  ```

## expect

- **Tipo:** `ExpectStatic & (actual: any) => Assertions`

  `expect` es utilizado para crear afirmaciones (`assertions`). En este contexto `assertions` son funciones que pueden ser llamadas para afirmar una declaración. Vitest provee afirmaciones de `chai` por defecto y también afirmaciones compatibles con `Jest` que están creadas sobre `chai`.

  Por ejemplo, este códio afirma que el valor de un `input` es igual a `2`. Si no lo es, la afirmación lanzará un error, y la prueba fallará.

  ```ts
  import { expect } from "vitest";

  const input = Math.sqrt(4);

  expect(input).to.equal(2); // chai API
  expect(input).toBe(2); // jest API
  ```

  Técnicamente este ejemplo no utiliza la función [`test`](#test), por lo que en la consola se verá un error de NodeJS en vez de uno de Vitest. Para aprender más sobre `test`, por favor leer el [siguiente capítulo](#test).

  `expect` puede también ser utilizado estáticamente para acceder a funciones de emparejamiento, descritas más adelante, y más cosas.

### not

Utilizar `not` niega una afirmación. Por ejemplo, este código afirma que el valor de un `input` no es igual a `2`. En caso de ser igual, la afirmación lanzará un error, y la prueba fallará.

```ts
import { expect, test } from "vitest";

const input = Math.sqrt(16);

expect(input).not.to.equal(2); // chai API
expect(input).not.toBe(2); // jest API
```

### toBe

- **Tipo:** `(value: any) => Awaitable<void>`

  `toBe` puede ser utilizado para verificar si valores primitivos son iguales o si 2 objetos comparten la misma referencia. Es el equivalente de llamar `expect(Object.is(3, 3)).toBe(true)`. Si los objetos no tienen la misma referencia, pero se necesita verificar si la estructura es idéntica, se puede utilizar [`toEqual`](#toequal).

  Por ejemplo, el siguiente código verifica si el stock tiene 13 manzanas.

  ```ts
  import { expect, test } from "vitest";

  const stock = {
    type: "manzanas",
    count: 13,
  };

  test("hay 13 manzanas en stock", () => {
    expect(stock.type).toBe("manzanas");
    expect(stock.count).toBe(13);
  });

  test("Los stocks son iguales", () => {
    const refStock = stock; // Misma referencia

    expect(stock).toBe(refStock);
  });
  ```

  Evitar utilizar `toBe` con valores de punto flotante. Ya que JavaScript los redondea, `0.1 + 0.2` no es lo mismo que `0.3`. Para verificar valores de punto flotante de manera fidedigna, utilizar [`toBeCloseTo`](#tobecloseto).

### toBeCloseTo

- **Tipo:** `(value: number, numDigits?: number) => Awaitable<void>`

  Utilizar `toBeCloseTo` para comparar valores de punto flotante. El argumento opcional `numDigits` limita el número de dígitos a verificar _después_ del punto decimal. Por ejemplo:

  ```ts
  import { expect, test } from "vitest";

  test.fails("los decimales no son igual en Javascript", () => {
    expect(0.2 + 0.1).toBe(0.3); // 0.2 + 0.1 is 0.30000000000000004
  });

  test("los decimales son redondeados a 5 después del punto", () => {
    // 0.2 + 0.1 is 0.30000 | "000000000004" eliminado
    expect(0.2 + 0.1).toBeCloseTo(0.3, 5);
    // nada de 0.30000000000000004 es eliminado
    expect(0.2 + 0.1).not.toBeCloseTo(0.3, 50);
  });
  ```

### toBeDefined

- **Tipo:** `() => Awaitable<void>`

  `toBeDefined` verifica que el valor no es igual a `undefined`. Un caso de uso para el cual esto es útil es cuando se necesita verificar si una función _retorna_ algo.

  ```ts
  import { expect, test } from "vitest";

  const getApples = () => 3;

  test("la función retornó algo", () => {
    expect(getApples()).toBeDefined();
  });
  ```

### toBeUndefined

- **Tipo:** `() => Awaitable<void>`

El opuesto de `toBeDefined`, `toBeUndefined` verifica que el valor _es_ igual a `undefined`. Un caso de uso para el cual esto es útil es cuando se necesita verificar si una función no _retorna_ nada.

```ts
import { expect, test } from "vitest";

function getApplesFromStock(stock) {
  if (stock === "Bill") return 13;
}

test("Mary no tiene stock", () => {
  expect(getApplesFromStock("Mary")).toBeUndefined();
});
```

### toBeTruthy

- **Tipo:** `() => Awaitable<void>`

  `toBeTruthy` verifica que el valor sea verdadero (truthy), cuando se lo convierte a booleano. Útil cuando el valor no importa, sino que solamente se necesita saber si puede ser convertido a `true`.

  Por ejemplo en este código el valor de retorno de `stocks.getInfo` no importa - podría ser un objecto complejo, una cadena de caracteres o cualquier otra cosa. El código igualmente funcionará.

  ```ts
  import { Stocks } from "./stocks";
  const stocks = new Stocks();
  stocks.sync("Bill");
  if (stocks.getInfo("Bill")) stocks.sell("manzanas", "Bill");
  ```

  Entonces para verificar que `stocks.getInfo` sea verdadero, se podría escribir:

  ```ts
  import { expect, test } from "vitest";
  import { Stocks } from "./stocks";
  const stocks = new Stocks();

  test("si sabemos el stock de Bill, venderle manzanas a él", () => {
    stocks.sync("Bill");
    expect(stocks.getInfo("Bill")).toBeTruthy();
  });
  ```

  Todo en Javascript es verdadero, excepto `false`, `0`, `''`, `null`, `undefined`, y `NaN`.

### toBeFalsy

- **Tipo:** `() => Awaitable<void>`

  `toBeFalsy` verifica que el valor es falso (falsy), cuando es convertido a booleano. Útil cuando el valor no importa, sino que solamente se necesita saber si puede ser convertido a `false`.

  Por ejemplo en este código el valor de retorno de `stocks.stockFailed` no importa - cualquier valor falso. El código igualmente funcionará.

  ```ts
  import { Stocks } from "./stocks";
  const stocks = new Stocks();
  stocks.sync("Bill");
  if (!stocks.stockFailed("Bill")) stocks.sell("manzanas", "Bill");
  ```

  Entonces para verificar que `stocks.stockFailed` sea falso, se podría escribir:

  ```ts
  import { expect, test } from "vitest";
  import { Stocks } from "./stocks";
  const stocks = new Stocks();

  test("si el stock de Bill no cambió, venderle manzanas a él", () => {
    stocks.syncStocks("Bill");
    expect(stocks.stockFailed("Bill")).toBeFalsy();
  });
  ```

  Todo en Javascript es verdadero, excepto `false`, `0`, `''`, `null`, `undefined`, y `NaN`.

### toBeNull

- **Tipo:** `() => Awaitable<void>`

  `toBeNull` simplemente verifica si un valor es `null`. Es un alias para `.toBe(null)`.

  ```ts
  import { expect, test } from "vitest";

  function apples() {
    return null;
  }

  test("no tenemos manzanas", () => {
    expect(apples()).toBeNull();
  });
  ```

### toBeNaN

- **Tipo:** `() => Awaitable<void>`

  `toBeNaN` simplemente verifica si un valor es `NaN`. Es un alias para `.toBe(NaN)`.

  ```ts
  import { expect, test } from "vitest";

  let i = 0;

  function getApplesCount() {
    i++;
    return i > 1 ? NaN : i;
  }

  test("getApplesCount tiene un efecto secundario...", () => {
    expect(getApplesCount()).not.toBeNaN();
    expect(getApplesCount()).toBeNaN();
  });
  ```

### toBeTypeOf

- **Tipo:** `(c: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined') => Awaitable<void>`

  `toBeTypeOf` verifica si un valor es del tipo del valor recibido.

  ```ts
  import { expect, test } from "vitest";
  const actual = "stock";

  test("stock es del tipo string", () => {
    expect(actual).toBeTypeOf("string");
  });
  ```

### toBeInstanceOf

- **Tipo** `(c: any) => Awaitable<void>`

  `toBeInstanceOf` verifica si un valor es una instancia de la clase recibida.

  ```ts
  import { expect, test } from "vitest";
  import { Stocks } from "./stocks";
  const stocks = new Stocks();

  test("stocks es una instancia de Stocks", () => {
    expect(stocks).toBeInstanceOf(Stocks);
  });
  ```

### toBeGreaterThan

- **Tipo** `(n: number | bigint) => Awaitable<void>`

  `toBeGreaterThan` verifica si un valor es mayor al recibido. Valores iguales fallarán la prueba.

  ```ts
  import { expect, test } from "vitest";
  import { getApples } from "./stock";

  test("tiene más de 10 manzanas", () => {
    expect(getApples()).toBeGreaterThan(10);
  });
  ```

### toBeGreaterThanOrEqual

- **Tipo** `(n: number | bigint) => Awaitable<void>`

  `toBeGreaterThanOrEqual` verifica si un valor es mayor o igual al recibido.

  ```ts
  import { expect, test } from "vitest";
  import { getApples } from "./stock";

  test("tiene 11 manzanas o más", () => {
    expect(getApples()).toBeGreaterThanOrEqual(11);
  });
  ```

### toBeLessThan

- **Tipo** `(n: number | bigint) => Awaitable<void>`

  `toBeLessThan` verifica si un valor es menor al recibido. Valores iguales fallarán la prueba.

  ```ts
  import { expect, test } from "vitest";
  import { getApples } from "./stock";

  test("tiene menos de 20 manzanas", () => {
    expect(getApples()).toBeLessThan(20);
  });
  ```

### toBeLessThanOrEqual

- **Tipo** `(n: number | bigint) => Awaitable<void>`

  `toBeLessThanOrEqual` verifica si un valor es menor o igual al recibido.

  ```ts
  import { expect, test } from "vitest";
  import { getApples } from "./stock";

  test("tiene 11 manzanas o menos", () => {
    expect(getApples()).toBeLessThanOrEqual(11);
  });
  ```

### toEqual

- **Tipo** `(received: any) => Awaitable<void>`

  `toEqual` verifica si un valor es igual al recibido o, en caso de ser un objeto, si tiene la misma estructura (lo compara recursivamente). Se puede ver la diferencia entre `toEqual` y [`toBe`](#tobe) en este ejemplo:

  ```ts
  import { expect, test } from "vitest";

  const stockBill = {
    type: "manzanas",
    count: 13,
  };

  const stockMary = {
    type: "manzanas",
    count: 13,
  };

  test("stocks tienen las mismas propiedades", () => {
    expect(stockBill).toEqual(stockMary);
  });

  test("stocks no son iguales", () => {
    expect(stockBill).not.toBe(stockMary);
  });
  ```

  :::Advertencia
  Una _comparación profunda_ (deep equality check) no va a ser realizada para objetos del tipo `Error`. Para verificar si un error fue lanzado, utilizar la afirmación [`toThrow`](#tothrow).
  :::

### toStrictEqual

- **Tipo** `(received: any) => Awaitable<void>`

  `toStrictEqual` verifica si el valor es igual al recibido o tiene la misma estructura en el caso de ser un objeto (comparándolo recursivamente), y del mismo tipo.

  Diferencia con [`.toEqual`](#toequal):

  - Las claves con propiedades `undefined` son verificadas. Por ejemplo, `{a: undefined, b: 2}` no es igual a `{b: 2}` cuando se usa `.toStrictEqual`.
  - Los valores no existentes en una lista son verificados. Por ejemplo, `[, 1]` no es igual a `[undefined, 1]` cuando se usa `.toStrictEqual`.
  - Los tipos de los objetos son verificados. Por ejemplo, la instancia de una clase con los campos `a` y` b` no es igual a un objeto literal con las propiedades `a` y `b`.

  ```ts
  import { expect, test } from "vitest";

  class Stock {
    constructor(type) {
      this.type = type;
    }
  }

  test("estructuralmente igual, pero semánticamente distinto", () => {
    expect(new Stock("manzanas")).toEqual({ type: "manzanas" });
    expect(new Stock("manzanas")).not.toStrictEqual({ type: "manzanas" });
  });
  ```

### toContain

- **Tipo** `(received: string) => Awaitable<void>`

  `toContain` verifica si el valor se encuentra en una lista. `toContain` también puede verificar si una cadena de caracteres es una subcadena de otra cadena.

  ```ts
  import { expect, test } from "vitest";
  import { getAllFruits } from "./stock";

  test("la lista de frutas contiene naranja", () => {
    expect(getAllFruits()).toContain("naranja");
  });
  ```

### toContainEqual

- **Tipo** `(received: any) => Awaitable<void>`

  `toContainEqual` verifica si un item con una estructura y valores específicos existe en una lista.
  Funciona como [`toEqual`](#toequal) dentro de cada elemento.

  ```ts
  import { expect, test } from "vitest";
  import { getFruitStock } from "./stock";

  test("manzana disponible", () => {
    expect(getFruitStock()).toContainEqual({ fruit: "manzana", count: 5 });
  });
  ```

### toHaveLength

- **Tipo** `(received: number) => Awaitable<void>`

  `toHaveLength` verifica si un objeto tiene la propiedad `.length` y si la misma es igual al número proporcionado.

  ```ts
  import { expect, test } from "vitest";

  test("toHaveLength", () => {
    expect("abc").toHaveLength(3);
    expect([1, 2, 3]).toHaveLength(3);

    expect("").not.toHaveLength(3); // no tiene un .length de 3
    expect({ length: 3 }).toHaveLength(3);
  });
  ```

### toHaveProperty

- **Tipo** `(key: any, received?: any) => Awaitable<void>`

  `toHaveProperty` verifica si una determinada propiedad existe como `key` del objeto proporcionado.

  Acepta un parámetro opcional conocido como _comparación profunda_ (deep equality), como el emparejador `toEqual` para comparar el valor de la propiedad recibida.

  ```ts
  import { expect, test } from "vitest";

  const invoice = {
    isActive: true,
    "P.O": "12345",
    customer: {
      first_name: "John",
      last_name: "Doe",
      location: "China",
    },
    total_amount: 5000,
    items: [
      {
        type: "manzanas",
        quantity: 10,
      },
      {
        type: "naranjas",
        quantity: 5,
      },
    ],
  };

  test("Recibo de John Doe", () => {
    expect(invoice).toHaveProperty("isActive"); // verifica que exista la clave
    expect(invoice).toHaveProperty("total_amount", 5000); // verifica que exista la clave y que el valor sea igual

    expect(invoice).not.toHaveProperty("account"); // verifica que la clave no existe

    // Comparación profunda utilizando notación de punto
    expect(invoice).toHaveProperty("customer.first_name");
    expect(invoice).toHaveProperty("customer.last_name", "Doe");
    expect(invoice).not.toHaveProperty("customer.location", "India");

    // Comparación profunda utilizando una lista que contiene la clave
    expect(invoice).toHaveProperty("items[0].type", "manzanas");
    expect(invoice).toHaveProperty("items.0.type", "manzanas"); // notación de punto también existe

    // Utilizar una lista para incluir la clave para evitar que la clave sea analizada como una comparación profunda
    expect(invoice).toHaveProperty(["P.O"], "12345");
  });
  ```

### toMatch

- **Tipo** `(received: string | regexp) => Awaitable<void>`

  `toMatch` verifica si una cadena de caracteres cumple la condición de una expresión regular o de otra cadena.

  ```ts
  import { expect, test } from "vitest";

  test("frutas", () => {
    expect("las frutas incluyend manzana, naranja y uva").toMatch(/manzana/);
    expect("frutasmanzana").toMatch("frutas"); // toMatch también acepta una cadena
  });
  ```

### toMatchObject

- **Tipo** `(received: object | array) => Awaitable<void>`

  `toMatchObject` verifica si un objeto cumple con un subset de propiedades de otro objeto.

  También se puede pasar una lista de objetos. Esto es útil si se quiere verificar que 2 listas concuerdan en su número de elementos, al contrario que`arrayContaining`, que también permite más elementos en la lista recibida.

  ```ts
  import { expect, test } from "vitest";

  const johnInvoice = {
    isActive: true,
    customer: {
      first_name: "John",
      last_name: "Doe",
      location: "China",
    },
    total_amount: 5000,
    items: [
      {
        type: "manzanas",
        quantity: 10,
      },
      {
        type: "naranjas",
        quantity: 5,
      },
    ],
  };

  const johnDetails = {
    customer: {
      first_name: "John",
      last_name: "Doe",
      location: "China",
    },
  };

  test("el recibo tiene los datos personales de John", () => {
    expect(johnInvoice).toMatchObject(johnDetails);
  });

  test("el número de elementos debe coincidir exactamente", () => {
    // Afirma que una lista de objetos concuerda
    expect([{ foo: "bar" }, { baz: 1 }]).toMatchObject([
      { foo: "bar" },
      { baz: 1 },
    ]);
  });
  ```

### toThrowError

- **Tipo** `(received: any) => Awaitable<void>`

  `toThrowError` verifica si una función lanza un error cuando es llamada.

  Por ejemplo, si se necesita verificar que `getFruitStock('pineapples')` lanza un error, se puede escribir de la siguiente manera:

  Acepta un parámetro opcional para verificar que un error en específico es lanzado:

  - expresión regular: mensaje que coincide con el patrón
  - cadena de caracteres: el mensaje de error incluye la cadena

  :::Tip
  El código debe estar dentro de una función, de otra manera el error no será atrapado y la afirmación fallará.
  :::

  ```ts
  import { expect, test } from "vitest";

  function getFruitStock(type) {
    if (type === "ananá")
      throw new DiabetesError(
        "la ananá no es buena para la gente con diabetes"
      );

    // Hacer otra cosa
  }

  test("lanza error con ananá", () => {
    // Verifica que el mensaje de error contenga la palabra diabetes: ambas son equivalentes
    expect(() => getFruitStock("ananá")).toThrowError(/diabetes/);
    expect(() => getFruitStock("ananá")).toThrowError("diabetes");

    // Verifica el mensaje de error exacto
    expect(() => getFruitStock("ananá")).toThrowError(
      /^la ananá no es buena para la gente con diabetes$/
    );
  });
  ```

### toMatchSnapshot

- **Tipo** `<T>(shape?: Partial<T> | string, message?: string) => void`

  Asegura que el valor concuerde con la última instantánea (snapshot).

  Acepta un parámetro opcional `hint` que es una cadena de caracteres que es añadida al final del nombre de la prueba. Aunque Vitest siempre añade un número al final del nombre de la instantánea, un corto y descriptivo `hint` puede ser más útil que los números para diferenciar múltiples instantáneas en un bloque `it` o `test`. Vitest ordena las instantáneas por nombre en su archivo `.snap` correspondiente.

  :::Tip
  Cuando la instantánea no coincide y por ende la prueba falla, en caso de que esto sea lo esperado, se puede presionar la tecla `u` para actualizar la instantánea. O también se puede pasar `-u` o `--update` en las opciones del CLI para que Vitest siempre actualice las instantáneas.
  :::

  ```ts
  import { expect, test } from "vitest";

  test("la instantánea coincide", () => {
    const data = { foo: new Set(["bar", "snapshot"]) };
    expect(data).toMatchSnapshot();
  });
  ```

  También se puede pasar la forma de un objeto, si la prueba es sólo la forma del objeto, y no se necesita que sea 100% compatible.

  ```ts
  import { expect, test } from "vitest";

  test("la instantánea coincide", () => {
    const data = { foo: new Set(["bar", "snapshot"]) };
    expect(data).toMatchSnapshot({ foo: expect.any(Set) });
  });
  ```

### toMatchInlineSnapshot

- **Tipo** `<T>(shape?: Partial<T> | string, snapshot?: string, message?: string) => void`

  Asegura que el valor coincide con la más reciente instantánea.

  Vitest agrega y actuliza la cadena de caracteres utilizada como argumento del emparejador dentro del mismo archivo de la prueba (en vez de hacerlo en un archivo `.snap` externo).

  ```ts
  import { expect, test } from "vitest";

  test("la instantánea en el mismo archivo coincide", () => {
    const data = { foo: new Set(["bar", "snapshot"]) };
    // Vitest actualizará el siguiente contenido cuando actualice la instantánea
    expect(data).toMatchInlineSnapshot(`
      {
        "foo": Set {
          "bar",
          "snapshot",
        },
      }
    `);
  });
  ```

  También se puede pasar la forma de un objeto, si la prueba es sólo la forma del objeto, y no se necesita que sea 100% compatible.

  ```ts
  import { expect, test } from "vitest";

  test("la instantánea en el mismo archivo coincide", () => {
    const data = { foo: new Set(["bar", "snapshot"]) };
    expect(data).toMatchInlineSnapshot(
      { foo: expect.any(Set) },
      `
      {
        "foo": Any<Set>,
      }
    `
    );
  });
  ```

### toThrowErrorMatchingSnapshot

- **Tipo** `(message?: string) => void`

  Lo mismo que [`toMatchSnapshot`](#tomatchsnapshot), pero espera el mismo valor que [`toThrowError`](#tothrowerror).

  Si la función lanza un `Error`, la instantánea será el mensaje de error. De otra manera, la instantánea será el valor lanzado por la función.

### toThrowErrorMatchingInlineSnapshot

- **Tipo** `(snapshot?: string, message?: string) => void`

  Lo mismo que [`toMatchInlineSnapshot`](#tomatchinlinesnapshot), pero espera el mismo valor que [`toThrowError`](#tothrowerror).

  Si la función lanza un `Error`, la instantánea será el mensaje de error. De otra manera, la instantánea será el valor lanzado por la función.

### toHaveBeenCalled

- **Tipo** `() => Awaitable<void>`

  Verifica si una función fue llamada. Requiere una función espía como argumento del `expect`.

  ```ts
  import { expect, test, vi } from "vitest";

  const market = {
    buy(subject: string, amount: number) {
      // ...
    },
  };

  test("función espía", () => {
    const buySpy = vi.spyOn(market, "comprar");

    expect(buySpy).not.toHaveBeenCalled();

    market.buy("manzanas", 10);

    expect(buySpy).toHaveBeenCalled();
  });
  ```

### toHaveBeenCalledTimes

- **Tipo**: `(amount: number) => Awaitable<void>`

Verifica si una función fue llamada la cantidad de veces especificada. Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
};

test("la función espía fue llamada 2 veces", () => {
  const buySpy = vi.spyOn(market, "comprar");

  market.buy("manzanas", 10);
  market.buy("manzanas", 20);

  expect(buySpy).toHaveBeenCalledTimes(2);
});
```

### toHaveBeenCalledWith

- **Tipo**: `(...args: any[]) => Awaitable<void>`

Verifica si una función fue llamada al menos una vez con los parámetros especificados. Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
};

test("función espía", () => {
  const buySpy = vi.spyOn(market, "comprar");

  market.buy("manzanas", 10);
  market.buy("manzanas", 20);

  expect(buySpy).toHaveBeenCalledWith("manzanas", 10);
  expect(buySpy).toHaveBeenCalledWith("manzanas", 20);
});
```

### toHaveBeenLastCalledWith

- **Tipo**: `(...args: any[]) => Awaitable<void>`

Verifica si la última llamada a una función fue hecha con los parámetros especificados. Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
};

test("función espía", () => {
  const buySpy = vi.spyOn(market, "comprar");

  market.buy("manzanas", 10);
  market.buy("manzanas", 20);

  expect(buySpy).not.toHaveBeenLastCalledWith("manzanas", 10);
  expect(buySpy).toHaveBeenLastCalledWith("manzanas", 20);
});
```

### toHaveBeenNthCalledWith

- **Tipo**: `(time: number, ...args: any[]) => Awaitable<void>`

Verifica si una función fue llamada con los parámetros especificados en un momento específico. La cuenta comienza en 1, por lo que para verificar la segunda entrada, se debería escribir algo como `.toHaveBeenNthCalledWith(2, ...)`. Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

const market = {
  buy(subject: string, amount: number) {
    // ...
  },
};

test("primera llamada a una función espía con los parámetros correctos", () => {
  const buySpy = vi.spyOn(market, "comprar");

  market.buy("manzanas", 10);
  market.buy("manzanas", 20);

  expect(buySpy).toHaveBeenNthCalledWith(1, "manzanas", 10);
});
```

### toHaveReturned

- **Tipo**: `() => Awaitable<void>`

Verifica que una función retorne exitosamente un valor al menos una vez (por ejemplo, no lanzó un error). Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

const getApplesPrice = (amount: number) => {
  const PRICE = 10;
  return amount * PRICE;
};

test("la función espía retornó un valor", () => {
  const getPriceSpy = vi.fn(getApplesPrice);

  const price = getPriceSpy(10);

  expect(price).toBe(100);
  expect(getPriceSpy).toHaveReturned();
});
```

### toHaveReturnedTimes

- **Tipo**: `(amount: number) => Awaitable<void>`

Verifica que una función retorne exitosamente un valor la cantidad de veces especificada (por ejemplo, no lanzó un error). Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

test("la función espí retorna un valor 2 veces", () => {
  const sell = vi.fn((product: string) => ({ product }));

  sell("manzanas");
  sell("bananas");

  expect(sell).toHaveReturnedTimes(2);
});
```

### toHaveReturnedWith

- **Tipo**: `(returnValue: any) => Awaitable<void>`

Verifica si una función retorna exitosamente el valor especificado al menos una vez. Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

test("la función espía retorna un producto", () => {
  const sell = vi.fn((product: string) => ({ product }));

  sell("manzanas");

  expect(sell).toHaveReturnedWith({ product: "manzanas" });
});
```

### toHaveLastReturnedWith

- **Tipo**: `(returnValue: any) => Awaitable<void>`

Verifica que una función retorne exitosamente el valor especificado la última vez que fue llamada. Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

test("la función espía devuelve bananas la última vez que es llamada", () => {
  const sell = vi.fn((product: string) => ({ product }));

  sell("manzanas");
  sell("bananas");

  expect(sell).toHaveLastReturnedWith({ product: "bananas" });
});
```

### toHaveNthReturnedWith

- **Tipo**: `(time: number, returnValue: any) => Awaitable<void>`

Verifica que la función retorne exitosamente el valor especificado en el número de llamado provisto. Requiere una función espía como argumento del `expect`.

```ts
import { expect, test, vi } from "vitest";

test("la función espía retorna bananas la segunda vez que es llamada", () => {
  const sell = vi.fn((product: string) => ({ product }));

  sell("manzanas");
  sell("bananas");

  expect(sell).toHaveNthReturnedWith(2, { product: "bananas" });
});
```

### toSatisfy

- **Tipo** `(predicate: (value: any) => boolean) => Awaitable<void>`

Verifica que que el valor satisfaga el predicado.

```ts
describe("toSatisfy()", () => {
  const isOdd = (value: number) => value % 2 !== 0;

  it("pasa con 0", () => {
    expect(1).toSatisfy(isOdd);
  });

  it("pasa con negociación", () => {
    expect(2).not.toSatisfy(isOdd);
  });
});
```

### resolves

- **Tipo** `Promisify<Assertions>`

  `resolves` existe con el objetivo de remover código repetitivo cuando se escriben afirmaciones de código asíncrono. Conviene utilizarlo para definir el valor de retorno de una promesa y poder verificarlo con las afirmaciones usuales. Si la promesa rechaza, la prueba fallará.

  Retorna el mismo objeto `Assertions`, pero todos los emparejadores devuelven una promesa, por lo cual necesita ser utilizado con `await`. También funciona con afirmaciones de `chai`.

  Por ejemplo, con una función que realiza una llamada a una API y retorna alguna data, se puede utilizar `resolves` para verificar al valor de retorno.

  ```ts
  import { expect, test } from "vitest";

  async function buyApples() {
    return fetch("/buy/apples").then((r) => r.json());
  }

  test("buyApples retorna el nuevo id del stock", async () => {
    // toEqual retorna una promesa ahora, por lo tanto hay que utilizar await
    await expect(buyApples()).resolves.toEqual({ id: 1 }); // jest API
    await expect(buyApples()).resolves.to.equal({ id: 1 }); // chai API
  });
  ```

  :::Advertencia
  Si la afirmación no es llamada con await, se obtendrá un falso positivo en la prueba puesto que siempre pasará. Para asegurar que la afirmación esté siendo realmente llamada se puede utilizar [`expect.assertions(number)`](#expect-assertions).
  :::

### rejects

- **Tipo** `Promisify<Assertions>`

  `rejects` existe con el objetivo de remover código repetitivo cuando se escriben afirmaciones de código asíncrono. Conviene utilizarlo para definir al valor de rechazo de una promesa y poder verificarlo con las afirmaciones usuales. Si la promesa se resuelve exitosamente, la prueba fallará.

  Retorna el mismo objeto `Assertions`, pero todos los emparejadores devuelven una promesa, por lo cual necesita ser utilizado con `await`. También funciona con afirmaciones de `chai`.

  Por ejemplo, con una función que realiza una llamada a una API y retorna alguna data, se puede utilizar `rejects` para verificar que la promesa fue rechazada.

  ```ts
  import { expect, test } from "vitest";

  async function buyApples(id) {
    if (!id) throw new Error("no hay id");
  }

  test("buyApples lanza un error cuando no se le pasa un id", async () => {
    // toThrow retorna una promesa ahora, por lo tanto hay que utilizar await
    await expect(buyApples()).rejects.toThrow("no hay id");
  });
  ```

  :::Advertencia
  Si la afirmación no es llamada con await, se obtendrá un falso positivo en la prueba puesto que siempre pasará. Para asegurar que la afirmación esté siendo realmente llamada se puede utilizar [`expect.assertions(number)`](#expect-assertions).
  :::

### expect.assertions

- **Tipo** `(count: number) => void`

  Luego de que la prueba haya pasado o fallado, verifica que cierto número de afirmaciones hayan sido llamadas durante la prueba. Es útil cuando se quiere verificar si el código asíncrono fue llamado.

  Por ejemplo, si una función asíncrona llama a 2 emparejadores, se puede confirmar que ambos fueron llamadas.

  ```ts
  import { expect, test } from "vitest";

  async function doAsync(...cbs) {
    await Promise.all(cbs.map((cb, index) => cb({ index })));
  }

  test("todas las afirmaciones fueron llamadas", async () => {
    expect.assertions(2);
    function callback1(data) {
      expect(data).toBeTruthy();
    }
    function callback2(data) {
      expect(data).toBeTruthy();
    }

    await doAsync(callback1, callback2);
  });
  ```

### expect.hasAssertions

- **Tipo** `() => void`

  Luego de que la prueba haya pasado o fallado, verifica que al menos una afirmación haya sido llamada durante la prueba. Es útil cuando se quiere verificar si el código asíncrono fue llamado.

  Por ejemplo, si en el código se llama a un callback, podemos crear una afirmación dentro del callback, pero la prueba pasará igualmente si no se verifica si la afirmación fue llamada.

  ```ts
  import { expect, test } from "vitest";
  import { db } from "./db";

  const cbs = [];

  function onSelect(cb) {
    cbs.push(cb);
  }

  // luego de seleccionar de la base de datos, se llaman todos los callbacks
  function select(id) {
    return db.select({ id }).then((data) => {
      return Promise.all(cbs.map((cb) => cb(data)));
    });
  }

  test("el callback fue llamado", async () => {
    expect.hasAssertions();
    onSelect((data) => {
      // debería ser llamado on select
      expect(data).toBeTruthy();
    });
    // si no se utiliza await, la prueba falla
    // la prueba pasa si no se utiliza expect.hasAssertions()
    await select(3);
  });
  ```

<!-- asymmetric matchers -->

### expect.anything

- **Tipo** `() => any`

  Este emparejador asimétrico, cuando se utiliza con comparación de igualdad, siempre retornará `true`. Útil para saber simplemente si una propiedad existe.

  ```ts
  import { expect, test } from "vitest";

  test('el objeto contiene la clave "manzanas"', () => {
    expect({ manzanas: 22 }).toEqual({ apples: expect.anything() });
  });
  ```

### expect.any

- **Tipo** `(constructor: unknown) => any`

  Este emparejador asimétrico, cuando se utiliza con comparación de igualdad, retornará `true` siempre y cuando el valor sea una instancia del constructor especificado. Útil en casos donde hay un valor generado cada vez, y sólo se quiere saber si existe en un determinado tipo.

  ```ts
  import { expect, test } from "vitest";
  import { generateId } from "./generators";

  test('"id" es un número', () => {
    expect({ id: generateId() }).toEqual({ id: expect.any(Number) });
  });
  ```

### expect.arrayContaining

- **Tipo** `<T>(expected: T[]) => any`

  Este emparejador asimétrico, cuando se utiliza con comparación de igualdad, siempre retornará `true` si el valor es una lista y contiene el item especificado.

  ```ts
  import { expect, test } from "vitest";

  test("la canasta incluye Fuji", () => {
    const basket = {
      varieties: ["Empire", "Fuji", "Gala"],
      count: 3,
    };
    expect(basket).toEqual({
      count: 3,
      varieties: expect.arrayContaining(["Fuji"]),
    });
  });
  ```

  :::Tip
  Se puede utilizar `expect.not` con esta función para negar el valor esperado.
  :::

### expect.objectContaining

- **Tipo** `(expected: any) => any`

  Este emparejador asimétrico, cuando se utiliza con comparación de igualdad, siempre retornará `true` si el valor tiene una forma similar.

  ```ts
  import { expect, test } from "vitest";

  test("la canasta tiene manzanas Empire", () => {
    const basket = {
      varieties: [
        {
          name: "Empire",
          count: 1,
        },
      ],
    };
    expect(basket).toEqual({
      varieties: [expect.objectContaining({ name: "Empire" })],
    });
  });
  ```

  :::Tip
  Se puede utilizar `expect.not` con esta función para negar el valor esperado.
  :::

### expect.stringContaining

- **Tipo** `(expected: any) => any`

  Este emparejador asimétrico, cuando se utiliza con comparación de igualdad, siempre retornará `true` si el valor es una cadena de caracteres y contiene la subcadena especificada.

  ```ts
  import { expect, test } from "vitest";

  test('variety tiene "Emp" en su nombre', () => {
    const variety = {
      name: "Empire",
      count: 1,
    };
    expect(basket).toEqual({
      name: expect.stringContaining("Emp"),
      count: 1,
    });
  });
  ```

  :::Tip
  Se puede utilizar `expect.not` con esta función para negar el valor esperado.
  :::

### expect.stringMatching

- **Tipo** `(expected: any) => any`

  Este emparejador asimétrico, cuando se utiliza con comparación de igualdad, siempre retornará `true` si el valor es una cadena de caracteres y contiene la subcadena especificada o el string concuerda con la expresión regular provista.

  ```ts
  import { expect, test } from "vitest";

  test('variety termina con "re"', () => {
    const variety = {
      name: "Empire",
      count: 1,
    };
    expect(basket).toEqual({
      name: expect.stringMatching(/re$/),
      count: 1,
    });
  });
  ```

  :::Tip
  Se puede utilizar `expect.not` con esta función para negar el valor esperado.
  :::

### expect.addSnapshotSerializer

- **Tipo** `(plugin: PrettyFormatPlugin) => void`

Este método agregar serializadores personalizados que son llamados cuando se crea una instantánea (snapshot). Esta es una funcionalidad avanzada - en caso de querer conocer más sobre esto, se puede leer esta [guía sobre serializadores personalizados](/guide/snapshot#custom-serializer).

En caso de agregar un serializador personalizado, este método debería ser llamada dentro de [`setupFiles`](/config/#setupfiles). Esto afectará todas las instantáneas.

:::Tip
Si previamente se utilizó el CLI de Vue con Jest, se puede instalar [jest-serializer-vue](https://www.npmjs.com/package/jest-serializer-vue). Sino, las instantáneas serán envueltas en una cadena de caracteres, donde `"` será escapado.
:::

### expect.extend

- **Tipo** `(matchers: MatchersObject) => void`

  Se pueden extender los emparejadores. Esta función es utilizada para extender el objeto que contiene los emparejadores con emparejadores personalizados.

  Cuando se definen emparejadores de esta manera, se pueden crear funciones asimétricas que pueden ser utilizadas como `expect.stringContaining`.

  ```ts
  import { expect, test } from "vitest";

  test("afirmación personalizada", () => {
    expect.extend({
      toBeFoo: (received, expected) => {
        if (received !== "foo") {
          return {
            message: () => `expected ${received} to be foo`,
            pass: false,
          };
        }
      },
    });

    expect("foo").toBeFoo();
    expect({ foo: "foo" }).toEqual({ foo: expect.toBeFoo() });
  });
  ```

  > Cuando se quieren utilizar los emparejadores en todas las pruebas, esta función debería ser llamada en [`setupFiles`](/config/#setupFiles).

  Esta función es compatible con el `expect.extend` de Jest, por lo que cualquier librería que lo utilice para crear emparejadores personalizados funcionará con Vitest.

  En caso de utilizar Typescript, se puede extender la interfaz predeterminada de los emparejadores con el siguiente código:

  ```ts
  interface CustomMatchers<R = unknown> {
    toBeFoo(): R;
  }

  declare global {
    namespace Vi {
      interface Assertion extends CustomMatchers {}
      interface AsymmetricMatchersContaining extends CustomMatchers {}
    }
  }
  ```

  > Nota: aumentar la interfaz jest.Matchers también funciona.

  :::Tip
  En caso de querer más información, se puede leer la [guía para extender emparejadores](/guide/extending-matchers).
  :::

## Configuración y Limpieza (Setup and Teardown)

Estas funciones permiten engancharse en el ciclo de vida de las pruebas para evitar repetir código de configuración (setup) y limpieza (teardown). Se aplican al contexto presente: la serie dentro de la que se encuentran en caso de estar en un bloque `describe`, o el archivo en caso de no estar en ningún bloque.

### beforeEach

- **Tipo** `beforeEach(fn: () => Awaitable<void>, timeout?: number)`

  Registra una función para ser llamada antes de cada prueba en el contexto en el que corre.
  Si la función retorna una promesa, Vitest espera hasta que la promesa se resuelva antes de ejecutar las pruebas.

  Opcionalmente, se le puede proveer un tiempo de espera (en milisegundos) para especificar cuanto esperar antes de terminar. El tiempo por defecto es de 5 segundos.

```ts
import { beforeEach } from "vitest";

beforeEach(async () => {
  // Limpiar los mocks y agregar data de prueba después de ejecutar cada prueba.
  await stopMocking();
  await addUser({ name: "John" });
});
```

Aquí, el `beforeEach` asegura que el usuario sea agregado en cada prueba.

Desde Vitest v0.10.0, `beforeEach` también acepta una función opcional de limpieza (equivalente a `afterEach`).

```ts
import { beforeEach } from "vitest";

beforeEach(async () => {
  // llamado una vez antes de cada prueba
  await prepareSomething();

  // función de limpieza, llamada una vez después de cada prueba
  return async () => {
    await resetSomething();
  };
});
```

### afterEach

- **Tipo** `afterEach(fn: () => Awaitable<void>, timeout?: number)`

  Registra una función para ser llamada después de cada prueba en el contexto en el que corre.
  Si la función retorna una promesa, Vitest espera hasta que la promesa se resuelva antes de continuar.

  Opcionalmente, se le puede proveer un tiempo de espera (en milisegundos) para especificar cuanto esperar antes de terminar. El tiempo por defecto es de 5 segundos.

```ts
import { afterEach } from "vitest";

afterEach(async () => {
  await clearTestingData(); // despejar la data después de cada prueba
});
```

Aquí, el `afterEach` asegura que la data sea removida después de cada prueba.

### beforeAll

- **Tipo** `beforeAll(fn: () => Awaitable<void>, timeout?: number)`

  Registra una función para ser llamada antes de que todas las pruebas se ejecuten en el contexto en el que corren.
  Si la función retorna una promesa, Vitest espera hasta que la promesa se resuelva antes de ejecutar las pruebas.

  Opcionalmente, se le puede proveer un tiempo de espera (en milisegundos) para especificar cuanto esperar antes de terminar. El tiempo por defecto es de 5 segundos.

  ```ts
  import { beforeAll } from "vitest";

  beforeAll(async () => {
    await startMocking(); // llamado una vez antes de que todas las pruebas se ejecuten
  });
  ```

  Aquí, el `beforeAll` asegura que la data de prueba esté lista antes de correr la serie.

  Desde Vitest v0.10.0, `beforeAll` también acepta una función opcional de limpieza (equivalente a `afterAll`).

  ```ts
  import { beforeAll } from "vitest";

  beforeAll(async () => {
    // llamado una vez antes de que todas las pruebas se ejecuten
    await startMocking();

    // función de limpieza, llamada una vez después de que todas las pruebas sean ejecutadas
    return async () => {
      await stopMocking();
    };
  });
  ```

### afterAll

- **Tipo** `afterAll(fn: () => Awaitable<void>, timeout?: number)`

  Registra una función para ser llamada después de que todas las pruebas se ejecuten en el contexto en el que corren.
  Si la función retorna una promesa, Vitest espera hasta que la promesa se resuelva antes de continuar.

  Opcionalmente, se le puede proveer un tiempo de espera (en milisegundos) para especificar cuanto esperar antes de terminar. El tiempo por defecto es de 5 segundos.

  ```ts
  import { afterAll } from "vitest";

  afterAll(async () => {
    await stopMocking(); // esta función es llamada luego de que todas las pruebas se ejecuten
  });
  ```

  Aquí, el `afterAll` asegura que la función `stopMocking` sea llamada después de que todas las pruebas sean ejecutadas.

## Vi

Vitest provee funciones utilitarias para facilitar las pruebas mediante el objeto **vi**. Se puede importar directamente utilizando `import { vi } from 'vitest'` o se puede acceder **globalmente** (cuando [las globales en la configuración](/config/#globals) están **habilitadas**).

### vi.advanceTimersByTime

- **Tipo** `(ms: number) => Vitest`

  Funciona como `runAllTimers`, pero finaliza luego de los milisegundos definidos. Por ejemplo, esto va imprimir en la consola `1, 2, 3` y no lanzará un error:

  ```ts
  let i = 0;
  setInterval(() => console.log(++i), 50);

  vi.advanceTimersByTime(150);
  ```

### vi.advanceTimersToNextTimer

- **Tipo** `() => Vitest`

  Llamará al próximo temporizador disponible. Útil para realizar afirmaciones entre las llamadas de cada temporizador. Se pueden encadenar las llamadas para manejar los temporizadores por cuenta propia.

  ```ts
  let i = 0;
  setInterval(() => console.log(++i), 50);

  vi.advanceTimersToNextTimer() // log 1
    .advanceTimersToNextTimer() // log 2
    .advanceTimersToNextTimer(); // log 3
  ```

### vi.clearAllMocks

Llama a [`.mockClear()`](/api/#mockclear) en todos las funciones espías. Esto limpia el historial de la función, pero no reinicia su implementación a la predeterminada.

### vi.clearAllTimers

Elimina todos los temporizadores que están programados para correr. Estos temporizadores nunca correrán en el futuro.

### vi.dynamicImportSettled

Espera a que todos los módulos importados se hayan cargado. Útil cuando se tiene una llamada síncrona que empieza importando un módulo que no se puede esperar de otra manera.

### vi.fn

- **Tipo** `(fn: Function) => CallableMockInstance`

  Crea un espía en una función, aunque puede ser inicializado sin ella. Cada vez que una función es llamada, guarda los argumentos con los que fue llamada, los resultados y las instancias. También se puede manipular su comportamiento con [métodos](#mockinstance-methods).

  Si no se provee ninguna función, retorna `undefined` cuando es llamada.

  ```ts
  const getApples = vi.fn(() => 0);

  getApples();

  expect(getApples).toHaveBeenCalled();
  expect(getApples).toHaveReturnedWith(0);

  getApples.mockReturnValueOnce(5);

  const res = getApples();
  expect(res).toBe(5);
  expect(getApples).toHaveNthReturnedWith(2, 5);
  ```

### vi.getMockedSystemTime

- **Tipo**: `() => Date | null`

  Retorna una fecha falsa que haya sido previamente definida con `setSystemTime`. Si la data no fue definida previamente devolverá `null`.

### vi.getRealSystemTime

- **Tipo**: `() => number`

  Cuando se utiliza `vi.useFakeTimers`, las llamadas a `Date.now` son reemplazadas. Si se necesita obtener el tiempo real en milisegundos, se puede llamar a esta función.

### vi.mock

- **Tipo**: `(path: string, factory?: () => unknown) => void`

  Reemplaza todos los módulos pasados a la función. Dentro del `path` provisto _se pueden_ utilizar los alias definidos en la configuración de Vite.

  - Si `factory` está definido, va a retornar su resultado. Esta función puede ser asíncrona. Se puede llamar a [`vi.importActual`](#vi-importactual) dentro para obtener el módulo original. La llamada a `vi.mock` es pasada al principio del archivo (hoisted), por lo que no se tiene acceso a las variables declaradas en el scope global del archivo!
  - Cuando se reemplaza un módulo exportado mediante `default`, hay que proveer una clave `default` dentro del objeto devuelto por la función `factory`. Esta es una advertencia particular de los módulos ES, por lo cual la documentación de `jest` puede diferir ya que `jest` utiliza módulos CJS. _Ejemplo:_

  ```ts
  vi.mock("path", () => {
    return {
      default: { myDefaultKey: vi.fn() },
      namedExport: vi.fn(),
      // etc...
    };
  });
  ```

  - Si en el directorio `__mocks__` existe un archivo con el mismo nombre, todos los módulos importados devolverán todo lo que sea exportado en ese archivo. Por ejemplo, `vi.mock('axios')` con el directorio `<root>/__mocks__/axios.ts` devolverá todo lo exportado en `axios.ts`.
  - Si no hay un directorio `__mocks__` o un archivo con el mismo nombre dentro, llamará al módulo original y lo reemplazará. (Para las reglas aplicadas, ver el [algoritmo utilizado](/guide/mocking#automocking-algorithm).)

### vi.mocked

- **Tipo**: `<T>(obj: T, deep?: boolean) => MaybeMockedDeep<T>`
- **Tipo**: `<T>(obj: T, options?: { partial?: boolean; deep?: boolean }) => MaybePartiallyMockedDeep<T>`

  Función de ayuda para los tipos en Typescript. En realidad sólo retorna el objeto que fue pasado.

  Cuando `partial` es `true` esperará un `Partial<T>` como valor de retorno.

  ```ts
  import example from "./example";
  vi.mock("./example");

  test("1+1 equivale a 2", async () => {
    vi.mocked(example.calc).mockRestore();

    const res = example.calc(1, "+", 1);

    expect(res).toBe(2);
  });
  ```

### vi.importActual

- **Tipo**: `<T>(path: string) => Promise<T>`

  Importa el módulo, evitando las verificaciones para ver si debe ser reemplazado. Sumamente útil cuando se necesitan reemplazar módulos parcialmente.

  ```ts
  vi.mock("./example", async () => {
    const axios = await vi.importActual("./example");

    return { ...axios, get: vi.fn() };
  });
  ```

### vi.importMock

- **Tipo**: `<T>(path: string) => Promise<MaybeMockedDeep<T>>`

  Importa un módulo con todas sus propiedades (incluyendo las anidadas) reemplazadas. Sigue las mismas reglas que [`vi.mock`](#vi-mock). Para las reglas aplicadas, ver el [algoritmo utilizado](/guide/mocking#automocking-algorithm).

### vi.resetAllMocks

Llama a [`.mockReset()`](/api/#mockreset) en todas las funciones espías. Esto limpia el historial y reinicia su implementación a una función vacía (que devuelve `undefined`).

### vi.resetModules

- **Tipo**: `() => Vitest`

  Reinicia el registro de módulos mediante la limpieza de la cache de todos los módulos. Puede ser útil para aislar módulos donde el estado local genera conflictos entre pruebas.

  ```ts
  import { vi } from "vitest";

  beforeAll(() => {
    vi.resetModules();
  });

  test("cambia el estado", async () => {
    const mod = await import("./some/path");
    mod.changeLocalState("nuevo valor");
    expect(mod.getlocalState()).toBe("nuevo valor");
  });

  test("modulo con un estado anterior", async () => {
    const mod = await import("./some/path");
    expect(mod.getlocalState()).toBe("valor anterior");
  });
  ```

### vi.restoreAllMocks

Llama [`.mockRestore()`](/api/#mockrestore) en todas las funciones espías. Esto limpia el historial y reinicia la implementación a la original.

### vi.restoreCurrentDate

- **Tipo**: `() => void`

  Restaura `Date` devuelta a su implementación nativa.

### vi.runAllTicks

- **Tipo** `() => Vitest`

  Llama a todas las microtareas. Estas son usualmente puestas en cola por `proccess.nextTick`. Esto ejecutará todas las microtareas programadas por si mismas.

### vi.runAllTimers

- **Tipo** `() => Vitest`

  Este método invocará todos los temporizadores iniciados hasta que la cola de temporizadores quede vacía. Significa que todos los temporizadores llamados durante `runAllTimers` serán ejecutados. Si hay un intervalo infinito, lanzará un error luego de 10 000 intentos. Por ejemplo, esto imprimirá en consola `1, 2, 3`:

  ```ts
  let i = 0;
  setTimeout(() => console.log(++i));
  const interval = setInterval(() => {
    console.log(++i);
    if (i === 2) clearInterval(interval);
  }, 50);

  vi.runAllTimers();
  ```

### vi.runOnlyPendingTimers

- **Tipo** `() => Vitest`

Este método llamará cada temporizador que haya sido inicializado despues de que `vi.useFakeTimers()` haya sido llamado. No ejecutará ningún temporizador que haya sido inicializado durante su llamada. Por ejemplo, esto imprimirá en consola `1`:

```ts
let i = 0;
setInterval(() => console.log(++i), 50);

vi.runOnlyPendingTimers();
```

### vi.setSystemTime

- **Tipo**: `(date: string | number | Date) => void`

  Define la fecha actual con el valor recibido. Todas las llamadas a `Date` retornarán este valor.

  Útil para cualquier prueba que dependa de la fecha actual - por ejemplo llamadas a [luxon](https://github.com/moment/luxon/) dentro del código.

  ```ts
  const date = new Date(1998, 11, 19);

  vi.useFakeTimers();
  vi.setSystemTime(date);

  expect(Date.now()).toBe(date.valueOf());

  vi.useRealTimers();
  ```

### vi.spyOn

- **Tipo** `<T, K extends keyof T>(object: T, method: K, accessType?: 'get' | 'set') => MockInstance`

  Crea una función espía en un método o un getter/setter de un objeto.

  ```ts
  let apples = 0;
  const obj = {
    getApples: () => 13,
  };

  const spy = vi.spyOn(obj, "getApples").mockImplementation(() => apples);
  apples = 1;

  expect(obj.getApples()).toBe(1);

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveReturnedWith(1);
  ```

### vi.stubGlobal

- **Tipo**: `(key: keyof globalThis & Window, value: any) => Vitest`

  Define un valor en una variable global. Cuando se utiliza `jsdom` o `happy-dom`, también define el valor en el objeto `window`.

  Leer más en la [sección "Reemplazando Globales"](/guide/mocking.html#globals).

### vi.unmock

- **Tipo**: `(path: string) => void`

  Remueve el módulo del registro de reemplazos. Todas las llamadas subsecuentes al import retornarán el módulo original aunque haya sido reemplazado.

### vi.useFakeTimers

- **Tipo** `() => Vitest`

  Para habilitar los reemplazos de temporizadores, se necesita llamar a este método. Envuelve cualquier futura llamada a un temporizador (como `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `nextTick`, `setImmediate`, `clearImmediate`, y `Date`), hasta que [`vi.useRealTimers()`](#vi-userealtimers) sea llamado.

  Esta implementación está basada internamente en [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers).

### vi.useRealTimers

- **Tipo** `() => Vitest`

  Cuando los temporizadores terminaron de ejecutarse,se puede llamar a este método para eliminar los reemplazos de los temporizadores y que vuelvan a utilizar los originales. Los temporizadores ejecutados antes de esta llamada no serán restaurados.

## Métodos de MockInstance

### getMockName

- **Tipo** `() => string`

  Utilizar esta función para retornar el nombre del reemplazo definido mediante la función `.mockName(name)`.

### mockClear

- **Tipo** `() => MockInstance`

  Limpia toda la información acerca de cada llamada. Luego de llamar a esta función, tanto [`spy.mock.calls`](#mock-calls) como [`spy.mock.results`](#mock-results) retornarán listas vacías. Útil cuando se necesita limpiar una función espía entre diferentes pruebas.

  Si es necesario que esta función sea llamada de manera automática entre pruebas, se puede habilitar este comportamiento mediante la opción [`clearMocks`](/config/#clearmocks) en la configuración.

### mockName

- **Tipo** `(name: string) => MockInstance`

  Define el nombre de un reemplazo. Útil para ver que reemplazo falló la afirmación (assertion).

### mockImplementation

- **Tipo** `(fn: Function) => MockInstance`

  Acepta una función que será utilizada como implementación de la misma al ser reemplazada.

  Por ejemplo:

  ```ts
  const mockFn = vi.fn().mockImplementation((apples) => apples + 1);
  // or: vi.fn(apples => apples + 1);

  const NelliesBucket = mockFn(0);
  const BobsBucket = mockFn(1);

  NelliesBucket === 1; // true
  BobsBucket === 2; // true

  mockFn.mock.calls[0][0] === 0; // true
  mockFn.mock.calls[1][0] === 1; // true
  ```

### mockImplementationOnce

- **Tipo** `(fn: Function) => MockInstance`

  Acepta una función que será utilizada una sola vez, como implementación de la misma al ser reemplazada. Puede ser encadenada para obtener distintos resultados en múltiples llamadas.

  ```ts
  const myMockFn = vi
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false);

  myMockFn(); // true
  myMockFn(); // false
  ```

  Cuando la función reemplazada se queda sin implementaciones, inovocará la implementación predeterminada que fue definida mediante `vi.fn(() => defaultValue)` o `.mockImplementation(() => defaultValue)` (en caso de haber sido utilizadas):

  ```ts
  const myMockFn = vi
    .fn(() => "predeterminada")
    .mockImplementationOnce(() => "primera llamada")
    .mockImplementationOnce(() => "segunda llamada");

  // 'primera llamada', 'primera llamada', 'predeterminada', 'predeterminada'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
  ```

### mockRejectedValue

- **Tipo** `(value: any) => MockInstance`

  Acepta un error que será lanzado cuando la función asíncrona sea llamada.

  ```ts
  test("prueba asíncrona", async () => {
    const asyncMock = vi.fn().mockRejectedValue(new Error("Error asíncrono"));

    await asyncMock(); // lanza "Error asíncrono"
  });
  ```

### mockRejectedValueOnce

- **Tipo** `(value: any) => MockInstance`

  Acepta un error que será lanzado una sola vez cuando la función asíncrona sea llamada. En caso de encadenar múltiples, cada llamada lanzará el error durante el rechazo de la promesa.

  ```ts
  test("prueba asíncrona", async () => {
    const asyncMock = vi
      .fn()
      .mockResolvedValueOnce("primera llamada")
      .mockRejectedValueOnce(new Error("Error asíncrono"));

    await asyncMock(); // primera llamada
    await asyncMock(); // lanza "Error asíncrono"
  });
  ```

### mockReset

- **Tipo** `() => MockInstance`

  Hace lo mismo que `mockClear` y reinicia la implementación interna a una función vacía (que devolverá `undefined` cuando sea invocada). Esto es útil cuando se quiere reiniciar una función reemplazada por completo al estado inicial.

  En caso de querer llamar a este método antes de cada prueba de manera automática, se puede habilitar la opción [`mockReset`](/config/#mockreset) en la configuración.

### mockRestore

- **Tipo** `() => MockInstance`

  Hace lo mismo que `mockReset` y restaura la implementación interna al estado de la función original.

  En el caso de restaurar una función creada mediante `vi.fn()`, la implementación será reiniciada a una función vacía (que devolverá `undefined` cuando sea invocada). Restaurar una función del tipo `vi.fn(impl)` la reiniciará a `impl`.

  En caso de querer llamar a este método antes de cada prueba de manera automática, se puede habilitar la opción [`restoreMocks`](/config/#restoreMocks) en la configuración.

### mockResolvedValue

- **Tipo** `(value: any) => MockInstance`

  Acepta un valor que será resuelto cuando la función asíncrona sea llamada.

  ```ts
  test("preuba asíncrona", async () => {
    const asyncMock = vi.fn().mockResolvedValue(43);

    await asyncMock(); // 43
  });
  ```

### mockResolvedValueOnce

- **Tipo** `(value: any) => MockInstance`

  Acepta un valor que será resuelto una sola vez cuando la función asíncrona sea llamada. En el caso de encadenar múltiples, cada llamada consecutiva resolverá el valor recibido.

  ```ts
  test("prueba asíncrona", async () => {
    const asyncMock = vi
      .fn()
      .mockResolvedValue("predeterminado")
      .mockResolvedValueOnce("primera llamada")
      .mockResolvedValueOnce("segunda llamada");

    await asyncMock(); // primera llamada
    await asyncMock(); // segunda llamada
    await asyncMock(); // predeterminado
    await asyncMock(); // predeterminado
  });
  ```

### mockReturnThis

- **Tipo** `() => MockInstance`

  Hace que la implementación de la función retorne el contexto de `this`.

### mockReturnValue

- **Tipo** `(value: any) => MockInstance`

  Acepta un valor que será retornado siempre que la función sea llamada.

  ```ts
  const mock = vi.fn();
  mock.mockReturnValue(42);
  mock(); // 42
  mock.mockReturnValue(43);
  mock(); // 43
  ```

### mockReturnValueOnce

- **Tipo** `(value: any) => MockInstance`

  Acepta un valor que será retornado una sola vez, cuando la función sea llamada. En caso de encadenar múltiples, cada llamada consecutiva devolverá el valor recibido. Cuando no haya más valores para utilizar de `mockReturnValueOnce`, llamará la implementación especificada por `mockImplementation` u otros métodos del tipo `mockReturn*`.

  ```ts
  const myMockFn = vi
    .fn()
    .mockReturnValue("predeterminado")
    .mockReturnValueOnce("primera llamada")
    .mockReturnValueOnce("segunda llamada");

  // 'primera llamada', 'segunda llamada', 'predeterminado', 'predeterminado'
  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
  ```

## MockInstance Properties

### mock.calls

Esta es una lista que contiene todos los argumentos de cada llamada. Cada item de la lista es un argumento de esa llamada.

Si una función fue invocada 2 veces con los argumentos `fn(arg1, arg2)`, `fn(arg3, arg4)` en ese orden, entonces `mock.calls` será:

```js
[
  ["arg1", "arg2"],
  ["arg3", "arg4"],
];
```

### mock.lastCall

Contiene los argumentos de la última llamada. Si la función no fue llamada, retornará `undefined`

### mock.results

Una lista que contiene todos los valores que fueron devueltos (`returned`) por la función. Un item de la lista es un objeto con las propiedades `type` y `value`. Los tipos disponibles son:

- `'return'` - la función retornó un valor sin lanzar error.
- `'throw'` - la función lanzó un error.

La propiedad `value` contiene el valor retornado o el error lanzado.

Si la función retornó `result`, y luego lanzó un error, entonces `mock.results` será:

```js
[
  {
    type: "return",
    value: "result",
  },
  {
    type: "throw",
    value: Error,
  },
];
```

### mock.instances

Una lista que contiene todas las instancias reemplazadas que hayan sido creadas mediante la utilización de la palabra clave `new`. Cabe aclarar que `this` es un contexto de la función, no un valor de retorno.

Por ejemplo, si el reemplazo fue creado utilizando `new MyClass()`, entonces `mock.instances` será una lista de un único valor:

```js
import { expect, vi } from "vitest";

const MyClass = vi.fn();

const a = new MyClass();

expect(MyClass.mock.instances[0]).toBe(a);
```

Si se retorna un valor desde el constructor, no estará en la lista de `instances`, sino en la de `results`:

```js
import { expect, vi } from "vitest";

const Spy = vi.fn(() => ({ method: vi.fn() }));

const a = new Spy();

expect(Spy.mock.instances[0]).not.toBe(a);
expect(Spy.mock.results[0]).toBe(a);
```
