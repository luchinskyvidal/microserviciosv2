
// // asignacion de variable app con express
// var express = require('express');
// var bodyParser = require('body-parser');


// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// //test de histrix
// // 'use strict';

// // const app = express();
// // const commandFactory = require('express-hystrix');
// // const Toobusy = require('hystrix-too-busy');

// // // This is out main too busy function
// // function tooBusyFactory(config) {
// //     Toobusy.init(config);

// //     return function commandExecutor(command, req, res, next) {
// //         return new Promise((resolve, reject) => {
// //             Toobusy.getStatus(busy => {
// //                 setImmediate(next);
// //                 if (busy) {
// //                     return reject(new Error('TooBusy'));
// //                 }
// //                 resolve();
// //             });
// //         });
// //     };
// // }

// // // let's add a dashboard for easy viewing before toobusy
// // app.use('/hystrix', require('hystrix-dashboard')({
// //     idleTimeout: 4000,
// //     interval: 2000,
// //     proxy: true
// // }));

// // // add toobusy command before any other route
// // app.use(commandFactory({
// //     commandExecutorFactory: tooBusyFactory
// // }));

// // app.get('/hello', (req, res) => {
// //     // force some CPU work here
// //     let dummyStr = '';
// //     for (let i = 0; i < 10000; i++) {
// //         dummyStr += 'eiqweyqiwuyeiqwyeiqwy';
// //     }
// //     res.status(200).end('Hello World');
// // });

// // // start the server
// // app.listen(8000);
// // ------------------ Metodos --------------------------------------------------


// //cliente soap
// app.all('/api/v1/usuariopagador/', function (req, res) {
// var soap = require('soap');
// var url ='https://sicexsagqa.sag.gob.cl/CPyTServices/ValidateCPyTUserPort.svc?singleWsdl';
// var rut = req.query.rut;
// var dver = req.query.dv;
// var args = {Rut: rut, Dv: dver};

 
//           res.send('<html><body>'
// 		      + '<h1>Validar RUT</h1>'
		      
// 		      + '<form method="get" action="/api/v1/usuariopagador/buscar">'
//           + '<label for="rut">ingrese rut:</label>'
//           + '<input type="text" name="rut" id="rut">'
//           + '<label for="dv">ingrese digito verificador:</label>'
// 		      + '<input type="text" name="dv" id="dv" maxlength="1" size="2">'		
//           + '<input type="submit" value="Enviar"/>'
// 		      + '</form>'
// 		      + '</body></html>');
     
// })

// app.get('/api/v1/usuariopagador/buscar', function (req, res) {
//   var soap = require('soap');
//   var url ='https://sicexsagqa.sag.gob.cl/CPyTServices/ValidateCPyTUserPort.svc?singleWsdl';
//   var rut = req.query.rut;
//   var dver = req.query.dv;
//   var args = {Rut: rut, Dv: dver};
  
//     soap.createClient(url, function(err, client) {
//         client.ValidateCPyTUser(args, function(err, result) {
//           res.send({ result: result.Status.Respuesta });
            
//         });
//     });
//   })




// // ------------------ Eureka Configuracion --------------------------------------------

// const Eureka = require('eureka-js-client').Eureka;
// const portDiscovery = process.env.PORT;
// var hostDiscovery = process.env.DISCOVERY_HOST;
// const eureka = new Eureka({
  
//   instance: {
//     instanceId:'CYP-VALIDAR-RUT',
//     app: 'CYP-VALIDAR-RUT',
//     hostName: 'localhost',
//     ipAddr: '127.0.0.1',
//     statusPageUrl: 'http://localhost:5000',
//     healthCheckUrl: 'http://localhost:5000/health',
//     port: {
//       '$': 5000,
//       '@enabled': 'true',
//     },
//     vipAddress: 'nodejs-service',
//     dataCenterInfo: {
//       '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
//       name: 'MyOwn',
//     },
//     registerWithEureka: true,
//     fetchRegistry: true,
//   },
//   eureka: {
//     host: 'localhost',
//     port: 8761,
//     // host: hostDiscovery,
//     // port: portDiscovery,
//     servicePath: '/eureka/apps/'
//   }
// });
// eureka.logger.level('debug');
// eureka.start(function(error){
//   console.log(error || 'complete');
// });

// // ------------------ Servidor Configuracion --------------------------------------------
// var server = app.listen(5000, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//   console.log('Listening at http://%s:%s', host, port);
// });

// // // ----------------------- hystrix -----------------

// // const Brakes = require('../cyp-validar-rut/node_modules/brakes');
// // const circuitBreaker = require('opossum');
// // const http = require('http');
// // const globalStats = Brakes.getGlobalStats();
// // app.get('/url', (req, res) => {
// //       res.status(200).end('Hello World');
// //   });

// // function unreliableServiceCall() {
// //   return new Promise((resolve, reject) => {
// //     setTimeout(() => {
// //       iterations++;
// //       if (iterations === 10) {
// //         successRate = 0.6;
// //       }
// //       else if (iterations === 100) {
// //         successRate = 0.1;
// //       }
// //       else if (iterations === 200) {
// //         successRate = 1;
// //       }


// //       if (Math.random() <= successRate) {
// //         resolve();
// //       }
// //       else {
// //         reject();
// //       }
// //     }, timer);
// //   });
// // }



// // // const brake = new Brakes(unreliableServiceCall, {
// // //   statInterval: 1000,
// // //   threshold: 0.5,
// // //   circuitDuration: 15000,
// // //   timeout: 250,
// // //   name: eureka.instanceId,
// // //   fallback: () => Promise.resolve('Response from fallback')

// // // });
// // const route = 'http://localhost:5000/url';
// // const circuitBreakerOptions = {
// //   timeout: 500,
// //   maxFailures: 3,
// //   name: eureka.instanceId,
// //   resetTimeout: 5000
// // };

// // // const circuit = new Brakes(() => $.get(route), circuitBreakerOptions);
// // // circuit.fallback(() => `${route} unavailable right now. Try later.`);
// // // circuit.on('success', (result) => $(element).append(JSON.stringify(result)));

// // const circuit =  new Brakes(() => $.get(route), circuitBreakerOptions);
// // circuit.fallback(() => `${route} unavailable right now. Try later.`);
// // circuit.on('success', (result) => $(element).append(JSON.stringify(result)));


// /*
// Create SSE Hysterix compliant Server
// */

// http.createServer((req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
//   res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   globalStats.getHystrixStream().pipe(res);
// }).listen(8081, () => {
//   console.log('---------------------');
//   console.log('Hysterix Server now live at localhost:8081/hystrix.stream');
//   console.log('---------------------');
// });

// /*
// Create SSE Hysterix compliant Server
// */
// http.createServer((req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
//   res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   globalStats.getHystrixStream().pipe(res);
// }).listen(8082, () => {
//   console.log('---------------------');
//   console.log('Hysterix Server now live at localhost:8082/hystrix.stream');
//   console.log('---------------------');
// });

// // setInterval(() => {
// //   circuit.exec()
// //     .then(() => {})
// //     .catch(() => {});
// // }, 100);


//------------simplyhindrix-----------
// initialize swagger-jsdoc
var swaggerJSDoc = require('swagger-jsdoc');
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:5000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};
var swaggerSpec = swaggerJSDoc(options);


const restify = require('restify');
const simplifiedHystrixjs = require('../cyp-validar-rut/node_modules/simplified-hystrixjs/lib/index');

const app = restify.createServer({ name: 'simplified-hystrixjs' });
const puerto = 5000;

app.use(restify.plugins.queryParser());





// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});





app.listen(puerto, function () {
  console.log('%s listening at %s', app.name, puerto)
})

//--------- servicio soap v2 con simply histrix

function validarut(param) {
  return new Promise(function(resolve, reject) {
    // setTimeout(function () {
      resolve(
          param
        )
    // }, 1000);
  });
};

const serviceCommand = simplifiedHystrixjs.createHystrixCommands(validarut, {
  name : 'CYP',
  isFailure : 'Hystrix failover'
});






app.get('/api/v1/usuariopagador/buscar', async function (req, res) {
  try {
        var rut = req.query.rut;
        var dver = req.query.dv;
        var args = {Rut: rut, Dv: dver};
//----------soap clietn--------
        var soap = require('soap');
        var url ='https://sicexsagqa.sag.gob.cl/CPyTServices/ValidateCPyTUserPort.svc?singleWsdl';
        var resultado;
        var response;
          soap.createClient(url,  function(err, client) {
                    client.ValidateCPyTUser(args, async function(err, result) {
                      response =  await serviceCommand.validarut(result.Status);
                      res.send(response);
                      // res.send({ result: result.Status.Respuesta });
                      

                        
                    });
          });

      } catch (e) {
        console.log(e);
      }
})



//---- mostrar en dashboard
simplifiedHystrixjs.createHystrixStream(app);

// ------------------ Eureka Configuracion --------------------------------------------

const Eureka = require('eureka-js-client').Eureka;
const portDiscovery = process.env.PORT;
var hostDiscovery = process.env.DISCOVERY_HOST;
const eureka = new Eureka({
  
  instance: {
    
    instanceId:'CYP-VALIDAR-RUT',
    app: 'CYP-VALIDAR-RUT',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'http://localhost:5000',
    healthCheckUrl: 'http://localhost:5000/health',
    port: {
      '$': puerto,
      '@enabled': 'true',
    },
    vipAddress: 'cyp-validar-rut',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    // host: hostDiscovery,
    // port: portDiscovery,
    servicePath: '/eureka/apps/'
  }
});
eureka.logger.level('debug');
eureka.start(function(error){
  console.log(error || 'complete');
});
