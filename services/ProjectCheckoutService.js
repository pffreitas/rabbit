var schedule = require('node-schedule');
var clone = require("nodegit").Repo.clone;
var open = require("nodegit").Repo.open;

function getProjects() {
    return [{
        name: "synchro-gov-social",
        url: "https://github.com/Syncchro/synchro-gov-social.git"
    }, {
        name: "doc-componentes",
        url: "https://github.com/Syncchro/doc-componentes.git"
    }, {
        name: "synchro-oauth-provider",
        url: "https://github.com/Syncchro/synchro-oauth-provider.git"
    }, {
        name: "synchro-workflow",
        url: "https://github.com/Syncchro/synchro-workflow.git"
    }, {
        name: "synchro-gui-grails",
        url: "https://github.com/Syncchro/synchro-gui-grails.git"
    }, {
        name: "synchro-foundation",
        url: "https://github.com/Syncchro/synchro-foundation.git"
    }, {
        name: "appref-model",
        url: "https://github.com/Syncchro/appref-model.git"
    }, {
        name: "appref-view",
        url: "https://github.com/Syncchro/appref-view.git"
    }, {
        name: "synchro-ctrlusu-grails",
        url: "https://github.com/Syncchro/synchro-ctrlusu-grails.git"
    }, {
        name: "synchro-integration",
        url: "https://github.com/Syncchro/synchro-integration.git"
    }, {
        name: "appref-arquitetura",
        url: "https://github.com/Syncchro/appref-arquitetura.git"
    }, {
        name: "synchro-hd-grails",
        url: "https://github.com/Syncchro/synchro-hd-grails.git"
    }];
}

function projectCheckout() {
    openRepo(getProjects()[0], function (gitRepo) {

    });
}

function openRepo(repo, callback) {
    open("./repos/" + repo.name, function (err, gitRepo) {
        if (err) {
            cloneRepo(repo, callback);
        } else {
            callback(gitRepo);
        }
    });
}

function cloneRepo(repo, callback) {
    clone(repo.url, "./repos/" + repo.name, null, function (err, gitRepo) {
        if (err) {
            throw err;
        } else {
            callback(gitRepo);
        }
    });
}

function scheduleProjectCheckout() {
    var job = schedule.scheduleJob('* * * * *', projectCheckout);
}

/* Public API */
exports.schedule = projectCheckout;
exports.projects = getProjects;