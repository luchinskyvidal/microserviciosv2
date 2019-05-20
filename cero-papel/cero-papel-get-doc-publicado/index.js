// var express = require('./node_modules/express');
// var bodyParser = require('./node_modules/body-parser');

// var request = require("./node_modules/request");
// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// var cors = require('./node_modules/cors/lib'); 
// app.use(cors());
const restify = require('restify');
const simplifiedHystrixjs = require('../cero-papel-get-doc-publicado/node_modules/simplified-hystrixjs/lib/index');

const app = restify.createServer({ name: 'cero-papel-get-doc-publicado' });
const puerto = 5004;

app.use(restify.plugins.queryParser());

app.listen(puerto, function () {
  console.log('%s listening at %s', app.name, puerto)
})

//promesa
function getDocPublicado(param) {
  return new Promise(function(resolve, reject) {
    // setTimeout(function () {
      resolve(
          param
        )
    // }, 1000);
  });
};

const serviceCommand = simplifiedHystrixjs.createHystrixCommands(getDocPublicado, {
  name : 'Cero-Papel',
  isFailure : 'Hystrix failover'
});

//get obtiene estado
app.get('/api/v1/CeroPapel/getDocPublicado', function (req, res) {
    
    var soap = require('./node_modules/soap/lib/soap');
    var url ='https://ceropapeltest.sag.gob.cl/ws/ceropapel.php?wsdl';
    var args = {Usuario: req.query.Usuario,
                Password: req.query.Password,
                IdDocumento: req.query.IdDocumento
    }
      
              
    // Creacion de cliente soap para la llamada WebService
      soap.createClient(url, function(err, client) {
          client.getDocPublicado(args, async function(err, result) {
            // res.send({ result: result });
            response =  await serviceCommand.getDocPublicado(result);
            res.send(response);
            //res.send(JSON.stringify(result));
              
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
    app: 'CeroPapel-getDocPublicado',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'http://localhost:5004',
    healthCheckUrl: 'http://localhost:5004/health',
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
// var server = app.listen(5005, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Listening at http://%s:%s', host, port);
//   });