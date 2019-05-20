// var express = require('./node_modules/express');
var body_Parser = require('body-parser');

// var request = require("./node_modules/request");
// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// var cors = require('./node_modules/cors/lib'); 
// app.use(cors());
const restify = require('restify');
const simplifiedHystrixjs = require('../cero-papel-post-crea-documento/node_modules/simplified-hystrixjs/lib/index');

const app = restify.createServer({ name: 'cero-papel-post-crea-documento' });
const puerto = 5006;

app.use(restify.plugins.queryParser());
app.use(body_Parser.urlencoded({extended:false }));
app.use(body_Parser.json());

app.listen(puerto, function () {
  console.log('%s listening at %s', app.name, puerto)
})

function postCrearDocumento(param) {
  return new Promise(function(resolve, reject) {
    // setTimeout(function () {
      resolve(
          param
        )
    // }, 1000);
  });
};

const serviceCommand = simplifiedHystrixjs.createHystrixCommands(postCrearDocumento, {
  name : 'Cero-Papel',
  isFailure : 'Hystrix failover'
});



//get obtiene estado
app.post('/api/v1/CeroPapel/postCrearDocumento', function (req, res) {
    
    var soap = require('./node_modules/soap/lib/soap');
    var url ='https://ceropapeltest.sag.gob.cl/ws/ceropapel.php?wsdl';
    var args = 
    {
                Usuario: req.body.Usuario,
                Password: req.body.Password,
                TipoDocumento: req.body.TipoDocumento,
                NombreExpediente: req.body.TipoDocumento,
                NombreExpediente: req.body.NombreExpediente,
                datosDocumento: JSON.stringify(req.body.datosDocumento)

                }
  //   var args2 = 
  //   {
      
  //     Usuario: "nicolas.guerra@sag.gob.cl",
  //     Password: "123",
  //     TipoDocumento: 1030,
  //     NombreExpediente: "pruebahoy",
  //     datosDocumento: JSON.stringify(
  //     {
  //       antecedente:"Ejemplo Resolucion para WS",
  //       materia:"Ejemplificar el WS",
  //       vistos:["Que se hara un WS de comunicacion","Que se debe ejemplificar su uso"],
  //       considerando:["Que se es el primero que se hara"],
  //       resuelvo:["Construir un ejemplo","Enviar al SAG"],
  //       despedida:"Sin otro particular",
  //       etiquetas:["ejemplo","webservice","resolucion"],
  //       anexo_digital:[
  //           {
  //             nombre:"Anexo 1: Definiciones",
  //             nombre_archivo:"anexo1.pdf",
  //             binary:"ZHNhZHNhZHNhZA=="
              
  //           }
  //         ],
  //       anexo_fisico:[
  //           {
  //             nombre:"Contrato firmado",
  //             copias:"2",
  //             hojas:"1"
              
  //           }
  //         ]
        
  //     }
  //     )
      

  // }
  // JSON.stringify(args2.antecedente);

      // var args = req.body.data;

    //Creacion de cliente soap para la llamada WebService
      soap.createClient(url, function(err, client) {
          client.crearDocumento(args, async function(err, result) {
            // res.send({ result: result });
            // console.log('-------------------------------');
            // console.log(args);
            // console.log('-------------------------------');
            // console.log(args2);
            response =  await serviceCommand.postCrearDocumento(result);
            res.send(response);
            // res.send(JSON.stringify(result));
              
          });
      });
      
})

//---- mostrar en dashboard
simplifiedHystrixjs.createHystrixStream(app);
// // ------------------ Eureka Configuracion --------------------------------------------

const Eureka = require('./node_modules/eureka-js-client/lib').Eureka;

const eureka = new Eureka({
  instance: {
    // instanceId:'nodejs-service',
    app: 'CeroPapel-postCreaDocumento',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'https://localhost:5006',
    healthCheckUrl: 'https://localhost:5006/health',
    port: {
      '$': puerto,
      '@enabled': 'true',
    },
    vipAddress: 'nodejs-service',
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
    servicePath: '/eureka/apps/'
  }
});
eureka.logger.level('debug');
eureka.start(function(error){
  console.log(error || 'complete');
});
//---------------- Servidor Configuracion --------------------------------------------
// var server = app.listen(5006, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Listening at https://%s:%s', host, port);
//   });