function buildFileTree(files) {
    var root = {
        name: "root",
        children: []
    };
    var pointer = root;

    _.each(files, function (i) {
        var dirs = i.filename.split('/');
        _.each(dirs, function (d) {
            var exists = _.find(pointer.children, function (e) {
                return e.name === d;
            });
            if (exists) {
                pointer = exists;
            } else {
                var n = {
                    name: d,
                    children: []
                };
                pointer.children.push(n);
                pointer = n;
            }
        });
        pointer.changes = i.changes;
        pointer = root;
    });

    return root;
}

function createSvg(container) {
    var w = 750,
        h = 600;
    d3.select(container).append("div").attr("id", "filepath").attr("width", w).attr("height", 30).attr("class", "filename");
    return d3.select(container).append("svg").attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");;
}

function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current);
        current = current.parent;
    }
    return path;
}

App.directive('overview', function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.overview, function (newVal) {
                if (!newVal) return;
                var commit = newVal;

                var root = buildFileTree(commit.files);

                var width = 750;
                var height = 600;
                var radius = Math.min(width, height) / 2;
                var colors = d3.scale.category20b();
                colors.domain(1, 1000);
                var arc = d3.svg.arc()
                    .startAngle(function (d) {
                        return d.x;
                    })
                    .endAngle(function (d) {
                        return d.x + d.dx;
                    })
                    .innerRadius(function (d) {
                        return Math.sqrt(d.y);
                    })
                    .outerRadius(function (d) {
                        return Math.sqrt(d.y + d.dy);
                    });

                var svg = createSvg(element[0]);

                var partition = d3.layout.partition()
                    .size([2 * Math.PI, radius * radius])
                    .value(function (d) {
                        console.log(d);
                        return d.changes;
                    });

                var nodes = partition.nodes(root);
                var path = svg.selectAll("path")
                    .data(nodes)
                    .enter().append("svg:path")
                    .attr("display", function (d) {
                        return d.depth ? null : "none";
                    })
                    .attr("d", arc)
                    .attr("fill-rule", "evenodd")
                    .style("stroke", "white")
                    .style("fill", function (d) {
                        return colors(d.name);
                    })
                    .style("opacity", 1)
                    .on("mouseover", function (d) {
                        var sequenceArray = getAncestors(d);

                        d3.selectAll("path")
                            .style("opacity", 0.3);

                        svg.selectAll("path")
                            .filter(function (node) {
                                return (sequenceArray.indexOf(node) >= 0);
                            })
                            .style("opacity", 1);

                        d3.select("#filepath").text(_.pluck(sequenceArray, "name").join('/'));
                    });


            });
        }
    }
});