var minimatch = require("minimatch")

var types = {
    grails: new GrailsArchitecture()
}

exports.getArchitecture = function (type) {
    return types[type];
}



function GrailsArchitecture() {
    this.filetypes = [
        new GlobFileVisitor("*/grails-app/views/**/*.gsp", ["view"]),
        new GlobFileVisitor("*/test/**/*.groovy", ["test"]),
        new GlobFileVisitor("*/test/**/*Page.groovy", ["test", "page"]),
        new GlobFileVisitor("*/test/functional/**/*FunctionalSpec.groovy", ["test", "functional"]),
        new GlobFileVisitor("*/test/integration/**/*IntegrationSpec.groovy", ["test", "integration"])
    ];
}

GrailsArchitecture.prototype.inspectFiles = function (files) {

    for (i in files) {
        var file = files[i];

        for (x in this.filetypes) {
            var type = this.filetypes[x];
            type.visit(file);
        }
    }
}


function GlobFileVisitor(pattern, tags) {
    return {
        visit: function (file) {
            if (minimatch(file.filename, pattern)) {
                file.tags = tags
            }
        }
    }
}