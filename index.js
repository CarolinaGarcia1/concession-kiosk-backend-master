const  express  =  require ( 'express' ) ;
 aplicación  constante =  express ( ) ;
const  host  =  proceso . env . IP   ||  '0.0.0.0' ;
 puerto  constante =  proceso . env . PUERTO  ||  8080 ;
const  mongo  =  require ( 'mongodb' ) . MongoClient ;

const  mongoUri  =  proceso . env . uri ;
const  mongoUsername  =  proceso . env . nombre de usuario  ||  proceso . env . MONGODB_USER ;
const  mongoPassword  =  proceso . env . contraseña  ||  proceso . env . MONGODB_PASSWORD ;
const  dbName  =  proceso . env . nombre_base_datos  || 
			   proceso . env . MONGODB_DBNAME  || 
			   proceso . env . MONGODB_DATABASE  ||
			   'sampledb' ;
const  dbServiceName  =  proceso . env . DATABASE_SERVICE_NAME  ||  'localhost' ;

var  dbConnectionUrl ;

// Si se ha adjuntado el secreto de monogo, modifique el URI proporcionado para incluir
// credenciales de autenticación
si  ( mongoUri )  {
	var  auth  =  mongoUsername  +  ':'  +  mongoPassword  +  '@'
	var  piezas  =  mongoUri . split ( '//' ) ;
	dbConnectionUrl  =  piezas [ 0 ]  +  '//'  +  auth  +  piezas [ 1 ]  +  '/'  +  dbName ;
}
else  if  ( proceso . env . MONGODB_URL ) {
	dbConnectionUrl  =  proceso . env . MONGODB_URL  ||  'mongodb: // localhost: 27017 / sampledb' ;
}  más  {
	dbConnectionUrl  =  'mongodb: //'  +  mongoUsername  +  ':'  + 
					mongoPassword  +  '@'  + 
					dbServiceName  +  ': 27017 /' 
					+  dbName ;
}

aplicación . get ( '/ ticketNumber' ,  function ( req ,  res ,  next )  {
	let  newTicketNumber  =  100 ;
	mongo . connect ( dbConnectionUrl ,  ( err ,  cliente )  =>  {
		si  ( err )  {
		  consola . error ( err ) ;
		  res . enviar ( { éxito : falso ,  resultado : 9999 } ) ;
		}  más  {
			const  db  =  cliente . db ( dbName ) ;
			 colección  constante =  db . colección ( 'pedidos' ) ;
			colección . buscar ( { } ) . contar ( ) . entonces ( ( n )  =>  {
				si  ( n  >  0 )  {
					colección . encontrar ( ) . sort ( { ticketNumber : - 1 } ) . límite ( 1 ) . toArray ( ( err ,  elementos )  =>  {
						deja que el  boleto más alto  =  artículos [ 0 ] . ticketNumber ;
						newTicketNumber  =  boleto más alto  +  1 ;
						colección . insertOne ( { ticketNumber : newTicketNumber ,  order : req . query } ,  ( err ,  result )  =>  {
							consola . log ( 'err:'  +  err ,  'resultado:'  +  resultado ) ;
						} ) ;
						res . enviar ( { éxito : verdadero ,  resultado : nuevoNumeroTicket ,  orden : req . consulta } ) ;
					} ) ;
				}  más  {
					colección . insertOne ( { ticketNumber : newTicketNumber ,  order : req . query } ,  ( err ,  result )  =>  {
						consola . log ( 'err:'  +  err ,  'resultado:'  +  resultado ) ;
					} ) ;
					res . enviar ( { éxito : verdadero ,  resultado : nuevoNumeroTicket ,  orden : req . consulta } ) ;
				}
			} ) . atrapar ( ( err )  =>  {
				consola . log ( err ) ;
				res . enviar ( { éxito : falso ,  resultado : 999 } ) ;
			} ) ;
		}
	} ) ;
} ) ;

/ * con fines de depuración * /
aplicación . get ( '/ allorders' ,  function  ( req ,  res ,  next )  {
	var  ordersList ;

	mongo . connect ( dbConnectionUrl ,  ( err ,  cliente )  =>  {
		si  ( err )  {
		  consola . error ( err )
		  regreso
		}
		consola . log ( dbConnectionUrl ) ;
		const  db  =  cliente . db ( dbName ) ;
		 colección  constante =  db . colección ( 'pedidos' ) ;
		colección . encontrar ( ) . toArray ( ( err ,  elementos )  =>  {
			ordersList  =  artículos ;
			consola . log ( ordersList ) ;
			res . enviar ( { éxito : verdadero ,  resultado : lista de pedidos } ) ;
		} ) ;
	} ) ;
} ) ;

aplicación . get ( '/ debug' ,  function ( req ,  res ,  next )  {

	var  details  =  {
		"mongo_url" : dbConnectionUrl ,
		"conectado" : falso
	} ;

	mongo . connect ( dbConnectionUrl ,  ( err ,  cliente )  =>  {
		si  ( err )  {
			consola . error ( err )
		}  más  {
			consola . log ( 'Conectado a Mongo' )
			detalles [ "conectado" ]  =  verdadero ;
			consola . log ( "Detalles actualizados" )
		}
		res . enviar ( detalles ) ;
	} ) ;
} ) ;

aplicación . use ( function ( err ,  req ,  res ,  next )  {
	consola . error ( err . pila ) ;
	res . estado ( 500 ) . enviar ( 'Algo salió mal' )
} ) ;

aplicación . escuchar ( puerto ,  host ) ;
consola . log ( 'Concession Kiosk Backend comenzó en:'  +  host  +  ':'  +  puerto ) ;