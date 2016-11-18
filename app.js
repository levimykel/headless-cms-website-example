
/**
 * Module dependencies.
 */
var prismic = require('prismic-nodejs');
var app = require('./config');
var configuration = require('./prismic-configuration');
var PORT = app.get('port');

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});

// Error handling
function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send("404 not found");
  } else {
    res.status(500).send("Error 500: " + err.message);
  }
}

// Function to render the 404 page
function render404(req, res) {
  return res.status(404).render('404', {
    navContent: req.prismic.navContent
  });
}

// Connects to the API
app.use((req, res, next) => {
  prismic.api(configuration.apiEndpoint,{accessToken: configuration.accessToken, req: req})
    .then((api) => {
      req.prismic = {api: api}
      res.locals.ctx = {
      endpoint: configuration.apiEndpoint,
      linkResolver: configuration.linkResolver
    }
    next()
  }).catch(function(err) {
    if (err.status == 404) {
      res.status(404).send("There was a problem connecting to your API, please check your configuration file for errors.");
    } else {
      res.status(500).send("Error 500: " + err.message);
    }
  });
})


// Query the site navigation with every route
app.route('*').get((req, res, next) => {
  req.prismic.api.getSingle("navigation").then(function(navContent){
    
    // Give an error if no layout custom type is found
    if (!navContent) {
      handleError({status: 500, message: "No navigation document was found."}, req, res);
    }
    
    // Define the navigation content
    req.prismic.navContent = navContent
    next()
  })
});


// Route used when integrating the prismic.io preview functionality
app.route('/preview').get(function(req, res) {
  return prismic.preview(req.prismic.api, configuration.linkResolver, req, res);
});



/////////////////////// BEOFRE ADDING THE LAYOUT /////////////////////
//// Route for pages
//app.route('/:uid').get(function(req, res) {
//  
//  // Define the UID from the url
//  var uid = req.params.uid;
//  
//  // Query the page by its uid
//  req.prismic.api.getByUID("page", uid).then(function(pageContent) {
//    
//    // Render the 404 page if this uid is not found
//    if(!pageContent) {
//      render404(req, res);
//    }
//    
//    // Render the page
//    res.render('page', {
//      pageContent: pageContent
//    });
//  });
//});
////////////////////////////////////////////////////////////////////

/////////////////////// ADDING IN THE LAYOUT /////////////////////
// Route for pages
app.route('/:uid').get(function(req, res) {
  
  // Define the UID from the url
  var uid = req.params.uid;
  
  // Query the page by its uid
  req.prismic.api.getByUID("page", uid).then(function(pageContent) {
    
    // Render the 404 page if this uid is not found
    if(!pageContent) {
      render404(req, res);
    }
    
    // Render the page
    res.render('page', {
      pageContent: pageContent,
      navContent: req.prismic.navContent
    });
  });
});
//////////////////////////////////////////////////////////////////




/////////////////////// BEOFRE ADDING THE LAYOUT /////////////////////
//// Route for the homepage
//app.route('/').get(function(req, res){
//  
//  // Query the homepage
//  req.prismic.api.getSingle("homepage").then(function(pageContent) {
//    
//    // Render the 404 page if this uid is not found
//    if(!pageContent) {
//      render404(req, res);
//    }
//    
//    // Render the homepage
//    res.render('homepage', {
//      pageContent: pageContent
//    });
//  });
//});
////////////////////////////////////////////////////////////////////

/////////////////////// ADDING IN THE LAYOUT /////////////////////
// Route for the homepage
app.route('/').get(function(req, res){
  
  // Query the homepage
  req.prismic.api.getSingle("homepage").then(function(pageContent) {
    
    // Render the 404 page if this uid is not found
    if(!pageContent) {
      render404(req, res);
    }
    
    // Render the homepage
    res.render('homepage', {
      pageContent: pageContent,
      navContent: req.prismic.navContent
    });
  });
});
//////////////////////////////////////////////////////////////////
