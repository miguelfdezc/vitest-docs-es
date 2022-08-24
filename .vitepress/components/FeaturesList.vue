<template>
  <ul
    class="features-list"
    dir="auto"
    flex="~ col gap2 md:gap-3"
  >
    <ListItem>La configuración, los transformadores, los resolutores y los plugins de <a target="_blank" href="https://es.vitejs.dev" rel="noopener noreferrer">Vite</a>.</ListItem>
    <ListItem>¡Utiliza la misma configuración en tu aplicación para ejecutar las pruebas!</ListItem>
    <ListItem><a target="_blank" href="https://twitter.com/antfu7/status/1468233216939245579" rel="noopener noreferrer">Modo de observación inteligente e instantáneo, ¡como HMR para pruebas!</a></ListItem>
    <ListItem>Pruebas de componentes para Vue, React, Svelte, Lit y más</ListItem>
    <ListItem>Compatibilidad inmediata con TypeScript y JSX</ListItem>
    <ListItem>Await de alto nivel, con ESM como primera opción</ListItem>
    <ListItem>Workers multihilo a través de <a target="_blank" href="https://github.com/Aslemammad/tinypool" rel="noopener noreferrer">tinypool</a></ListItem>
    <ListItem>Filtrado, tiempos de espera, concurrencia para conjuntos de pruebas y pruebas</ListItem>
    <ListItem>
      <a href="/guide/snapshot">
        Instantáneas compatibles con Jest
      </a>
    </ListItem>
    <ListItem><a target="_blank" href="https://www.chaijs.com/" rel="noopener noreferrer">Chai</a> integrado para aserciones + APIs compatibles con <a target="_blank" href="https://jestjs.io/docs/expect" rel="noopener noreferrer">Jest expect</a></ListItem>
    <ListItem><a target="_blank" href="https://github.com/Aslemammad/tinyspy" rel="noopener noreferrer">Tinyspy</a> integrado para mocks</ListItem>
    <ListItem><a target="_blank" href="https://github.com/capricorn86/happy-dom" rel="noopener noreferrer">happy-dom</a> o <a target="_blank" href="https://github.com/jsdom/jsdom" rel="noopener noreferrer">jsdom</a> para mocks del DOM</ListItem>
    <ListItem>Cobertura de código via <a target="_blank" href="https://github.com/bcoe/c8" rel="noopener noreferrer">c8</a> o <a target="_blank" href="https://istanbul.js.org/" rel="noopener noreferrer">istanbul</a></ListItem>
    <ListItem><a href="/guide/in-source">Pruebas en el origen</a> como en Rust</ListItem>
  </ul>
</template>

<style scoped>
.features-list li {
  list-style: none;
  display: flex;
  gap: 0.4rem;
  margin: 0;
}

.features-list {
  padding: 0;
}
</style>
