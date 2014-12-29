/** * Created by 1ka on 4/5/14. */ZOOMPYCDB.namespace("ZOOMPYCDB.ScemeView");ZOOMPYCDB.ScemeView = function(model,elements,vieweditor){    var model = model,        canvas = elements.canvas,        //svg array for nodes        nodes_svg = elements.nodes,        vieweditor = vieweditor,        //refreshes canvas        refresh = function(){            var config_data = model.getConfigData(),                nodes = config_data.nodes,                rels = config_data.rels;            if(canvas===undefined)                return;            canvas.append("defs")                .append("symbol")                .attr("id","square")                .attr("viewbox","0 0 20 20")                .attr("width",20)                .attr("height",20)                .attr("preserveAspectRatio","xMidYMid slice")                .append("rect")                .attr("x",0)                .attr("y",0)                .attr("width",20)                .attr("height",20);            canvas                .append("symbol")                .attr("id","circle")                .attr("viewbox","0 0 20 20")                .attr("width",20)                .attr("height",20)                .attr("x",0)                .attr("y",0)                .append("circle")                .attr("cx",10)                .attr("cy",10)                .attr("r",10);            canvas.append("defs")                .append("symbol")                .attr("id","triangle")                .attr("viewbox","-10 -10 20 20")                .attr("width",20)                .attr("height",20)                .attr("preserveAspectRatio","xMidYMid slice")                .append("polygon")                .attr("points","10,0 20,20 0,20");            var node = nodes_svg.selectAll("svg").data(nodes).enter()                .append("svg")                .attr("class","draggable")                .attr("width",function(d){                    return d.size;                })                .attr("height",function(d){                    return d.size;                })                .style("position","absolute")                .style("left",function(d){                    return d.x- d.size/2+2;                })                .style("top",function(d){                    return d.y- d.size/2;                })                .on("mousedown",function(d){                    $(document).trigger("cid_chosen", d.id);                });            node.append("path")                .attr("transform", function(d) { return "translate(" + d.size/2 + "," + d.size/2 + ")"; })                .attr("d", d3.svg.symbol()                .size(function(d) { return d.size* d.size; })                .type(function(d) {                    if(d.image)                        return "square";                    else                        return d.shape;                }))                .attr("fill",function(d){                    if(d.image)                        return "white";                    else                        return d.color;                });            node.append("image")                .attr("xlink:href",function(d){                    return d.image;                })                .attr("width",function(d) { return d.size;})                .attr("height",function(d) { return d.size;});            canvas.selectAll("text")               .data(nodes)               .enter()               .append("text")               .text(function(d) {                    return d.title;               })               .attr("x", function(d) {                    return d.x;               })               .attr("y", function(d) {                    return d.y- d.size*2/3;               })               .attr("font-family", "sans-serif")               .attr("font-size", "13px")                .attr("fill", "black")                .attr("text-anchor","middle");            canvas.append("g").selectAll("text")               .data(rels)                .enter()               .append("text")               .text(function(d) {                    return d.title;               })               .attr("x", function(d) {                    return d.x-30;               })               .attr("y", function(d) {                    return d.y-2;               })               .attr("font-family", "sans-serif")               .attr("font-size", "10px")               .attr("fill", "black");            canvas.append("defs")                .append("marker")                .attr("id", "endmarker")                .attr("viewBox", "0 -5 10 10")                .attr("refX", 0)                .attr("refY", -0)                .attr("markerWidth", 6)                .attr("markerHeight", 6)                .attr("orient", "auto")                .append("path")                .attr("d", "M0,-5L10,0L0,5");            canvas.append("g")                .selectAll("rect")                .data(rels)                .enter()                .append("rect")                .attr("width",40)                .attr("height",15)                .attr("x",function(d){return d.x-37;})                .attr("y",function(d){return d.y-7;})                .attr("style","opacity:0.05")                .on("click",function(d){                    $(document).trigger("rid_chosen", d);                });            var polylines = canvas.selectAll("polyline");            polylines.data(rels)                .enter()                .append("polyline")                .attr("points",function(d){                    return d.x+","+ d.y+" "+(d.x-30)+","+d.y;                })                .attr("style",function(d){                    return "stroke:"+ d.color+";stroke-width:"+ 1;                })                .attr("class", function(d) { return d.shape; })                .attr("marker-end", function(d) { return "url(#endmarker)"; })                .on("click",function(d){                    $(document).trigger("rid_chosen", d);                });            //на время так            var links = [];            for(var i=0; i<rels.length;i++)            {                var rel = rels[i];                for(var j=0; j<rel.allowed_relations.length;j++)                {                    var all_rel = rel.allowed_relations[j];                    var source = $.grep(nodes, function(e){ return (e.id == all_rel.from.cid);})[0];                    var target = $.grep(nodes, function(e){ return (e.id == all_rel.to.cid);})[0];                    var height = 0;                    links.forEach(function(link)                    {                        if((link.source.id==source.id) && (link.target.id == target.id)) height+=1;                    });                    links.push(                    {                        "source": source,                        "target": target,                        "style": "stroke:"+ rel.color+";fill:none;stroke-width:"+ 1,                        "shape": rel.shape,                        "height": height                    });                }            }            var path = canvas.append("svg:g").selectAll("path")                .data(links)                .enter().append("svg:path")                .attr("class", function(d) { return d.shape; })                .attr("marker-end", function() { return "url(#endmarker)"; })                .attr("style",function(d){ return d.style; })                .attr("d",function(d){                    var x1 = d.source.x,                        y1 = d.source.y,                        x2 = d.target.x,                        y2 = d.target.y,                        dx = x2 - x1,                        dy = y2 - y1,                        dr = Math.sqrt(dx * dx + dy * dy),                        normX = dx / dr,                        normY = dy / dr,                        targetPadding = parseFloat(d.target.size/2,10) + 5,                        x2 = x2 - (targetPadding * normX),                        y2 = y2 - (targetPadding * normY),                        drx = dr,                        dry = dr,                        xRotation = 0, // degrees                        largeArc = 0, // 1 or 0                        sweep = 1; // 1 or 0                        if(d.height!=undefined)                            drx = drx * d.height;                            dry = drx;                        if ( d.source.id==d.target.id ) {                            xRotation = 0;                            largeArc = 1;                            drx = d.target.size*2/3;                            dry = d.target.size/3;                            x2 = d.target.x - d.target.size/2-2;                            y2 = d.target.y + d.target.size/2;                            x1 = d.source.x + d.target.size/2;                            y1 = d.source.y + d.target.size/2;                            if(d.height!=undefined){                                dry = dry + d.height*4;                            }                      }                    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;                });                			if(!ZOOMPYCDB.view_editor){	            $(nodes_svg[0]).children("svg").draggable({	                revert: true,	                revertDuration: 0,	                stop: function(e){	                    $(document).trigger("add_node");	                }	            });	       }        };    $(document).on("config_changed",function(){        refresh();    });    return {        refresh: refresh    };};