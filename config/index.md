---
outline: deep
---

# Configurando Vitest

## Configuración

`vitest` leerá el archivo `vite.config.ts` ubicado en la raíz del proyecto, cuando esté presente, para coincidir la configuración y los plugins tal como está en la aplicación Vite. En caso de querer una configuración distinta para el entorno de pruebas o en caso de que la aplicación no dependa específicamente de Vite, se puede:

- Crear un archivo llamado `vitest.config.ts`, que tendrá la más alta prioridad y pisa el contenido del archivo `vite.config.ts`
- Pasar el argumento `--config` al CLI, por ejemplo, `vitest --config ./path/to/vitest.config.ts`
- Utilizar `process.env.VITEST` o la propiedad `mode` en `defineConfig` (será`test` en caso de no cambiarlo) para aplicar condicionalmente distintas configuraciones en `vite.config.ts`

Para configurar `vitest` en si mismo, agregar la propiedad `test` en la configuración de Vite. También se necesita agregar una referencia a los tipos de Vitest utilizando [el comando de triple barra](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-) al principio del archivo, en caso de estar importando `defineConfig` desde `vite`.

Utilizando `defineConfig` desde `vite` se debería hacer de esta manera:

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // ...
  },
});
```

Utilizando `defineConfig` desde `vitest/config` se debería hacer de esta manera:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
  },
});
```

Se puede importar la configuración predeterminada de Vitest y modificarla:

```ts
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "packages/template/*"],
  },
});
```

## Options

:::Tip
Además de las siguientes opciones, se pueden utilizar las opciones de [Vite](https://vitejs.dev/config/). Por ejemplo, `define` para definir variables globales, o `resolve.alias` para definir diferentes alias.
:::

### include

- **Tipo:** `string[]`
- **Predeterminado:** `['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`

Archivos a incluir en las pruebas, utilizando un patrón global.

### exclude

- **Tipo:** `string[]`
- **Predeterminado:** `['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**']`

Archivos a excluir de las pruebas, utilizando un patrón global.

### deps

- **Tipo:** `{ external?, inline? }`

Manejo de dependencias vía externalización o mediante Vite (inline).

#### deps.external

- **Tipo:** `(string | RegExp)[]`
- **Predeterminado:** `['**/node_modules/**', '**/dist/**']`

Externalizar significa que Vite derivará la dependencia a Node nativo. A las dependencias externalizadas no se les aplica ninguna transformación ni resolución de Vite, por lo que no soportan HMR cuando se recarga. Usualmente, los paquetes ubicados en `node_modules` están externalizados.

#### deps.inline

- **Tipo:** `(string | RegExp)[] | true`
- **Predeterminado:** `[]`

Vite procesará los módules. Esto puede ser útil para manipular paquetes que contienen `.js` en formato ESM (que Node no puede manejar).

En caso de ser `true`, toda dependencia será manipulada por Vite. Todas las dependencias, espcificadas en [`ssr.noExternal`](https://vitejs.dev/guide/ssr.html#ssr-externals) serán manejadas por Vite.

#### deps.fallbackCJS

- **Type** `boolean`
- **Predeterminado:** `false`

Cuando una dependencia es un paquete ESM válido, intenta adivinar la versión CJS basada en la dirección. Esto puede ser útil si una dependencia tiene un archivo ESM incorrecto.

Esto puede potencialmente causar un desajuste si un paquete tiene una lógicas distintas entre ESM y CJS.

#### deps.registerNodeLoader

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Utilizar el [cargador experimental de Node](https://nodejs.org/api/esm.html#loaders) para resolver los módulos importados dentro de `node_modules`, utilizando el algoritmo de resolución de Vite.

En caso de estar deshabilitado, el `alias` y `<plugin>.resolveId` no afectarán los módulos importados en `node_modules` o `deps.external`.

#### deps.interopDefault

- **Tipo:** `boolean`
- **Predeterminado:** `true`

Interpretar los módulos CJS exportados de manera predeterminada (default) como exportaciones con nombre (named exports).

### alias

- **Tipo:** `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

Define alias personalizados cuando se corren las pruebas. Serán unificados con los alias agregados en `resolve.alias`.

### globals

- **Tipo:** `boolean`
- **Predeterminado:** `false`

`vitest` no provee APIs globales de manera predeterminada. En caso de querer utilizar las APIs de manera global como en Jest, se le puede pasar el argumento `--globals` al CLI o agregar `globals: true` en la configuración.

```ts
// vite.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
  },
});
```

Para lograr que Typescript funciona correctamente con las APIs globales, hay que agregar `vitest/globals` a las lista de `types` en el archivo `tsconfig.json`.

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

En caso de ya estar utilizando la librería [`unplugin-auto-import`](https://github.com/antfu/unplugin-vue-components) en el proyecto, se la puede utilizar para importar automáticamente esas APIs.

```ts
// vite.config.ts
import { defineConfig } from "vitest/config";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ["vitest"],
      dts: true, // generar las declaraciones de Typescript
    }),
  ],
});
```

### environment

- **Tipo:** `'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'`
- **Predeterminado:** `'node'`

El entorno que será utilizado para las pruebas. El entorno prdeterminado en Vitest es Node.js. En caso de estar creando una aplicación web, se puede utilizar un entorno de ese tipo mediante la utilización de [`jsdom`](https://github.com/jsdom/jsdom) o [`happy-dom`](https://github.com/capricorn86/happy-dom). En caso de estar creando funciones edge, se puede utilizar el entorno [`edge-runtime`](https://edge-runtime.vercel.app/packages/vm).

Agregando un comentario `@vitest-environment` al principio del archivo, o un docblock con el mismo contenido, se puede especificar otro entorno para ser utilizado en todas las pruebas dentro de ese archivo:

Estilo docblock:

```js
/**
 * @vitest-environment jsdom
 */

test("use jsdom in this test file", () => {
  const element = document.createElement("div");
  expect(element).not.toBeNull();
});
```

Estilo con comentarios:

```js
// @vitest-environment happy-dom

test("use happy-dom in this test file", () => {
  const element = document.createElement("div");
  expect(element).not.toBeNull();
});
```

Para compatibilidad con Jest, existe tambien `@jest-environment`:

```js
/**
 * @jest-environment jsdom
 */

test("use jsdom in this test file", () => {
  const element = document.createElement("div");
  expect(element).not.toBeNull();
});
```

En caso de estar corriendo Vitest con el argumento [`--no-threads`](#threads), las pruebas correrán en este orden: `node`, `jsdom`, `happy-dom`. Esto significa que, cada prueba con el mismo entorno es agrupada, pero es igualmente ejecutada de manera secuencial.

### update

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Actualiza las instantáneas (snapshots). Esto actualiza todas las instantáneas que hayan cambiado y elimina las obsoletas.

### watch

- **Tipo:** `boolean`
- **Predeterminado:** `true`

Habilita el modo para escuchar los cambios en las pruebas.

### root

- **Tipo:** `string`

Raíz del proyecto

### reporters

- **Tipo:** `Reporter | Reporter[]`
- **Predeterminado:** `'default'`

Especifica herramientas de reportes personalizadas. Las herramientas de reportes pueden ser una [instancia de Reporter](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/types/reporter.ts) o una cadena de caracteres para seleccionar una de las opciones predeterminadas:

- `'default'` - colapsa las series cuando terminan
- `'verbose'` - mantiene el árbol completo visible
- `'dot'` - muestra cada tarea como un punto
- `'junit'` - herramienta de reporte JUnit XML
- `'json'` - provee un simple resumen en formato JSON
- dirección a una herramienta personalizada (por ejemplo. `'./path/to/reporter.ts'`, `'@scope/reporter'`)

### outputTruncateLength

- **Tipo:** `number`
- **Predeterminado:** `80`

Trunca cada linea de salida en un máximo de `80` caracteres. Se puede modificar dependiendo del ancho de la consola.

### outputDiffLines

- **Tipo:** `number`
- **Predeterminado:** `15`

Limita la cantidad de lineas de salida a un máximo de `15`.

### outputFile

- **Tipo:** `string | Record<string, string>`

Escribe los resultados de las pruebas en un archivo cuando el argumento `--reporter=json` o `--reporter=junit` es especificado.
En caso de pasar un objecto en vez de una cadena de caracteres, se pueden definir salidas individuales cuando se utilizan múltiples herramientas de reportes.

Para pasar un objeto utilizando el CLI, utilizar la siguiente sintaxis: `--outputFile.json=./path --outputFile.junit=./other-path`.

### threads

- **Tipo:** `boolean`
- **Predeterminado:** `true`

Habilitar multi-hilo utilizando [tinypool](https://github.com/Aslemammad/tinypool) (una versión liviana de [Piscina](https://github.com/piscinajs/piscina))

:::Advertencia
Esta opción difiere de `--runInBand` en Jest. Vitest utiliza workers no solo para correr pruebas en paralelo, sino también para proveer aislamiento. Cuando se deshabilita esta opción, las pruebas correrán secuencialmente, pero en el mismo contexto global, por lo cual el aislamiento de las pruebas deberá ser provisto por el usuario.

Esto puede causar todo tipo de problemas, en casos donde se depende un estado global (los frameworks de front end usualmente lo hacen) o si el código depende de un entorno definido de manera separada en cada prueba. Pero puede mejorar la velocidad de las pruebas (hasta 3 veces más rápido), que no dependan necesariamente de un estado global o que lo puedan omitir fácilmente.
:::

### maxThreads

- **Tipo:** `number`
- **Predeterminado:** _available CPUs_

Número máximo de hilos. Se puede utilizar también la variable de entorno `VITEST_MAX_THREADS`.

### minThreads

- **Tipo:** `number`
- **Predeterminado:** _available CPUs_

Número mínimo de hilos. Se puede utilizar también la variable de entorno `VITEST_MIN_THREADS`.

### testTimeout

- **Tipo:** `number`
- **Predeterminado:** `5000`

Tiempo de espera predeterminado para una prueba en milisegundos.

### hookTimeout

- **Tipo:** `number`
- **Predeterminado:** `10000`

Tiempo de espera predeterminado para un hook en milisegundos.

### teardownTimeout

- **Tipo:** `number`
- **Predeterminado:** `1000`

Tiempo de espera predeterminado para cerrar Vitest, en milisegundos.

### silent

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Silenciar la salida por consola de las pruebas.

### setupFiles

- **Tipo:** `string | string[]`

Dirección de los archivos de preparación. Serán ejecutados antes de correr cada archivo de pruebas.

Se puede utilizar `process.env.VITEST_POOL_ID` (cadena de caracteres del tipo integer) dentro para distinguir entre hilos (será siempre `'1'`, si se ejecuta con `threads: false`).

:::Tip
En caso de utiliza r[`--no-threads`](#threads), este archivo será ejecutado en el mismo scope global múltiples veces. Esto significa que siempre se accederá al mismo objeto global antes de cada prueba, por lo que conveiene no realizar la misma acción mayor cantidad de veces de lo necesario.
:::

Por ejemplo, en caso de depender de una variable global:

```ts
import { config } from "@some-testing-lib";

if (!globalThis.defined) {
  config.plugins = [myCoolPlugin];
  computeHeavyThing();
  globalThis.defined = true;
}

// los hooks son reiniciados antes antes de cada serie
afterEach(() => {
  cleanup();
});

globalThis.resetBeforeEachTest = true;
```

### globalSetup

- **Tipo:** `string | string[]`

Dirección a los archivos de preparación, relativos a la raíz del proyecto.

Un archivo de preparación global puede contener funciones exportadas llamadas `setup` y `teardown` o una función `default` que devuelva una función de limpieza ([ejemplo](https://github.com/vitest-dev/vitest/blob/main/test/global-setup/vitest.config.ts)).

::: Info
Es posible agregar múltiples archivos. La preparación (setup) y la limpieza (teardown) son ejecutadas de manera secuencial con la limpienza en orden reverso.
:::

::: Advertencia
Hay que tener en cuenta que este archivo es ejecutado en un scope global diferente, por lo que las pruebas no tienen acceso a las variables definidas aquí.
:::

### watchExclude

- **Tipo:** `string[]`
- **Predeterminado:** `['**/node_modules/**', '**/dist/**']`

Patrón global de archivos a ser ignorados a la hora de recargar automáticamente cuando se escuchan los cambios.

### forceRerunTriggers

- **Type**: `string[]`
- **Predeterminado:** `['**/package.json/**', '**/vitest.config.*/**', '**/vite.config.*/**']`

Patrón global de archivos que dispararán que una serie vuelva a correr. Cuando es utilizado con el argumento `--changed`, ejecutará toda la serie completa si el disparador se encuentra dentro del git diff.

Útil cuando se hacen pruebas llamando comandos del CLI, porque Vite no puede construir el árbol de módulos.

```ts
test("ejecutar un script", async () => {
  // Vitest no puede volver a ejecutar el archivo, si el contenido de `dist/index.js` cambia
  await execa("node", ["dist/index.js"]);
});
```

::: Tip
Conviene asegurar que los archivos no estén siendo excluídos mediante `watchExclude`.
:::

### isolate

- **Tipo:** `boolean`
- **Predeterminado:** `true`

Aísla el entorno de cada archivo de pruebas. No funciona cuando se deshabilita [`--threads`](#threads).

### coverage

- **Tipo:** `CoverageC8Options | CoverageIstanbulOptions`
- **Predeterminado:** `undefined`

Se puede utilizar [`c8`](https://github.com/bcoe/c8) o [`istanbul`](https://istanbul.js.org/) para la cobertura.

#### provider

- **Tipo:** `'c8' | 'istanbul'`
- **Predeterminado:** `'c8'`

Utilizar `provider` para seleccionar la herramienta de cobertura.

#### CoverageC8Options

Utilizado cuando se define `provider: 'c8'`. Las opciones de cobertura son pasadas a [`c8`](https://github.com/bcoe/c8).

#### CoverageIstanbulOptions

Utilizado cuando se define `provider: 'istanbul'`

##### exclude

- **Tipo:** `string[]`
- **Predeterminado:** `[]`

Lista de archivos excluídos de la cobertura en el formato de patrones globales.

##### skipFull

- **Tipo:** `boolean`
- **Predeterminado:** `false`

No mostrar archivos con 100% de cobertura para declaraciones, ramas y funciones.

##### perFile

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Verificar los umbrales (thresholds) por archivo.

##### lines

- **Tipo:** `number`

Umbral para líneas.

##### functions

- **Tipo:** `number`

Umbral para funciones.

##### branches

- **Tipo:** `number`

Umbral para ramas.

##### statements

- **Tipo:** `number`

Umbral para declaraciones.

##### ignoreClassMethods

- **Tipo:** `string[]`
- **Predeterminado:** []

Lista de nombres de métodos de clases a ignorar en la cobertura.

##### watermarks

- **Tipo:**
<!-- eslint-skip -->

```ts
{
  statements?: [number, number],
  functions?: [number, number],
  branches?: [number, number],
  lines?: [number, number]
}
```

- **Predeterminado:**
<!-- eslint-skip -->

```ts
{
  statements: [50, 80],
  functions: [50, 80],
  branches: [50, 80],
  lines: [50, 80]
}
```

Valores predeterminados de declaraciones, funciones, ramas y líneas.

### testNamePattern

- **Type** `string | RegExp`

Correr las pruebas con nombres completos que concuerden con el patrón.
En caso de agregar `OnlyRunThis` a esta propiedad, las pruebas que no contengan la palabra `OnlyRunThis` en el nombre de la prueba serán omitidas.

```js
import { expect, test } from "vitest";

// ejecutado
test("OnlyRunThis", () => {
  expect(true).toBe(true);
});

// omitido
test("doNotRun", () => {
  expect(true).toBe(true);
});
```

### open

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Abre la UI de Vitest (WIP)

### api

- **Tipo:** `boolean | number`
- **Predeterminado:** `false`

Escucha un puerto y sirve la API. Cuando se define como `true`, el puerto predeterminado es 51204.

### clearMocks

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Llamará [`.mockClear()`](/api/#mockclear) en todas las funciones espías antes de cada prueba. Esto limpia el historial de la función, pero no reinicia su implementación a la predeterminada.

### mockReset

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Llamará [`.mockReset()`](/api/#mockreset) en todas las funciones espías antes de cada prueba. Esto limpia el historial de la función y reinicia su implementación a una función vacía (que retorna `undefined`).

### restoreMocks

- **Tipo:** `boolean`
- **Predeterminado:** `false`

Llamará [`.mockRestore()`](/api/#mockrestore) en todas las funciones espías antes de cada prueba. Esto limpia el historial de la función y reinicia su implementación a la original.

### transformMode

- **Tipo:** `{ web?, ssr? }`

Determina el método de transformación de los módulos.

#### transformMode.ssr

- **Tipo:** `RegExp[]`
- **Predeterminado:** `[/\.([cm]?[jt]sx?|json)$/]`

Utiliza la transformación SSR para los archivos especificados.<br>
Los plugins de Vite recibirán `ssr: true` cuando se procesen esos archivos.

#### transformMode&#46;web

- **Tipo:** `RegExp[]`
- **Predeterminado:** _modules other than those specified in `transformMode.ssr`_

Primero hace una transformación normal (apuntando al navegador), luego realiza una reescritura SSR para correr el código en Node.<br>
Los plugins de Vite recibirán `ssr: false` cuando se procesen esos archivos.

Cuando se utiliza JSX con otros frameworks que no sean React (por ejemplo. Vue JSX o SolidJS), quizás se necesite configurar de la siguiente manera para que los archivos `.tsx` / `.jsx` sean transformados como componentes del lado del cliente:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
});
```

### snapshotFormat

- **Tipo:** `PrettyFormatOptions`

Opciones de formato para las instantáneas (snapshots). Estas opciones son pasadas a [`pretty-format`](https://www.npmjs.com/package/pretty-format).

### resolveSnapshotPath

- **Type**: `(testPath: string, snapExtension: string) => string`
- **Default**: guarda las instantáneas en el directorio `__snapshots__`

Pisa el directorio predeterminado para las instantáneas. Por ejemplo, para guardar las instantáneas junto al archivo de pruebas:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
});
```

### allowOnly

- **Type**: `boolean`
- **Default**: `false`

Permite las pruebas y series que estén marcadas como `only`.

### dangerouslyIgnoreUnhandledErrors

- **Type**: `boolean`
- **Default**: `false`

Ignora los error que no sean atrapados.

### passWithNoTests

- **Type**: `boolean`
- **Default**: `false`

Vitest no fallará cuando no se encuentren pruebas para correr.

### logHeapUsage

- **Type**: `boolean`
- **Default**: `false`

Muestra la utilización de memoria luego de cada prueba. Útil para analizar problemas de memoria.

### css

- **Type**: `boolean | { include?, exclude? }`

Configurar si el CSS debe ser procesado. Cuando se excluye, los archivos CSS serán reemplazados con cadenas de caracteres vacías para evitar procesarlos.

La opción predeterminada procesa solamente los módulos CSS porque afectan las pruebas en tiempo de ejecución. JSDOM y Happy DOM no soportan inyectar CSS, con lo cual deshabilitar esta opción podría mejorar la performance.

#### css.include

- **Type**: `RegExp | RegExp[]`
- **Default**: `[/\.module\./]`

Patrón RegExp para archivos que deberían retornar CSS y serán procesados por Vite.

#### css.exclude

- **Type**: `RegExp | RegExp[]`
- **Default**: `[]`

Patrón RegExp para archivos que retornen CSS vacío.

### maxConcurrency

- **Type**: `number`
- **Default**: `5`

Número de pruebas que se permitirán ejecutar al mismo tiempo cuando sean marcadas con `test.concurrent`.

Las pruebas por encima de este límite serán encoladas para ejecutarse cuando haya un lugar disponible.

### cache

- **Type**: `false | { dir? }`

Opciones para configurar la política de cache de Vitest. En este momento Vitest guarda cache para correr primero las pruebas que más tarda y las pruebas fallidas primero.

#### cache.dir

- **Type**: `string`
- **Default**: `node_modules/.vitest`

Dirección del directorio de cache.

### sequence

- **Type**: `{ sequencer?, shuffle?, seed? }`

Opciones sobre como las pruebas serán ordenadas.

#### sequence.sequencer

- **Type**: `TestSequencerConstructor`
- **Default**: `BaseSequencer`

Clase personalizada que define métodos de fragmentación y ordenamiento. Se puede extender el `BaseSequencer` desde `vitest/node`, si sólo se necesita redefinir uno de los métodos `sort` y `shard`, pero ambos deben existir.

La fragmentación sucede antes del ordenamiento, y sólo si la opción `--shard` es provista.

#### sequence.shuffle

- **Type**: `boolean`
- **Default**: `false`

Cuando se quiere correr las pruebas de manera aleatoria, se puede habilitar esa opción, el argumento [`--sequence.shuffle`](/guide/cli) en el CLI.

Vitest usualmente utiliza cache para ordenar las pruebas, con lo cual las pruebas más largas comienzan primero - esto hace que las pruebas corran más rápido. Si las pruebas corren en orden aleatorio se pierde la mejora de performance, pero puede ser útil para encontrar pruebas que accidentalmente dependen de otras.

#### sequence.seed

- **Type**: `number`
- **Default**: `Date.now()`

Define la semilla (seed) para el método aleatorio, siempre y cuando las pruebas se ejecuten de esta manera.
