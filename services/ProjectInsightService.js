var fs = require('fs'),
    mkdirp = require('mkdirp');

function storeProjectInsight(projectName, payload) {
    fs.exists(getProjectWorkDir(projectName), function (exists) {
        if (!exists) {
            mkProjectDir(projectName);
        }

        putNewInsight(projectName, payload);
    });
};

function putNewInsight(projectName, payload) {
    fs.writeFileSync(getProjectWorkDir(projectName) + '/insight_' + new Date().getTime(), payload);
}

function mkProjectDir(projectName) {
    mkdirp.sync(getProjectWorkDir(projectName));
}

function getProjectWorkDir(projectName) {
    return './projects/' + projectName;
}

function getProjectInsights(projectName) {
    var projectInsights = [];

    return {
        all: projectInsights
    }
}

exports.getProjectInsights = getProjectInsights;
exports.storeProjectInsight = storeProjectInsight;