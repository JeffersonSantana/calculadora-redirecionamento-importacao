const express = require('express')
const request = require('request')
const app = express()
const bodyParser = require('body-parser')
const valorPorPeso = 19
const porcentagemMinimo = 18
const porcentagemMaximo = 25
const faixaCorte = 900

let dolarHoje = {}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {

  var html = ''
  html += '<html>'
  html += '<head>'
  html += ' <!-- Global site tag (gtag.js) - Google Analytics -->'
  html += ' <script async src="https://www.googletagmanager.com/gtag/js?id=UA-115787743-1"></script>'
  html += ' <script>'
  html += '   window.dataLayer = window.dataLayer || [];'
  html += '   function gtag(){dataLayer.push(arguments);}'
  html += '   gtag("js", new Date());'
  html += '   gtag("config", "UA-115787743-1");'
  html += ' </script>'
  html += '<!-- Google Tag Manager -->'
  html += '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":'
  html += 'new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],'
  html += 'j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src='
  html += '"https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);'
  html += '})(window,document,"script","dataLayer","GTM-K8K3ZLM");</script>'
  html += '<!-- End Google Tag Manager -->'
  html += ' <title>Otavio Redirecionador | EUA | Paraguai | China</title>'
  html += ' <link rel="stylesheet" href="style.css" />'
  html += '</head>'
  html += '<body>'
  html += '<!-- Google Tag Manager (noscript) -->'
  html += '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K8K3ZLM"'
  html += 'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'
  html += '<!-- End Google Tag Manager (noscript) -->'
  html += ' <h1><img src="img/logo-redirecionebr-black.png" /></h1>'
  html += ' <p class="subtitulo"><strong>EUA | Paraguai | China</strong></p>'
  html += ' <form action="/calcular" method="post">'
  html += '   <p><label>Peso (kg): </label>'
  html += '   <input type="text" name="peso"/> <span>* Use ponto para decimais</span></p>'
  html += '   <p><label>Valor da Invoice (Dólar): </label>'
  html += '   <input type="text" name="valorInvoice"/> <span>* Use ponto para decimais</span></p>'
  if(req.query.menorQueCemDolar === 'true') {
    html += ' <p style="text-align: center; color: #990000; font-weight: bold">Valor da Invoice deve ser maior de 75 dólares para utilizar o serviço</p>'
  }
  if(req.query.maiorQueDezKgs === 'true') {
    html += ' <p style="text-align: center; color: #990000; font-weight: bold">Não pode ter mais que 10 kgs para utilizar o serviço</p>'
  }
  html += '   <input type="submit" value="Enviar"/>'
  html += ' </form>'
  html += '</body>'
  html += '</html>'

  res.send(html)
})

app.post('/calcular', (req, res) => {

  if(req.body.valorInvoice < 75) {
    res.redirect('/?menorQueCemDolar=true')
  }

  if(req.body.peso > 10) {
    res.redirect('/?maiorQueDezKgs=true')
  }

  var htmlRes = ''
  htmlRes += '<html>'
  htmlRes += '<head>'
  htmlRes += '  <!-- Global site tag (gtag.js) - Google Analytics -->'
  htmlRes += '  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-115787743-1"></script>'
  htmlRes += '  <script>'
  htmlRes += '    window.dataLayer = window.dataLayer || [];'
  htmlRes += '    function gtag(){dataLayer.push(arguments);}'
  htmlRes += '    gtag("js", new Date());'
  htmlRes += '    gtag("config", "UA-115787743-1");'
  htmlRes += '  </script>'
  htmlRes += '<!-- Google Tag Manager -->'
  htmlRes += '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":'
  htmlRes += 'new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],'
  htmlRes += 'j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src='
  htmlRes += '"https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);'
  htmlRes += '})(window,document,"script","dataLayer","GTM-K8K3ZLM");</script>'
  htmlRes += '<!-- End Google Tag Manager -->'
  htmlRes += '  <title>Otavio Redirecionador | EUA | Paraguai | China</title>'
  htmlRes += '  <link rel="stylesheet" href="style.css" />'
  htmlRes += '</head>'
  htmlRes += '<body>'
  htmlRes += '<!-- Google Tag Manager (noscript) -->'
  htmlRes += '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K8K3ZLM"'
  htmlRes += 'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'
  htmlRes += '<!-- End Google Tag Manager (noscript) -->'
  htmlRes += '  <h1><img src="img/logo-redirecionebr-black.png" /></h1>'
  htmlRes += '  <p class="subtitulo"><strong>EUA | Paraguai | China</strong></p>'
  htmlRes += '  <br />'
  htmlRes += '  <p class="resultado"><strong>Os custos da sua <br />importação será de:</strong>'
  htmlRes += '    <br />Cotação: R$ ' + parseFloat(dolarHoje.rates.BRL).toFixed(2) + '</p>'
  htmlRes += '  <p class="resultadoDolar">'
  htmlRes += '    <span>Frete: R$ ' + frete(req.body.peso).real + '</span>'
  htmlRes += '    <br /><span>Taxa de serviço: R$ ' + comissao(req.body.valorInvoice) + '</span>'
  htmlRes += '    <br /><span>Valor Total: R$ ' + parseFloat((parseFloat(comissao(req.body.valorInvoice)) + parseFloat(frete(req.body.peso).real))).toFixed(2) + '</span>'
  htmlRes += '  </p>'
  htmlRes += '</body>'
  htmlRes += '</html>'
  res.send(htmlRes)
})

function getDateTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return year + "-" + month + "-" + day;
}

//.rates.BRL //{"base":"USD","date":"2018-03-13","rates":{"BRL":3.243}}
function pegarDolarHoje() {
  var url = 'http://api.fixer.io/latest?base=USD&symbols=BRL';
  request(url, function(error, response, html) {
    if (!error) {
      var ret = JSON.parse(response.body);
      if(dolarHoje.date !== getDateTime()) {
        dolarHoje = ret
      }
    }
  });
}
pegarDolarHoje();

function converterReal(valor) { //10 * 3,242
  return parseFloat(valor * dolarHoje.rates.BRL).toFixed(2)
}

function frete(peso) {
  return {
    "real": converterReal(parseFloat(parseFloat(peso) * valorPorPeso).toFixed(2)),
    "dolar": parseFloat(parseFloat(peso) * valorPorPeso).toFixed(2)
  }
}

function comissao(vInvoice) {
  var comi = (converterReal(vInvoice) >= faixaCorte) ? porcentagemMinimo : porcentagemMaximo
  var calc = parseFloat(((parseFloat(vInvoice)) * parseFloat(comi)) / 100).toFixed(2)
  return converterReal(calc)
}

app.listen(process.env.PORT || 5000, () => console.log('Executando...'))
