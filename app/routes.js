var Models = require('./models/SubjectViews');

module.exports = function(app) {

  // server routes ===========================================================
  app.get('/api/data', function(req, res) {
    Models.geofilemodel.find({}, function(err, data) {
      if (err)
        res.send(err);
      res.json(data);
    });
  });

  app.get('/api/chartdata', function(req, res) {
    var uidval = parseInt(req.query.uid);
    var figindxval = parseInt(req.query.figindx);
    var query = { 'UID': uidval, 'FIGINDX': figindxval }
    Models.warehousedatamodel.find(query, { '_id': 0, 'UID': 0, 'FIGINDX': 0 },function(err, data) {
      if (err)
        res.send(err);
      res.json(data);
    });
  });

   // frontend routes =========================================================
  app.get('/', function(req, res) {
    res.sendFile('./public/index.html');
  });

  app.get('/dashboard', function(req, res) {
    res.sendFile('index.html', { root: './public'});
  });

}
