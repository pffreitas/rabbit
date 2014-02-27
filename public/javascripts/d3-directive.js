function buildFileTree(files) {
    var root = {
        name: "root",
        children: []
    };
    var pointer = root;

    _.each(files, function (i) {
        var dirs = i.filename.split('/');
        _.each(dirs, function (d, idx) {
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
    var w = 450,
        h = 450;
    d3.select(container).append("div").attr("id", "filepath").attr("width", w).attr("height", 30).attr("class", "filename");
    return d3.select(container).append("svg").attr("width", w).attr("height", h).append("svg:g").attr("id", "container").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");;
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

                var width = 450;
                var height = 450;
                var radius = Math.min(width, height) / 2;

                var colorScales = [colorbrewer.Greens, colorbrewer.Greys, colorbrewer.Oranges, colorbrewer.Blues, colorbrewer.Purples, colorbrewer.Reds, colorbrewer.YlGn, colorbrewer.BuGn, colorbrewer.BuPu];

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
                        return d.changes;
                    });


                function mouseleave(d) {
                    d3.selectAll("path").on("mouseover", null);

                    d3.selectAll("path")
                        .transition()
                        .duration(500)
                        .style("opacity", 1)
                        .each("end", function () {
                            d3.select(this).on("mouseover", mouseover);
                        });
                }

                function mouseover(d) {
                    var sequenceArray = getAncestors(d);

                    d3.selectAll("path")
                        .style("opacity", 0.2);

                    svg.selectAll("path")
                        .filter(function (node) {
                            return (sequenceArray.indexOf(node) >= 0);
                        })
                        .style("opacity", 1);

                    d3.select("#filepath").text(_.pluck(sequenceArray, "name").join('/'));
                }

                function arcTween(a) {
                    var i = d3.interpolate({
                        x: 0,
                        dx: 0
                    }, a);
                    return function (t) {
                        var b = i(t);
                        return arc(b);
                    };

                }

                svg.append("svg:circle")
                    .attr("r", radius)
                    .style("opacity", 0);


                var nodes = partition.nodes(root);
                _.chain(nodes).filter(function (d) {
                    return d.children && d.children.length > 1;
                }).map(function (d) {
                    return d.children;
                }).flatten().each(function (c, i) {
                    c.color = d3.scale.linear().range(colorScales[i][5]).domain([0, 3, 5, 7, 10]);
                });


                var path = svg.selectAll("path")
                    .data(nodes)
                    .enter().append("svg:path")
                    .attr("display", function (d) {
                        return d.depth ? null : "none";
                    })
                    .style("stroke", "white")
                    .style("fill", function (d) {
                        var p = d;
                        while (!_.has(p, "color")) {
                            p = p.parent ? p.parent : {
                                color: d3.scale.category20()
                            };
                        }
                        return d.color ? d.color(d.depth) : p.color(d.depth);
                    })
                    .style("fill-rule", "evenodd")
                    .style("opacity", 1)
                    .on("mouseover", mouseover);

                var duration = 500;
                path
                    .transition()
                    .duration(duration)
                    .delay(function (d, i) {
                        return i / nodes.length * duration;
                    })
                    .attrTween("d", arcTween);




                d3.select("#container").on("mouseleave", mouseleave);

            });
        }
    }
});