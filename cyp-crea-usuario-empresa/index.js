// var express = require('express');
var body_Parser = require('body-parser');

// var request = require("request");
// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// var cors = require('cors'); 
// app.use(cors());

const restify = require('restify');
const simplifiedHystrixjs = require('../cyp-crea-usuario-empresa/node_modules/simplified-hystrixjs/lib/index');

const app = restify.createServer({ name: 'cyp-crea-usuario-empresa' });
app.use(body_Parser.urlencoded({extended:false }));
app.use(body_Parser.json());
const puerto = 5001;

app.use(restify.plugins.queryParser());

app.listen(puerto, function () {
  console.log('%s listening at %s', app.name, puerto)
})

function creaempresa(param) {
  return new Promise(function(resolve, reject) {
    // setTimeout(function () {
      resolve(
          param
        )
    // }, 1000);
  });
};

const serviceCommand = simplifiedHystrixjs.createHystrixCommands(creaempresa, {
  name : 'CYP',
  isFailure : 'Hystrix failover'
});

//post creacion empresa
app.post('/api/v1/usuariopagador/empresa', function (req, res) {
    
    var soap = require('soap');
    var url ='https://sicexsagqa.sag.gob.cl/CPyTRegistroEmpresa/RegistroEmpresa.svc?singleWsdl';
    var args = 
    {
                // Rut: req.query.Rut,
                // RazonSocial: req.query.RazonSocial,
                // Direccion: req.query.Direccion,
                // Calle: req.query.Calle,
                // Numero: req.query.Numero,
                // Email: req.query.Email,
                // Telefono: req.query.Telefono,
                // Celular: req.query.Celular,
                // Region: req.query.Region,
                // Comuna: req.query.Comuna,
                // Sector: req.query.Sector,
                // 'Contraseña': req.query.Contraseña,
                // Pregunta: req.query.Pregunta,
                // Respuesta: req.query.Respuesta,
                // NombreArchivo: req.query.NombreArchivo,
                // TipoArchivo: req.query.TipoArchivo,
                // Archivo: req.query.Archivo,
                // Giro: req.query.Giro,
                // CodigoGiro: req.query.CodigoGiro

                Rut: req.body.Rut,
                RazonSocial: req.body.RazonSocial,
                Direccion: req.body.Direccion,
                Calle: req.body.Calle,
                Numero: req.body.Numero,
                Email: req.body.Email,
                Telefono: req.body.Telefono,
                Celular: req.body.Celular,
                Region: req.body.Region,
                Comuna: req.body.Comuna,
                Sector: req.body.Sector,
                'Contraseña': req.body.Contraseña,
                Pregunta: req.body.Pregunta,
                Respuesta: req.body.Respuesta,
                NombreArchivo: req.body.NombreArchivo,
                TipoArchivo: req.body.TipoArchivo,
                Archivo: req.body.Archivo,
                Giro: req.body.Giro,
                CodigoGiro: req.body.CodigoGiro

    }
      
              
    // Creacion de cliente soap para la llamada WebService
      soap.createClient(url, function(err, client) {
          client.RegistrarEmpresa(args, async function(err, result) {
            // res.send({ result: result });
            response =  await serviceCommand.creaempresa(result);
            res.send(response);
            // res.send(JSON.stringify(result));
              
          });
      });
      
})

//---- mostrar en dashboard
simplifiedHystrixjs.createHystrixStream(app);

// // ------------------ Eureka Configuracion --------------------------------------------

const Eureka = require('eureka-js-client').Eureka;

const eureka = new Eureka({
  instance: {
    // instanceId:'nodejs-service',
    app: 'CreaUsuarioEmpresa',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'http://localhost:5001',
    healthCheckUrl: 'http://localhost:5001/health',
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
// var server = app.listen(5001, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Listening at http://%s:%s', host, port);
//   });