var minimatch = require("minimatch")

var types = {
    grails: new GrailsArchitecture()
}

exports.getArchitecture = function (type) {
    return types[type];
}



function GrailsArchitecture() {
    this.filetypes = [
        new GlobFileVisitor("**/grails-app/views/**/*.gsp", ["view"]),
        new GlobFileVisitor("**/web-app/js/**/*.js", ["view", "js"]),

        new GlobFileVisitor("**/grails-app/controllers/**/*Controller.groovy", ["controller"]),

        new GlobFileVisitor("**/src/**/*Service*.*", ["service"]),
        new GlobFileVisitor("**/src/**/*Repository*.*", ["repository"]),

        new GlobFileVisitor("**/grails-app/i18n/**/*.properties", ["conf", "i18n"]),

        new GlobFileVisitor("**/test/**/*.groovy", ["test"]),
        new GlobFileVisitor("**/test/**/*Page.groovy", ["test", "page"]),
        new GlobFileVisitor("**/test/functional/**/*FunctionalSpec.groovy", ["test", "functional"]),
        new GlobFileVisitor("**/test/integration/**/*IntegrationSpec.groovy", ["test", "integration"])
    ];
}

GrailsArchitecture.prototype.inspectFiles = function (classes) {

    for (i in classes) {
        var clazz = classes[i];

        for (x in this.filetypes) {
            var type = this.filetypes[x];
            type.visit(clazz);
        }
    }
}


function GlobFileVisitor(pattern, tags) {
    return {
        visit: function (clazz) {
            if (minimatch(clazz.file, pattern)) {
                clazz.tags = tags
            }
        }
    }
}