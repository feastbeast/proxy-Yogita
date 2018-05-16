const newrelic = require('newrelic');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


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

app.get('/restaurants/:id', function(req, res) {
  let components = renderComponents(services, {restaurantId: req.params.id});
  res.end(Layout(
    'FeastBeast',
    App(...components),
    Scripts(Object.keys(services), {restaurantId: req.params.id, isModal: true})
  ));
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});