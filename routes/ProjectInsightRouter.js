var ProjectInsightService = require('../services/ProjectInsightService');

function receiveProjectInsight(req, res) {
    var project = req.params.project;
    var payload = req.body.payload;

    if (payload === undefined) {
        res.send(401, 'Por favor, informe o parametro payload.');
        return null;
    }

    payload = JSON.stringify(payload, null, " ");

    ProjectInsightService.storeProjectInsight(project, payload);

    res.json({
        status: "OK"
    });
}

function getInsightProjects(req, res) {
    var projects = ProjectInsightService.getInsightProjects();
    res.json(projects);
}

function getProjectInsight(req, res) {
    var insight = ProjectInsightService.getProjectInsight(req.params.project, req.params.insight);
    res.json(insight);
}

exports.getProjectInsight = getProjectInsight;
exports.getInsightProjects = getInsightProjects;
exports.receiveProjectInsight = receiveProjectInsight;