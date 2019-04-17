var node_colours = ["BlueViolet", "IndianRed", "ForestGreen", "RoyalBlue", 
					"CadetBlue", "SaddleBrown", "DarkOrange", "DeepPink",
					"BurlyWood", "Chartreuse", "Crimson",  "DarkGoldenRod", 
					"DarkMagenta", "DimGray", "LawnGreen", "Lime", 
					"MediumSeaGreen", "Olive", "Peru", "Teal", "SeaGreen"];
var clust_rep_fill = "White";					
var link_stroke = "DarkGray";	
var link_stroke_sPath = "Black";	
		
function create_legend_panel(legend_panel, evt_name, json_url) {

	var legend_svg_graph_svg_w = 170;
	//var legend_svg_graph_svg_h = 1200;
		
	var legend_svg = legend_panel.append("svg").attr("width", legend_svg_graph_svg_w);								   	

	d3.json(json_url, function(error, json) {
		
			var clust_num = json.clust_num;
			var clusts = new Array();
			for (var i=0; i<clust_num; i++)
			{ 
				clusts[i] = i+1;
			}
			
			legend_svg.attr("height", json.clust_num * 100);

			var legend_icon_r = 15;
			var legend_icon_x = legend_icon_r + 2;
			var legend_icon_start_y = legend_icon_r + 2;
			var legend_icon_dist = 100;

			var legend_text_x = legend_icon_x + legend_icon_r + 5;	
	
			var legend_img_height = legend_icon_dist - legend_icon_r - 3;
			var legend_img_width = 640 / 480 * legend_img_height;
			var legend_ing_x = legend_text_x;

			// add legend icons
			var legend_icons = legend_svg.selectAll("circle")
						.data(clusts)
						.enter()
						.append("circle");

			legend_icons.attr("fill", function(d, i) { return node_colours[i]; })
				.attr("cx", legend_icon_x )
				.attr("cy", function(d, i) { return i * legend_icon_dist + legend_icon_start_y; } )
				.attr("r", legend_icon_r);
					
			// add legend text
			var legend_texts = legend_svg.selectAll("text")
						.data(clusts)
						.enter()
						.append("text")
						.text(function(d) {
							return "Rep of cluster " + d;
						})
						.attr("x", legend_text_x )
						.attr("y", function(d, i) { return i * legend_icon_dist + legend_icon_start_y; } )
						.attr("class", "legend_text");

			// add legend images
			var legend_imgs = legend_svg.selectAll("image")
					.data(clusts)
					.enter()
					.append("image")
					.attr("class", "legend_img")
					.attr("xlink:href", function(d) {return "imgs/evt_clust_rep/" + evt_name + "/clust_" + d + ".jpg";})
					.attr("x", legend_ing_x)
					.attr("y", function(d, i) {return  legend_icon_start_y + 2 + i * legend_icon_dist;})
					.attr("width", legend_img_width)
					.attr("height", legend_img_height);
		}
	)

}


function create_graph_panel(graph_panel, json_url) {
	var graph_svg_w = 900;
	//var graph_svg_h = 1200;

	var graph_svg = graph_panel.append("svg").attr("width", graph_svg_w);

	d3.json(json_url, function(error, json) {
	
		var graph_svg_h = json.clust_num * 100;
	
		var force = d3.layout.force()
		.gravity(.05)
		.distance(30)
		.charge(-8)
		.size([graph_svg_w, graph_svg_h]);
	
		graph_svg.attr("height", graph_svg_h);
	
		force
		.nodes(json.nodes)
		.links(json.links)
		.start();
	
		// add links between data samples
		var link = graph_svg.selectAll(".link")
			.data(json.links)
			.enter().append("line")
			.attr("stroke", function (d) { if (d.sPath == 1) {return link_stroke_sPath;} else { return link_stroke; } } )
			.attr("stroke-width", function (d) { if (d.sPath == 1) { return 4;} else {return Math.round(d.value/10)};} );
	
		// add nodes
		var node = graph_svg.selectAll("circle")
			.data(json.nodes)
			.enter().append("circle")
			.attr("r", function(d) { return d.belief * 7; })
			.attr("stroke", function(d) {return node_colours[d.clust-1];})
			.attr("stroke-width", 2)
			.attr("fill", function(d) { if (d.rep) {return clust_rep_fill;} else {return node_colours[d.clust-1];} } )
			.call(force.drag);
		

		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

			node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		});
	});	
}


function get_title_text(evt_name) {

	return "The data structure of " + evt_name + " event. Colour: cluster membership; Size: inference confidence; Edge: pairwise similarity. Hollow circles: cluster centre; Black lines: shortest paths"
}