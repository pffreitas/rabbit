var ProjectInsightService = require('../services/ProjectInsightService');

function receiveProjectInsight(req, res) {
    var project = req.params.project;
    var payload = req.body.payload;

    if (payload === undefined) {
        res.send(401, 'Por favor, informe o parametro payload.');
        return null;
    }

    ProjectInsightService.storeProjectInsight(project, payload);

    res.json({
        status: "OK"
    });
}


exports.receiveProjectInsight = receiveProjectInsight;