
module.exports = (items, obj) => `
  <script src="/lib/react.development.js"></script>
  <script src="/lib/react-dom.development.js"></script>
  <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js"></script>

  ${items.map(item => {
    return `<script src="/services/${item}.js"></script>`;
  }).join('\n')}

  <script>
    ${items.map(item => `
      ReactDOM.hydrate(
        React.createElement(${item},${JSON.stringify(obj)} ),
        document.getElementById('${item}')
      );`).join('\n')}
  </script>
`;
