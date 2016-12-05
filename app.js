
/**
 * Module dependencies.
 */
var Prismic = require('prismic-nodejs');
var app = require('./config');
var PORT = app.get('port');
var PConfig = require('./prismic-configuration');

app.listen(PORT, function() {
  console.log('Point your browser to http://localhost:' + PORT);
});

// Function to render the 404 page
function render404(req, res, message) {
  return res.status(404).render('error', {message: message});
}

// Connects to the API
app.use((req, res, next) => {
  Prismic.api(PConfig.apiEndpoint,{accessToken: PConfig.accessToken, req: req})
  .then((api) => {
    req.prismic = {api: api};
    res.locals.ctx = {
      endpoint: PConfig.apiEndpoint,
      linkResolver: PConfig.linkResolver
    };
    next();
  }).catch(function(err) {
    if (err.status == 404) {
      render404(req, res, 'There was a problem connecting to your API. Please configure your API-Endpoint in your configuration file.');
    } else {
      res.status(500).render('error', {message: err});
    }
  });
});


// Query the site navigation with every route
app.route('*').get((req, res, next) => {
  req.prismic.api.getSingle('navigation').then(function(navContent){
    
    // Define the navigation content
    res.locals.navContent = navContent;
    next();
  });
});


// Route used when integrating the prismic.io preview functionality
app.route('/preview').get(function(req, res) {
  return Prismic.preview(req.prismic.api, PConfig.linkResolver, req, res);
});


// Route for pages
app.route('/page/:uid').get(function(req, res) {
  
  // Define the UID from the url
  var uid = req.params.uid;
  
  // Query the page by its uid
  req.prismic.api.getByUID('page', uid).then(function(pageContent) {
    
    // Render the 404 page if this uid is not found
    if(!pageContent) {
      return render404(req, res);
    }
    
    // Render the page
    res.render('page', { pageContent: pageContent });
  });
});


// Route for the homepage
app.route('/').get(function(req, res){
  
  // Query the homepage
  req.prismic.api.getSingle('homepage').then(function(pageContent) {
    
    // Render the 404 page if this uid is not found
    if(!pageContent) {
      return render404(req, res, "Could not find a homepage document in your content repository.");
    }
    
    // Render the homepage
    res.render('homepage', { pageContent: pageContent });
  });
});


// Catch any other route and render the 404 page
app.route('*').get(function(req, res) {
  render404(req, res);
});
