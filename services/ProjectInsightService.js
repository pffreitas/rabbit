var fs = require('fs'),
    mkdirp = require('mkdirp'),
    arch = require('./Architecture');

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

function getProjectInsight(projectName, insightName) {

    var projectWd = getProjectWorkDir(projectName);
    var contents = fs.readFileSync(projectWd + '/' + insightName, {
        encoding: 'UTF-8'
    });

    var data = JSON.parse(contents);

    var grailsArch = arch.getArchitecture('grails'); //TODO hardcoded, until otherwise
    grailsArch.inspectFiles(data);

    data.forEach(function (i) {
        console.log(i.file + " -> " + i.tags);
    });

    return data;
}

function getInsightProjects() {
    var model = [];
    var projects = fs.readdirSync('./projects');
    projects.forEach(function (i) {
        var insights = fs.readdirSync('./projects/' + i);
        model.push({
            project: i,
            files: insights
        });
    });
    return model;
}

exports.getInsightProjects = getInsightProjects;
exports.getProjectInsight = getProjectInsight;
exports.storeProjectInsight = storeProjectInsight;