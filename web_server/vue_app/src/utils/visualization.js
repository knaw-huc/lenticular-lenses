import * as d3 from 'd3';

export function draw(popup, graph_parent, svg_name, svg_name_child) {
    let svg = d3.select(svg_name);

    var pi = Math.PI;
    var radius2 = 20;
    var radius = 200;
    var node_factor = 7;

    ////// NEW CODE
    var should_drag = false;
    var selected_node, clicked_node, graph_child;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var clicks = 0

    // var svg = d3.select(".parent")
    var svg_child = d3.select(svg_name_child)
    var simulation_parent = simulator(svg)
    var simulation_child

    ////// NEW CODE FOR SHOWING TOOLTIP ON MOUSEOVER
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // d3.json("data_compact.json", function(error, json_graph) {
    //     if (error) throw error;
    //     graph_parent = json_graph
    update(svg, graph_parent, simulation_parent);     ////// NEW CODE
    // });


    // FUNCTION FOR SETTING THE SIZE OF COMPACT NODES
    function factor(x) {
        return Math.log2(x + 1) * 16
    }


    // FUNCTION FOR CALCULATING THE ARC REPRESENTING THE MISSING LINKS IN A COMPACT NODE
    function arc(r) {
        return d3.arc()
            .innerRadius(0)
            .outerRadius(function (d) {
                if (d.nodes) return factor(d.nodes) * 0.7
                if (d.size) return 0
            })
            .startAngle(0) //converting from degs to radians
            .endAngle(function (d) {
                if (d.missing_links) return -d.missing_links * pi * 2
                else return 0
            });
    }


    ////// NEW CODE - MOVED AROUND
    function update(svg_input, json_graph, rest_simulation) {
        // AT START, CLEAN THE ELEMENTS OF THE GRAPH, IF ANY
        svg_input.selectAll("g").remove();  ////// NEW CODE

        var link = null, node = null;
        var rect = svg_input.node().getBoundingClientRect();

        link = svg_input.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(json_graph.links)
            .enter().append("line")
            .on("click", function () {
                rejectLink()
            })
            .style("stroke-width", function (d) {
                return Math.sqrt(d.value) + 1;
            })
            .style("stroke", function (d) {
                if (d.strength < 1) return "red";
                else if (d.color) return d.color;
                else return "black";
            })
            .style("stroke-dasharray", function (d) {
                if (d.dash) return d.dash;
                else {
                    var space = String(20 * (1 - d.strenght));
                    return ("3," + space)
                }
            })
            //// NEW CODE TO DISPLAY THE STRENGTH OF A LINK
            .on('mouseover.tooltip', function (d) {
                tooltip.transition()
                    .duration(300)
                    .style("opacity", .8);
                tooltip.html("Strength: " + d.strength)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
            })
            .on("mouseout.tooltip", function () {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            });

        link.exit().remove();  ////// NEW CODE

        // ADD THE NODES TO THE GRAPH ACCORDING TO THE GIVEN GRAPH
        node = svg_input.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(json_graph.nodes)
            .enter().append("g")

        ////// NEW CODE - OUTER CIRCLE
        node.append("circle")
            .attr("r", function (d) {
                // IF IT IS A COMPACT PLOT AND IT IS NOT INVESTIGATED,
                // THEN RETURN RADIUS ZERO SINCE NO OUTER CIRCLE IS NEEDED
                if ((d.investigated) && (String(d.investigated) == 'false')) return 0
                // OTHERIWSE, IF IT IS A COMPACT PLOT AND IT IS INVESTIGATED,
                // THEN USERS THE FACTOR FUNCTION PLUS TO TWO
                if (d.nodes) return factor(d.nodes) + 2;
                // OTHERIWSE, IF IT IS NOT COMPACT PLOT AND IT IS INVESTIGATED (SIZE > 5)
                if (d.size > 5) return d.size * 1.2;
                return 0;
            })
            .attr("fill", "white")
            .style("stroke", function (d) {
                // IF THE NODE HAS BEEN SET AS SELECTED (IN DOUBLE CLICK)
                // SET THE STROKE TO RED, OTHERWISE, USE BLACK
                if ((selected_node) && (d === selected_node)) return "red"
                else if ((clicked_node) && (d === clicked_node)) return "red"
                return "black"
            })
            .style("stroke-width", 4)

        node.append("circle")
            .attr("r", function (d) {
                // IF IT IS A NODE IN A COMPACT PLOT, USE THE FACTOR FUNCTION TO DETERMINE THE SIZE
                if (d.nodes) return factor(d.nodes)
                // OTHERWISE USE THE SIZE THAT IS GIVEN
                if (d.size) return d.size;
                // OTHERWISE USE 5
                else return 5;
            })
            .attr("fill", function (d) {
                // IF THE NODE HAS BEEN SET AS SELECTED (IN DOUBLE CLICK)
                // SET IT TO RED, OTHERWISE, USE THE GROUP TO CHOOSE A COLOR
                if ((selected_node) && (d === selected_node)) return "red"; ////// NEW CODE
                else return color(d.group);
            })
            .on("dblclick", node_dblclick)
            // .on("contextmenu", node_mousedown)
            .style("stroke", function (d) {
                // ADD A WHITE STROKE FOR THE INNER CIRCLE OF NODES IN AN INVESTIGATED CLUSTER
                if ((d.investigated) && (String(d.investigated) == 'true')) return "white"
                // OTHERWISE, IF IT IS A COMPACT PLOT, MAKE IT BLACK
                else if (d.nodes) return "black"
                // OTHERWISE, IF IT IS NOT A COMPACT PLOT, THE NOES ORIGINALLY DID NOT HAVE THE PROPERTY 'INVESTIGATED'
                // THEN WE USE THE SIZE OF THE NODES, WHICH WOULD BE BIGGER THAN SIZE 5 (OF THE ASSOCIATED CLUSTER)
                // SO, ADD A WHITE STROKE FOR THE INNER CIRCLE OF NODES IN AN INVESTIGATED CLUSTER (SIZE > 5)
                else if (d.size > 5) return "white"
                // OTHERWISE, MAKE IT BLACK
                else return "black"
            })
            .style("stroke-width", 2)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // ADDING THE WHITE ARC INSIDE THE COMPACT NODE REPRESENTING THE MISSING LINKS
        node.append("path")
            .attr("d", arc(radius2))
            .attr("fill", "white");

        // TEXT DISPLAYING INSIDE THE COMPACT NODE THE NUMBER OF NODES WITHIN IT
        node.append("text")
            .text(function (d) {
                return d.id;
            })
            .attr('x', function (d) {
                if (d.nodes) return factor(d.nodes) * 0.9 + 8
                if (d.size) return (d.size * 0.9 + 8)
            })      ////// NEW CODE
            .attr('y', 3);

        // TEXT DISPLAYING INSIDE THE COMPACT NODE THE NUMBER OF NODES WITHIN IT
        // COMPACT NODE SIZE TEXT AND POSITION
        node.append("svg:text")
            .attr("dx", function (d) {
                if ((d.nodes) && (d.nodes > 2)) {
                    // return - 8
                    // var label = "N:" + d.node
                    // var radius = factor(d.nodes)
                    return -factor(d.nodes) / 3
                }
                // FOR SIZE < 2
                // PULLS BACK THE NODE INNER TEXT FROM GOING TO THE RIGHT
                else return -10
            })
            .attr('dy', 3)
            .text(function (d) {
                if (d.nodes) return "N:" + d.nodes
            })
            .style("font-weight", "bold");


        // TEXT DISPLAYING INSIDE THE NODE THE TOTAL OF LINKS
        // AND THE LINKS MISSING WITHIN A COMPACT NODE
        // COMPACT TOTAL LINK COUNT AND POSITION
        node.append("svg:text")
            .attr("dx", function (d) {
                if ((d.nodes) && (d.nodes > 2)) {
                    var label
                    var total = (d.nodes * (d.nodes - 1) / 2)
                    // var center = d3.select(this).attr("cx")
                    if (d.missing_links > 0)
                        label = "L:" + Math.round(total * (1 - d.missing_links)) + "/" + total
                    else label = "L:" + total
                    // return - (label.length/2) * 7
                    return -factor(d.nodes) / 3
                }
            })
            .attr('dy', 15)
            .text(function (d) {
                if ((d.nodes) && (d.nodes > 2)) {
                    var total = (d.nodes * (d.nodes - 1) / 2)
                    if (d.missing_links > 0)
                        return "L:" + Math.round(total * (1 - d.missing_links)) + "/" + total
                    else return "L:" + total
                }
            })

        // TEXT DISPLAYING THE STRENGTH OF COMPACT NODES BELLOW THE NODE
        node.append("svg:text")
            .attr("dx", -8)
            .attr('dy', function (d) {
                if (d.nodes) return factor(d.nodes) + 13
            })
            .text(function (d) {
                if ((d.strength) && ((d.nodes) && (d.nodes > 1)))
                    if (Number.parseFloat(String(d.strength)))
                        return "S:" + Math.round(d.strength * 1000) / 1000
                    else return "S:" + d.strength
            })
            .style("font-weight", "bold");

        // METADATA OF THE NODE TO BE DISPLAYED ON MOUSE OVER
        node.append("title")
            .text(function (d) {
                return d.id;
            });

        node.exit().remove(); ////// NEW CODE

        rest_simulation.nodes(json_graph.nodes).on("tick", ticked);
        rest_simulation.force("link").links(json_graph.links);

        function ticked() {
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node.attr("cx", function (d) {
                return d.x = Math.max(10, Math.min(rect.width - 200, d.x));
            })
                .attr("cy", function (d) {
                    return d.y = Math.max(10, Math.min(rect.height - 10, d.y));
                })
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
        }

    }

    // CHILD'S NON COMPACT PLOT
    function new_plot(child_graph) {
        graph_child = child_graph;
        clear(svg_child);

        popup.$on('shown', () => {
            simulation_child = simulator(svg_child);
            update(svg_child, child_graph, simulation_child);
        });

        popup.show();
    }

    // D3 GRAPH FORCE SIMULATOR
    function simulator(svg_input) {
        var rect = svg_input.node().getBoundingClientRect();

        var simulation_input = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                    return d.id;
                })
                    .distance(
                        function (d) {
                            if (d.dist_factor)
                                return factor(d.dist_factor[0]) + factor(d.dist_factor[1]) + d.distance * 0.8
                            else return d.distance;
                        })
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(rect.width / 2, rect.height / 2));

        return simulation_input
    }

    // ON MOUSE DOWN FUNCTION
    function node_dblclick(d) {
        //d.fixed = true;
        selected_node = d;
        if (d.child) {

            // for compact with child, expand
            //selected_node = d;
            update(svg, graph_parent, simulation_parent)
            new_plot(d.child)
        }
        else if (d.nodes) // for compact without child, just highlight
        {
            //selected_node = d;
            update(svg, graph_parent, simulation_parent)
        }

        else if (graph_child)
        // it is the child of compact
            update(svg_child, graph_child, simulation_child)

        else
        // not compact
            update(svg, graph_parent, simulation_parent)
    }

    function node_mousedown(d) {
        d3.event.preventDefault();
        clicked_node = d;
        //alert('Test')

        if (d.nodes)
        // it is the parent (compact)
            update(svg, graph_parent, simulation_parent)

        else if (graph_child)
        // it is the child of compact
            update(svg_child, graph_child, simulation_child)

        else
        // not compact
            update(svg, graph_parent, simulation_parent)
    }


    function dragstarted(d) {
        if (!d3.event.active)
            if (d.nodes) simulation_parent.alphaTarget(0.2).restart(graph_parent)
            else if (graph_child) simulation_child.alphaTarget(0.2).restart(graph_child)
            else simulation_parent.alphaTarget(0.2).restart(graph_parent)

        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active)
            if (d.nodes) simulation_parent.alphaTarget(0);
            else if (simulation_child) simulation_child.alphaTarget(0);

        // d.fx = null;
        // d.fy = null;
    }
}

export function clear(svg) {
    svg = (typeof svg === 'string') ? d3.select(svg) : svg;
    svg.selectAll("*").remove();
}