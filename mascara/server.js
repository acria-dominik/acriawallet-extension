const express = require('express')
const browserify = require('browserify')
const watchify = require('watchify')
const babelify = require('babelify')

const zeroBundle = createBundle('./src/mascara.js')
const controllerBundle = createBundle('./src/dapp-connection.js')
const popupBundle = createBundle('./src/popup.js')
const swBuild = createBundle('./src/background.js')

const appBundle = createBundle('./example/index.js')

//
// Iframe Server
//

const iframeServer = express()

// serve popup window
iframeServer.get('/popup/scripts/popup.js', function(req, res){
  res.send(popupBundle.latest)
})
iframeServer.use('/popup', express.static('../dist/chrome'))

// serve controller bundle
iframeServer.get('/controller.js', function(req, res){
  res.send(controllerBundle.latest)
})
iframeServer.get('/popup/sw-build.js', function(req, res){
  console.log('/sw-build.js')
  res.setHeader('Content-Type', 'application/javascript')
  res.send(swBuild.latest)
})

// serve background controller
iframeServer.use(express.static('./server'))

// start the server
const mascaraPort = 9001
iframeServer.listen(mascaraPort)
console.log(`Mascara service listening on port ${mascaraPort}`)


//
// Dapp Server
//

const dappServer = express()

// serve metamask-lib bundle
dappServer.get('/zero.js', function(req, res){
  res.send(zeroBundle.latest)
})

// serve dapp bundle
dappServer.get('/app.js', function(req, res){
  res.send(appBundle.latest)
})

// serve static
dappServer.use(express.static('./example'))

// start the server
const dappPort = '9002'
dappServer.listen(dappPort)
console.log(`Dapp listening on port ${dappPort}`)

//
// util
//

function serveBundle(entryPoint){
  const bundle = createBundle(entryPoint)
  return function(req, res){
    res.send(bundle.latest)
  }
}

function createBundle(entryPoint){

  var bundleContainer = {}

  var bundler = browserify({
    entries: [entryPoint],
    cache: {},
    packageCache: {},
    plugin: [watchify],
  })

  bundler.on('update', bundle)
  bundle()

  return bundleContainer

  function bundle() {
    bundler.bundle(function(err, result){
      if (err) throw err
      console.log(`Bundle updated! (${entryPoint})`)
      bundleContainer.latest = result.toString()
    })
  }

}
