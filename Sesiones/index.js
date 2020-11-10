// https://www.npmjs.com/package/express-session

const express = require('express');
const multer  = require('multer');
const session = require('express-session');

const mimeParser = multer();

const appPort = 3000;

/**
 * La siguiente variable contiene un valor aleatorio. Debes de generar tu propio valor.
 * Hace impredecibles para terceros las identidades de las sesiones.
 * Puedes hacerlo ejecutando el siguiente comando en el terminal se Linux:
 *      $ openssl rand -base64 33
 */
const secret = "s4VbV3z4hjlTApzzQYalJRpPUBbacSUFZ3sTZ4MS7aqa"
const sessionOptions = {
    secret: secret,
    cookie: {},
}

var app = express();

app.use(session(sessionOptions));

/**
 * Por simplicidad, empleamos un objeto con los datos de autenticación.
 * Normalmente esta información estará en una base de datos o algún servicio de autenticación.
 */
const users = {
    "frida": "1234",
    "toño": "abcd",
}

function autenticate(username,password) {
    /**
     * Modifica esta función según tus necesidades.
     * Comprueba si las credenciales son correctas y retorna 'true' o 'false' según corresponda.
     */
    if ( users.hasOwnProperty(username) && users[username] === password ) {
        console.log('Usuario y contraseña correctos');
        return true;
    } else {
        console.log('Usuario y contraseña no validos')
        return false;
    }
}

function autenticatedSession (req,res,next) {
    /**
     * Middleware que verifica si la petición pertenece a una sesión iniciada.
     * En caso contrario, contesta con un error de no autorizado.
     * Añadiremos este middleware a todos los endpoints a los que no permitamos acceder sin iniciar sesión.
     * Status codes: https://developer.mozilla.org/es/docs/Web/HTTP/Status
     */
    if ( ! req.session.hasOwnProperty('authenticated') || req.session.authenticated !== true ) {
        console.log('Petición no autorizada.')
        res.sendStatus(403);
    } else {
        console.log('Petición autorizada.')
        next();
    }
}

app.post('/login/',mimeParser.none(), (req,res)=>{
    /**
     * Recibe los datos del formulario de login.
     * Comprueba la validez de los datos.
     * Si los datos son validos, marca la sesión como autenticada.
     */
    var username = req.body.username;
    var password = req.body.password;
    var validates = autenticate(username,password);
    req.session.authenticated = validates;
    res.send(JSON.stringify(validates));
});

app.post('/logout/',autenticatedSession,(req,res)=>{
    console.log('Cerrando sesión.')
    req.session.authenticated = false;
    res.sendStatus(200);
});

app.get( '/private/', autenticatedSession, function( req, res ) {
    /**
     * Si el middleware de autenticación lo permite muestra el área privada.
     */
    const secret = [
        'https://www.jesusda.com/docs/ebooks/ebook_memorias%20de%20un%20ingeniero.pdf',
        '42',
        'https://es.wikipedia.org/wiki/El_sentido_de_la_vida,_el_universo_y_todo_lo_dem%C3%A1s#El_n%C3%BAmero_42',
        'https://es.wikipedia.org/wiki/Bastard_Operator_from_Hell',
        'https://es.wikipedia.org/wiki/The_IT_Crowd',
    ];
    console.log('Dando respuestas a la vida.')
    return res.send( JSON.stringify(secret) ) ;
});

app.listen( appPort , ()=>{
    console.log(`Listo!: http://localhost:${appPort}/`)
}) ;