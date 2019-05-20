// var express = require('./node_modules/express');
// var bodyParser = require('./node_modules/body-parser');

// var request = require("./node_modules/request");
// var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// var cors = require('./node_modules/cors/lib'); 
// app.use(cors());

const restify = require('restify');
const simplifiedHystrixjs = require('./node_modules/simplified-hystrixjs/lib/index');

const app = restify.createServer({ name: 'cero-papel-get-estado' });
const puerto = 5005;

app.use(restify.plugins.queryParser());

app.listen(puerto, function () {
  console.log('%s listening at %s', app.name, puerto)
})

function getEstadoDoc(param) {
  return new Promise(function(resolve, reject) {
    // setTimeout(function () {
      resolve(
          param
        )
    // }, 1000);
  });
};

const serviceCommand = simplifiedHystrixjs.createHystrixCommands(getEstadoDoc, {
  name : 'Cero-Papel',
  isFailure : 'Hystrix failover'
});

//get obtiene estado
app.get('/api/v1/CeroPapel/getEstado', function (req, res) {
    
    var soap = require('./node_modules/soap/lib/soap');
    var url ='https://ceropapeltest.sag.gob.cl/ws/ceropapel.php?wsdl';
    var args = {Usuario: req.query.Usuario,
                Password: req.query.Password,
                IdDocumento: req.query.IdDocumento
    }
      
              
    // Creacion de cliente soap para la llamada WebService
      soap.createClient(url, function(err, client) {
          client.getEstado(args, async function(err, result) {
            // res.send({ result: result });
            response =  await serviceCommand.getEstadoDoc(result);
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
    instanceId:'cero-papel-get-estado',
    app: 'cero-papel-get-estado',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'http://localhost:5005',
    healthCheckUrl: 'http://localhost:5005/health',
    port: {
      '$': puerto,
      '@enabled': 'true',
    },
    vipAddress: 'cero-papel-get-estado',
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
// var server = app.listen(5004, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Listening at http://%s:%s', host, port);
//   });