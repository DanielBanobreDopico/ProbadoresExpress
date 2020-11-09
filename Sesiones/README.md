# Autenticación clásica mediante cookie de sesión
* Es completamente independiente del cliente. Todo el proceso se produce del lado del servidor. El cliente no dispone de mecanismos para modificar el estado de la autenticación.
* Emplea tecnologías estandar. Todos los clientes comunes disponen de la capacidad de gestionar cookies.
* Las necesidades para el trabajo con cookies en cualquier tipo de escenario están sobradamente cubiertas mediante todo tipo de soluciones debido a lo extensivo de su uso.
## Bases
* Se emite una cookie de sesión con un código diferente a cada cliente.
* La cookie de sesión sólo contiene un código de identificación, no el estado de la sesión. El cliente no puede modificar el estado de su sesión modificando la cookie.
* El backend recuerda el código de cada identificación emitida y información asociada a ella, como si se a autenticado o no.
* Las cookies están firmadas por el backend, de modo que sólo el backend puede emitirlas.
* HTTP incorpora en su estandar mecanismos para evitar el envío de cookies fuera de canales seguros: https://www.npmjs.com/package/express-session#user-content-cookiesecure