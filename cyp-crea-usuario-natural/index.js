
// asignacion de variable app con express
// var express = require('express');
var body_Parser = require('body-parser');
// var request = require('request');

// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
const restify = require('restify');
const simplifiedHystrixjs = require('../cyp-crea-usuario-natural/node_modules/simplified-hystrixjs/lib/index');

const app = restify.createServer({ name: 'cyp-crea-usuario-natural' });
const puerto = 5002;

app.use(restify.plugins.queryParser());
app.use(body_Parser.urlencoded({extended:false }));
app.use(body_Parser.json());

app.listen(puerto, function () {
  console.log('%s listening at %s', app.name, puerto)
})

// ------------------ Metodos --------------------------------------------------
function creausuarionatural(param) {
  return new Promise(function(resolve, reject) {
    // setTimeout(function () {
      resolve(
          param
        )
    // }, 1000);
  });
};

const serviceCommand = simplifiedHystrixjs.createHystrixCommands(creausuarionatural, {
  name : 'CYP',
  isFailure : 'Hystrix failover'
});


//post creacion usuario natural
app.post('/api/v1/usuariopagador/UsuarioPNatural/generar', function (req, res) {
    
  var soap = require('soap');
  var url ='https://sicexsagqa.sag.gob.cl/CPyTServices/CreateCPyTUserPort.svc?wsdl';
  var args = 
        {
          // UserName: req.query.UserName,
          // Password: req.query.Password,
          // Email: req.query.Email,
          // Question: req.query.Question,
          // Answer: req.query.Answer,
          // RazonSocial: req.query.RazonSocial,
          // Nombre: req.query.Nombre,
          // Apellido: req.query.Apellido,
          // Telefono: req.query.Telefono,
          // Celular: req.query.Celular,
          // Calle: req.query.Calle,
          // NumeroDomicilio: req.query.NumeroDomicilio,
          // Sector: req.query.Sector,
          // Region: req.query.Region,
          // Comuna: req.query.Comuna,
          // CategoriaDireccion: req.query.CategoriaDireccion,
          // PersonaJuridica: req.query.PersonaJuridica,
          // PersonaJuridicaExtranjera: req.query.PersonaJuridicaExtranjera,
          // PersonaNatural: req.query.PersonaNatural,
          // PersonaNaturalExtranjero: req.query.PersonaJuridicaExtranjera,
          // SexoPersonaNatural: req.query.SexoPersonaNatural,
          // User: req.query.User,
          // Token: req.query.Token 
          UserName: req.body.UserName,
          Password: req.body.Password,
          Email: req.body.Email,
          Question: req.body.Question,
          Answer: req.body.Answer,
          RazonSocial: req.body.RazonSocial,
          Nombre: req.body.Nombre,
          Apellido: req.body.Apellido,
          Telefono: req.body.Telefono,
          Celular: req.body.Celular,
          Calle: req.body.Calle,
          NumeroDomicilio: req.body.NumeroDomicilio,
          Sector: req.body.Sector,
          Region: req.body.Region,
          Comuna: req.body.Comuna,
          CategoriaDireccion: req.body.CategoriaDireccion,
          PersonaJuridica: req.body.PersonaJuridica,
          PersonaJuridicaExtranjera: req.body.PersonaJuridicaExtranjera,
          PersonaNatural: req.body.PersonaNatural,
          PersonaNaturalExtranjero: req.body.PersonaJuridicaExtranjera,
          SexoPersonaNatural: req.body.SexoPersonaNatural,
          User: req.body.User,
          Token: req.body.Token 
        }
  
        // Creacion de cliente soap para la llamada WebService
    soap.createClient(url, function(err, client) {
        client.createCPyTUser(args, async function(err, result) {
          // res.send({ result });
          response =  await serviceCommand.creausuarionatural(result);
          res.send(response);
          // res.end(JSON.stringify(result));
            
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
    app: 'crea-usuarioPNatural',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'http://localhost:5002',
    healthCheckUrl: 'http://localhost:5002/health',
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

// // ------------------ Servidor Configuracion --------------------------------------------
// var server = app.listen(5002, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//   console.log('Listening at http://%s:%s', host, port);
// });


