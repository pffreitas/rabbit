function collectFiles(files, tag) {
    return _.filter(files, function (i) {
        return _.contains(i.tags, tag);
    });
}

function createSvg(container) {
    return d3.select(container).append("svg").attr("width", "100%").attr("height", 4000);
}

function rect(svg) {
    svg.append("rect")
        .style("fill", "#4AD5B4")
        .style("fill-opacity", .4)
        .attr("width", "95%")
        .attr("height", 200)
        .attr("rx", 5)
        .attr("ry", 5);
}

App.directive('overview', function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.overview, function (newVal) {
                if (!newVal) return;

                var commit = newVal;

                var viewFiles = collectFiles(commit.files, "view");
                var controllerFiles = collectFiles(commit.files, "controller");
                var serviceFiles = collectFiles(commit.files, "service");
                var repositoryFiles = collectFiles(commit.files, "repository");
                var confFiles = collectFiles(commit.files, "conf");
                var testFiles = collectFiles(commit.files, "test");

                var stacks = [viewFiles];

                var svg = createSvg(element[0]);

                var g = svg.selectAll("g").data(stacks).enter().append("g")
                g.append("rect")
                    .style("fill", "#4AD5B4")
                    .style("fill-opacity", .4)
                    .attr("width", "100%")
                    .attr("height", 200)
                    .attr("rx", 5)
                    .attr("ry", 5).attr("y", function (d, i) {
                        return i * 210;
                    });

                g.selectAll("g").data(function (d) {
                    return d;
                }).enter().append("g")
                    .attr("transform", function (d, i) {
                        return "translate(" + (i * 80) + ", 40)";
                    })
                    .append("circle")
                    .style("stroke", "gray")
                    .style("fill", "white")
                    .attr("r", 25);

            });
        }
    }
});