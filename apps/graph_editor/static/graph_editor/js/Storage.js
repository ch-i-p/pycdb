/** * Created by 1ka on 3/28/14. */ZOOMPYCDB.namespace("ZOOMPYCDB.Storage");ZOOMPYCDB.Storage = function(){    //we store information about graph and its configuration    var graph,        configdata,        view_id = document.URL.substring(document.URL.lastIndexOf('/') + 1),        //observer is an object that works as mailbox        observer = document,        //you can get copies of the data we keep        getGraph = function(scale){            var result;            ZOOMPYCDB.test = graph;            if(graph===undefined||configdata===undefined)                result = undefined;            else if(!scale)                result = jQuery.extend(true,{},graph);            else{                var index, class_scale, rels_to_del = [],                    rels = jQuery.extend(true,[],graph.rels),                    nodes = jQuery.extend(true,[],graph.nodes),                    bgs = jQuery.extend(true,[],graph.bgs);                bgs = bgs.filter(function(bg){                    if(bg.z!=undefined&&bg.z<scale)                        return true;                    else                        return false;                });                nodes = nodes.filter(function(d){                    class_scale = configdata.nodes.filter(function(cd){return cd.id == d.cid;})[0].scale;                    if(d.scale!=0&&d.scale<scale||(d.scale==0&&class_scale<scale))                        return true;                    else{                        rels.forEach(function(r){                            if(((r.source[0]===d.cid)&&(r.source[1]=== d.id))||((r.target[0]=== d.cid)&&(r.target[1]===d.id))){                                index = rels_to_del.indexOf(r);                                if(index==-1) rels_to_del.push(r);                            }                        });                        return false;                    }                });                rels_to_del.forEach(function(r){                    index = rels.indexOf(r);                    rels.splice(index,1);                });                result = {nodes:nodes,rels:rels,bgs:bgs};            }            return result;        },        getConfigData = function(){            var result = (configdata===undefined)? undefined: jQuery.extend(true,{},configdata);            return result;        },        getNode = function(selector){            var result = jQuery.extend(true,{},$.grep(graph.nodes, function(node){return selector(node);})[0]);            return result;        },        changeNode = function(node){            var n = graph.nodes.filter(function(d){return ((d.cid === node.cid)&&(d.id===node.id));})[0];            for (var attr in node) {                if (node.hasOwnProperty(attr)) n[attr] = node[attr];            }            $(observer).trigger("graph_changed");        },        changeBg = function(background){            var bg = graph.bgs.filter(function(d){return (d.id===background.id);})[0];            for (var attr in background) {                if (background.hasOwnProperty(attr)) bg[attr] = background[attr];            }            $(observer).trigger("graph_changed");        },        changeNodeCoord = function(node){            var n = graph.nodes.filter(function(d){return ((d.cid === node.cid)&&(d.id===node.id));})[0];            n.x = node.x;            n.y = node.y;            $(observer).trigger("graph_changed");        },        changeBgCoord = function(background){            var bg = graph.bgs.filter(function(d){return d.id===background.id;})[0];            bg.x = background.x;            bg.y = background.y;            $(observer).trigger("graph_changed");        },        //ajax loading functions        //loads data about graph        loadGraphData = function(cids){            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                data: {cids: JSON.stringify(cids),view_id:view_id },                url: ZOOMPYCDB.serveradr()+"graph_editor/getGraphData",                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    graph = data;                    checkMultipleRels();                    $(document).trigger("unset_loading_cursor");                    $(observer).trigger("graph_changed");                }            });        },         //loads configuration data        loadConfigurationData = function(){            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/configData",                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    configdata = data;                    $(document).trigger("unset_loading_cursor");                    $(observer).trigger("config_changed");                }            });        },        //saves graph coordinates        saveGraphCoord = function(){            ajaxSaveCoord(graph.nodes);        },        //saves one node coordinates        saveNodeCoord = function(node){            var nodes = graph.nodes.filter(function(d){return ((d.cid === node.cid)&&(d.id===node.id));});            ajaxSaveCoord(nodes);        },        //saves selection coordinates        saveSelectionCoord = function(){            var nodes = graph.nodes.filter(function(d){return d.inselection;});            ajaxSaveCoord(nodes);        },        //sends ajax request to save coordinates        ajaxSaveCoord = function(nodes){            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/saveGraph/",                data: {nodes: JSON.stringify(nodes), view_id:view_id },                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("error_message",thrownError);                },                success: function(data){                }            });        },        //saves node changes        saveNode = function(node){            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/saveNode/",                data: {node: JSON.stringify(node.node),attrs: JSON.stringify(node.attr),view_id:view_id },                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    $(document).trigger("unset_loading_cursor");                    if(data!="success"){                        $(document).trigger("error_message",data);                    }                    else{                        changeNode(node.node);                    }                }            });        },        saveBackground = function(bg){            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/saveBg/",                data: {bg: JSON.stringify(bg),view_id:view_id  },                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    $(document).trigger("unset_loading_cursor");                    if(data!="success"){                        $(document).trigger("error_message",data);                    }                    else{                        changeBg(bg);                    }                }            });        },        saveRel = function(rel){            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/saveRelation/",                data: {rel: JSON.stringify(rel) },                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                $(document).trigger("unset_loading_cursor");                if(data!="success")                    $(document).trigger("error_message",data);                }            });        },        //zooms to a node        zoomToNode = function(node){            $(observer).trigger("zoomed",[node.x,node.y,node.size*5]);        },        //adding methods        //adds node on graph        addNode = function(cid,coords){            var new_node = new Object();            new_node.cid = cid;            new_node.x = coords.x;            new_node.y = coords.y;            new_node.color = "default";            new_node.description = "";            new_node.selected = 0;            new_node.shape = "default";            new_node.size = 10;            new_node.title = "";            new_node.image = "";            new_node.scale = 0;            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/addInstance/",                data: {node: JSON.stringify(new_node)},                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    new_node.id = parseInt(data);                    graph.nodes.push(new_node);                    $(document).trigger("unset_loading_cursor");                    $(observer).trigger("graph_changed");                }            });        },        //adds relation on graph        addRelation = function(rid,source,target){            var new_rel = new Object();            new_rel.cid = rid;            new_rel.source = [source.cid,source.id];            new_rel.target = [target.cid,target.id];            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/addRelation/",                data: {rel: JSON.stringify(new_rel)},                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    new_rel.id = data;                    graph.rels.push(new_rel);                    checkMultipleRels(new_rel);                    $(document).trigger("unset_loading_cursor");                    $(observer).trigger("graph_changed");                }            });        },        addBackground = function(url,scale,coords){            var new_bg = new Object();            new_bg.image = url;            new_bg.x = coords.x;            new_bg.y = coords.y;            new_bg.width = 50;            new_bg.height = 50;            new_bg.z = scale;            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/addBackground/",                data: {bg: JSON.stringify(new_bg),view_id:view_id},                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    new_bg.id = data;                    graph.bgs.push(new_bg);                    $(document).trigger("unset_loading_cursor");                    $(observer).trigger("graph_changed");                }            });        },        //remove methods        //removes node from the graph        deleteNode = function(object){            var cid = object.cid,                id = object.id,                index,                relations_to_del = [];            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/deleteNode/"+cid+"/"+id,                data: {view_id: view_id},                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    if(data==="success"){                        index = graph.nodes.indexOf($.grep(graph.nodes, function(e){ return (e.id === id && e.cid===cid); })[0]);                        graph.nodes.splice(index,1);                        graph.rels.forEach(function(rel){                            if((rel.source[0]===cid&&rel.source[1]===id)||(rel.target[0]===cid&&rel.target[1]===id)){                                relations_to_del.push(rel);                            }                        });                        for(var i=0;i<relations_to_del.length;i++){                            index = graph.rels.indexOf(relations_to_del[i]);                            graph.rels.splice(index,1);                        }                        $(document).trigger("graph_changed");                    }                    else                        $(document).trigger("error_message",data);                    $(document).trigger("unset_loading_cursor");                }            });        },        //removes relation form the graph        deleteRelation = function(relation){            var cid = relation.cid,                id = relation.id,                index = graph.rels.indexOf($.grep(graph.rels, function(e){ return (e.id == id && e.cid==cid); })[0]);            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/deleteRelation/"+cid+"/"+id,                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    $(document).trigger("unset_loading_cursor");                    if(data=="success"){                        graph.rels.splice(index,1);                        checkMultipleRels(relation);                        $(observer).trigger("graph_changed");                    }                    else                        $(document).trigger("error_message",data);                }            });        },        //removes background from the graph        deleteBg = function(object){            var id = object.id,                index;            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/deleteBg/"+id,                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    if(data==="success"){                        index = graph.bgs.indexOf($.grep(graph.bgs, function(e){ return e.id === id; })[0]);                        graph.bgs.splice(index,1);                        $(document).trigger("graph_changed");                    }                    else                        $(document).trigger("error_message",data);                    $(document).trigger("unset_loading_cursor");                }            });        },        //highlighting        //highlights graph's fragment matching with selector        highlight = function(selector){            if(graph==undefined||graph.nodes==undefined||graph.rels==undefined)                return;            graph.nodes.forEach(function(d){                if(selector(d)===true)                    d.selected = 1;                else                    d.selected = 2;            });            graph.rels.forEach(function(d){                d.selected = 2;            });            $(observer).trigger("graph_changed");        },        //removes highlight mask from selected objects        unhighlight = function(){            if(graph==undefined||graph.nodes==undefined||graph.rels==undefined)                return;            graph.nodes.forEach(function(d){                d.chosen = false;                d.selected = 0;            });            graph.bgs.forEach(function(d){                d.chosen = false;            });            graph.rels.forEach(function(d){                d.selected = 0;            });            $(observer).trigger("graph_changed",getGraph());        },        //highlight possible sources of relation        highlightRelSources = function(rel){            var cids = [];            rel.allowed_relations.forEach(function(r){                var cid = r.from.cid;                if(cids.indexOf(cid)==-1){                    cids.push(cid);                }            });            highlight(function(node){return (cids.indexOf(node.cid)!=-1);});        },        //highlight possible sources of relation        highlightRelTargets = function(rel,source){            var cids = [],                source_cid = source.cid;            rel.allowed_relations.forEach(function(r){                var cid = r.to.cid;                if((cids.indexOf(cid)==-1)&&(r.from.cid==source_cid)){                    cids.push(cid);                }            });            highlight(function(node){                //node can't be it's own prototype                if((cids.indexOf(node.cid)!=-1)||((rel.id===10001)&&                    (node.id===source.id)&&(node.cid===source_cid))){                    return true;                }                else{                    return false;                }            });        },        //zooms to highlighted area        zoomToHighlighted = function(){            var maxX = undefined,                maxY = undefined,                minX = undefined,                minY = undefined,                size,                sx,                sy,                area;            graph.nodes.forEach(function(node){                if(node.selected===1){                    size = node.size/2;                    if(minX===undefined){                        minX = node.x - size;                        maxX = node.x + size;                        minY = node.y - size;                        maxY = node.y + size;                    }                    else{                        minX = (minX<=(node.x-size))? minX: (node.x-size);                        maxX = (maxX>=(node.x+size))? maxX: (node.x+size);                        minY = (minY<=(node.y-size))? minY: (node.y-size);                        maxY = (maxY>=(node.y+size))? maxY: (node.y+size);                    }                }            });            if(minX===undefined)                return;            sy = (maxY-minY)/ 2;            sx = (maxX-minX)/ 2;            area = (sx>=sy)?(sx+1):(sy+1);            area *= 1.2;            sx += minX;            sy += minY;            $(observer).trigger("zoomed",[sx,sy,area]);        },        //recursive, highlights all neighbors        //cur_depth = current depth of recursion        highlightAllNeighbors = function(cid,id,depth,cur_depth){            var node = $.grep(graph.nodes, function(e){ return (e.id == id && e.cid==cid); })[0];            node.selected = 1;            if(cur_depth==depth) return;            graph.rels.forEach(function(d){                if (d.source[0]==cid&& d.source[1]==id){                    d.selected=1;                    highlightAllNeighbors(d.target[0], d.target[1],depth,cur_depth+1);                }                else if(d.target[0]==cid&& d.target[1]==id){                    d.selected = 1;                    highlightAllNeighbors(d.source[0], d.source[1],depth,cur_depth+1);                }            });        },        //finds all neighbors        findAllNeighbors = function(cid,id,number){            highlightAllNeighbors(cid,id,number,0);            graph.nodes.forEach(function(d){                if(d.selected != 1) d.selected = 2;            });            graph.rels.forEach(function(d){                if(d.selected != 1) d.selected = 2;            });            $(observer).trigger("graph_changed");            zoomToHighlighted();        },        //checks if there are multiple rels between two nodes and sets number for every        checkMultipleRels = function(relation){            var neighbor_rels,i;            if(relation){                var rel = relation;                neighbor_rels = graph.rels.filter(function(d){                    return ((d.source[0]==rel.source[0])&&(d.source[1]==rel.source[1])&&                        (d.target[0]==rel.target[0])&&(d.target[1]==rel.target[1]));}                );                for(i=0;i<neighbor_rels.length;i++){                    neighbor_rels[i].neighbor_number = i;                }            }            else{                graph.rels.forEach(function(rel){                    neighbor_rels = graph.rels.filter(function(d){                    return ((d.source[0]==rel.source[0])&&(d.source[1]==rel.source[1])&&                        (d.target[0]==rel.target[0])&&(d.target[1]==rel.target[1]));}                    );                    for(i=0;i<neighbor_rels.length;i++){                        neighbor_rels[i].neighbor_number = i;                    }                });            }        },        //work with selection        //examines all nodes on being in rectangle area        closeSelection = function(rect,scale){            var halfsize, class_scale;                graph.nodes.forEach(function(node){                halfsize = node.size/2;                class_scale = configdata.nodes.filter(function(cd){return cd.id == node.cid;})[0].scale;                if(                    (node.selected!=2)&&((node.scale!=0&&node.scale<scale)||(node.scale==0&&class_scale<scale))&&                    (node.x-halfsize>=rect.x) && (node.x+halfsize<=rect.x+rect.width) &&                    (node.y-halfsize>=rect.y) && (node.y+halfsize<rect.y+rect.height)                ) {                    node.inselection = true;                }else{                    node.inselection = false;                }            });            $(document).trigger("graph_changed");        },        //moves all nodes in selection        moveSelection = function(shift){            graph.nodes.forEach(function(node){                if(node.inselection){                    node.x+=shift.x;                    node.y+=shift.y;                }            });            $(observer).trigger("graph_changed");        },        //removes all objects from selection        cleanSelection = function(){            graph.nodes.forEach(function(node){                node.inselection = false;            });        },                /*getNodesGroup = function(rect,scale){        	var class_scale,        		frag = [];        	if(rect.width!=0&&rect.height!=0){        		frag = getSelectedFragment(rect);        	}        	else{	        	graph.nodes.forEach(function(node){	                class_scale = configdata.nodes.filter(function(cd){return cd.id == node.cid;})[0].scale;	        		if ((node.selected!=2)&&((node.scale!=0&&node.scale<scale)||(node.scale==0&&class_scale<scale)))		        		frag.push(node);	        	});	        }	        return frag;        },*/                selectFragment = function(fragment){            graph.nodes.forEach(function(node){        		node.inselection = false;        	});        	graph.nodes.forEach(function(n){        		fragment.nodes.forEach(function(node){            		if ((n.id == node.id) && (n.cid == node.cid))            				n.inselection = true;            		});        	});        },        //pasting        //returns nodes from rectangle selection        getSelectedFragment = function(rect){            //We want to save rectangle of selection too to paste it at future            var selection = {nodes: [],rels:[],rect:rect};            //closeSelection(rect,Infinity);            graph.nodes.forEach(function(node){                if(node.inselection){                    selection.nodes.push(jQuery.extend(true, {}, node));                }            });            graph.rels.forEach(function(edge){                var isSourceInlist = false,                    isTargetInlist = false;                graph.nodes.forEach(function(node){                    if(node.inselection){                        if((node.cid==edge.source[0] && node.id==edge.source[1]))                        {                            isSourceInlist = true;                        }                        if((node.cid==edge.target[0] && node.id==edge.target[1]))                        {                            isTargetInlist = true;                        }                    }                });                if(isSourceInlist&&isTargetInlist)                    selection.rels.push(jQuery.extend(true, {}, edge));            });            selection.nodes.forEach(function(node){node.chosen = false;});            return selection;        },        //deletes all nodes and relations in rectangle selection        removeSelectedFragment = function(){            graph.nodes.forEach(function(node)            {                if(node.inselection)                {                    deleteNode(node);                }            });        },        //pastes fragment on graph        pasteFragment = function(fragment){            if(fragment.nodes.length==0)                return;            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/addFragment/",                data: {fragment: JSON.stringify(fragment), view_id: view_id},                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("error_message", thrownError);                    $(document).trigger("unset_loading_cursor");                },                success: function(data){                	//loadGraphData();                    data.nodes.forEach(function(node){                    	node.inselection = true;                        graph.nodes.push(node);                    });                    data.rels.forEach(function(rel){                        graph.rels.push(rel);                    });                    $(document).trigger("unset_loading_cursor");                    //$(document).trigger("check_selectoin");                    $(observer).trigger("graph_changed");                }            });        };    //initiation: loading data    loadConfigurationData();    loadGraphData();    //public methods    return{        getGraph: getGraph,        getConfigData: getConfigData,        getNode: getNode,        changeNode: changeNode,        changeBg: changeBg,        changeNodeCoord: changeNodeCoord,        changeBgCoord: changeBgCoord,        saveNodeCoord: saveNodeCoord,        saveSelectionCoord: saveSelectionCoord,        saveNode: saveNode,        saveBackground: saveBackground,        saveRel: saveRel,        addNode: addNode,        addRelation: addRelation,        addBackground: addBackground,        deleteNode: deleteNode,        deleteRelation: deleteRelation,        deleteBg: deleteBg,        highlight: highlight,        selectFragment: selectFragment,        unhighlight: unhighlight,        highlightRelSources: highlightRelSources,        highlightRelTargets: highlightRelTargets,        findAllNeighbors: findAllNeighbors,        closeSelection: closeSelection,        moveSelection: moveSelection,        cleanSelection: cleanSelection,        getSelectedFragment: getSelectedFragment,        removeSelectedFragment: removeSelectedFragment,        pasteFragment: pasteFragment,        zoomToNode: zoomToNode    };};