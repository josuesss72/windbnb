const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
  // vamos a cargar la pagina de destino
  // utilizando un fetch para obtener el HTML
  const response = await fetch(url)
  const text = await response.text()
  // regex para extraer el contenido que necesitamos del texto HTML
  const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
  return data
}

const updatePage = (data) => {
  // como tiene que actualizar la vista
  document.body.innerHTML = data
  document.documentElement.scrollTop = 0
}

export const startViewTransition = () => {
  if(!checkIsNavigationSupported()) return
  window.navigation.addEventListener('navigate', (event) => {
    const toUrl = new URL(event.destination.url)

    // si navega a un destino externo lo ignoramos
    if(location.origin !== toUrl.origin) return

    // si navega dentro del mismo dominio interceptamos la navegacion
    event.intercept({
      async handler () {
        const data = await fetchPage(toUrl.pathname)
        // utilizar la Api View Transition 
        document.startViewTransition(updatePage(data))
      }
    })
  })
}
