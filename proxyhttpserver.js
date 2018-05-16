const newrelic = require('newrelic');
const http = require('http');
const path = require('path');
const redis = require('redis');
const fs = require('fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const port = process.env.PORT || 3011;
http.globalAgent.maxSockets = Infinity;
http.globalAgent.keepAlive = true;



const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);
const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

// see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf
const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
};


const client = redis.createClient();
client.on('ready', () => {
  console.log('Redis is ready');
});

client.on('error', () => {
  console.log('Error in Redis');
});

const requestHandler = function (req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
	var num = req.url.split('/')[2];
	if(Number(num)){
		fs.readFile(path.join(__dirname, './public/index.html'), 'utf8', function(err, data){
          if (err){
          	//console.log(err)
            
          	res.writeHead(400);
          	res.end(err);
          }else{

	          res.writeHead(200, {'Content-Type': 'text/html'});
	          res.end(data, 'utf8');   
          }
        });  
    }   
    if (req.url.endsWith('sidebar.css')) { 
      //console.log(req.url);	
      const css = fs.createReadStream(path.join(__dirname, './public/sidebar.css'), 'utf8');
      
      res.writeHead(200, {'Content-Type': 'text/css'});
      css.pipe(res);
    }   
    if (req.url.endsWith('style.css')) { 
      //console.log(req.url); 
      const css = fs.createReadStream(path.join(__dirname, './public/style.css'), 'utf8');
      
      res.writeHead(200, {'Content-Type': 'text/css'});
      css.pipe(res);
    }   
    if (req.url.endsWith('Sidebar.js')) { 
      //console.log(req.url);	
      const bundle = fs.createReadStream(path.join(__dirname, './public/services/Sidebar.js'), 'utf8');
      
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      bundle.pipe(res);
    } 
   
    if(req.url.startsWith('/restaurants')){
    	
    	var id = Number(req.url.split("/")[3]);
    

      let components = renderComponents(services, {restaurantId: id});
      res.end(Layout(
        'FeastBeast',
        App(...components),
        Scripts(Object.keys(services), {restaurantId: id
          , isModal: true})
      ));

    }    
             
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {

  http.createServer(requestHandler).listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
  
  console.log(`Worker ${process.pid} started`);
}

