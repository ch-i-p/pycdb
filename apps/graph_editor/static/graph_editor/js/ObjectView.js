/** * Created by 1ka on 4/5/14. */ZOOMPYCDB.namespace("ZOOMPYCDB.ObjectView");ZOOMPYCDB.ObjectView = function(model,elements){    var temp_data = model.temp,        storage = model.storage,        panel = elements.panel,        img = elements.panel.find("#palette_info_img").first(),        img_url = elements.panel.find("#node_img_url").first(),        img_submit = elements.panel.find("#node_img_submit").first(),        attribures = panel.find("#obj_attrs").first(),        node_info = panel.find("#obj_node_info").first(),        rel_info = panel.find("#obj_rel_info").first(),        bg_info = panel.find('#obj_bg_info').first(),        group_info = panel.find("#obj_group_info").first(),        search = elements.search,        neighbors = panel.find("#search_neighbors").first(),        //sets search widget        setSearchWidget = function(data){            search.append(data);            $("#ui-id-1").on("click",function(){                var cid = $("#search_string_cid").val();                var id = $("#search_string_id").val();                $(document).trigger("object_found",[cid,id]);            });        },        //loads search widget        loadSearchWidget = function(){            $(document).trigger("set_loading_cursor");            $.ajax({                type: "GET",                url: ZOOMPYCDB.serveradr()+"graph_editor/getSearchWidget/",                error: function(xhr, ajaxOptions, thrownError) {                    $(document).trigger("unset_loading_cursor");                    $(document).trigger("error_message",thrownError);                },                success: function(data){                    $(document).trigger("unset_loading_cursor");                    setSearchWidget(data);                }            });        },        validateURL = function(textval) {            var urlregex = new RegExp( "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");            if(textval==="")                return true;            else                return urlregex.test(textval);        },        //cleans field        clean = function(){            node_info.addClass("hidden");            neighbors.addClass("hidden");            rel_info.addClass("hidden");            group_info.addClass("hidden");            bg_info.addClass("hidden");            img.addClass("hidden");            img_submit.addClass("hidden");            img_url.addClass("hidden");            attribures.children("div").remove();        },        //updates object information        setNodeInfo = function(){            var node = temp_data.getObject(),                config_data = storage.getConfigData();            clean();            node_info.removeClass("hidden");            neighbors.removeClass("hidden");            img.removeClass("hidden");            img_submit.removeClass("hidden");            img_url.removeClass("hidden");            $.each(node, function(key, value){                var $ctrl = node_info.find('input[name='+key+']');                if($ctrl[0]){                    switch($ctrl[0].type)                    {                        case "number":                        case "text":                        case "list":                            $ctrl.val(value);                            break;                        case "color":                            var color = value;                            if(color == "default"){                                $("input[name='color_default']").prop('checked',true);                                $("input[name='color']").attr("disabled",true);                                if(config_data)                                    color = $.grep(config_data.nodes, function(e){ return (e.id == node.cid); })[0].color;                            }                            else{                                $("input[name='color_default']").prop('checked',false);                                $("input[name='color']").attr("disabled",false);                            }                            $ctrl[0].value=color;                            break;                        case "checkbox":                            break;                    }                }                if(key==="image"){                    img.attr("src",value);                }            });        },        //updates relation information        setRelInfo = function(){            var object = temp_data.getObject();            clean();            rel_info.removeClass("hidden");        },        //updates background information        setBgInfo = function(){            var bg = temp_data.getObject();            clean();            bg_info.removeClass("hidden");            $.each(bg, function(key, value){                var $ctrl = bg_info.find('input[name='+key+']');                if($ctrl[0]){                    switch($ctrl[0].type)                    {                        case "number":                            $ctrl.val(value);                            break;                    }                }            });        },        setNgInfo = function(){        	var ng = temp_data.getObject(),                config_data = storage.getConfigData();;        	clean();        	group_info.removeClass("hidden");            img.removeClass("hidden");            img_submit.removeClass("hidden");            img_url.removeClass("hidden");            $.each(ng, function(key, value){                var $ctrl = group_info.find('input[name='+key+']');                if($ctrl[0]){                    switch($ctrl[0].type)                    {                        case "number":                        case "text":                        case "list":                            $ctrl.val(value);                            break;                        case "color":                            var color = value;                            if(color == "default"){                                $("input[name='color_default']").prop('checked',true);                                $("input[name='color']").attr("disabled",true);                                if(config_data && ng.cid)                                    color = $.grep(config_data.nodes, function(e){ return (e.id == ng.cid); })[0].color;                            }                            else{                                $("input[name='color_default']").prop('checked',false);                                $("input[name='color']").attr("disabled",false);                            }                            $ctrl[0].value=color;                            break;                        case "checkbox":                            break;                    }                }                if(key==="image"){                    img.attr("src",value);                }            });        },        setNodeAttributes = function(){            var dictobj,                dictattrs,                minussign,                attr_data = temp_data.getObjectAttr();            attribures.children().remove();            $.each(attr_data.fields,function(i,key){                var checked = attr_data.protos[key]? "checked":"";                switch(attr_data.types[i]){                    case "dict":                        dictobj = attr_data.vals[i];                        if(ZOOMPYCDB.view_editor){                        	dictattrs = $("<div><dt>"+key+":</dt><dd></dd></div>").appendTo(attribures).find("dd").first();	                        for(k in dictobj){					            $("<div class='dict_row'><input class='dict' type='text' value="+k+" readonly>:" +					                    "<input class='dict' type='text' value="+dictobj[k]+" readonly></div>")					                    .appendTo(dictattrs);	                        };                        }                        else{	                        dictattrs = $("<div><dt>"+key+":</dt><dd><input type='checkbox' name='"+key+"_default'"+checked+"></dd></div>").appendTo(attribures).find("dd").first();	                        for(k in dictobj){	                            minussign = $("<b class='dict'>-</b>").click(function(){					                    	removeDictField(this);					                   });					            $("<div class='dict_row'><input class='dict' type='text' value="+k+">:" +					                    "<input class='dict' type='text' value="+dictobj[k]+"></div>")					                    .append(minussign).appendTo(dictattrs);	                        };	                        $("<div class='dict_row'></div>").append("<b class='dict'>+</b>").click(function(){	                        	addNewDictField(this);	                        }).appendTo(dictattrs);                        }                        break;                    default:                    	if(ZOOMPYCDB.view_editor){	                        attribures.append(	                            $("<div><dt>"+key+":</dt><dd><input type='text' name='"+key+"' value='"+attr_data.vals[i]+"' readonly></dd></div>")	                        );                    	}                    	else{	                        attribures.append(	                            $("<div><dt>"+key+":</dt><dd><input type='checkbox' name='"+key+"_default'"+checked+"><input type='text' name='"+key+"' value="+attr_data.vals[i]+"></dd></div>")	                        );	                    }                        break;                }                if(!ZOOMPYCDB.view_edit){	                attribures.find("[type='checkbox']").on("click",function(){	                    if(checkDefaultPair(key,attribures))	                        setDefaultValue(key,attribures,attr_data.proto_vals[key]);	                });	                if(checkDefaultPair(key,attribures)){	                    setDefaultValue(key,attribures,attr_data.proto_vals[key]);	                }                }            });        },        setRelAttributes = function(){            var attr_data = temp_data.getObjectAttr();            attribures.children("div").remove();            $.each(attr_data.fields,                function(i,key){                	if(ZOOMPYCDB.view_editor){	                    attribures.append(	                        $("<div>"+key+": <input type='"+key+"' name='"+key+"' value="+attr_data.vals[i]+" readonly></div>")	                    );                	}else{	                    attribures.append(	                        $("<div>"+key+": <input type='"+key+"' name='"+key+"' value="+attr_data.vals[i]+"></div>")	                    );                    }                });        },        //checks if default checkbox checked        checkDefaultPair = function(pair,div){            var checkbox = div.find("input[name='"+pair+"_default']").first();            if(checkbox.is(":checked")){                checkbox.siblings("input").attr("disabled",true);                checkbox.siblings("div").children("input").attr("disabled",true);                checkbox.siblings("div").addClass("disabled").children("b").addClass("disabled");                return true;            }            else{                //div.find("input[name='"+pair+"']").first().attr("disabled",false);                checkbox.siblings("input").attr("disabled",false);                checkbox.siblings("div").children("input").attr("disabled",false);                checkbox.siblings("div").removeClass("disabled").children("b").removeClass("disabled");                return false;            }        },        //sets default value for pair        setDefaultValue = function(pairname,div,def_value){            var object,                config_data,                color;            if(pairname==="color"){                object = temp_data.getObject();                config_data = storage.getConfigData();                if((config_data)&&(object)){                    color = $.grep(config_data.nodes, function(e){ return (e.id == object.cid); })[0].color;                    div.find("input[name='color']")[0].value = color;                }            }            else{                div.find("input[name='"+pairname+"']").val(def_value);            }        },                addNewDictField = function(plussign){        	//ZOOMPYCDB.test = plussign;        	var minussign,row;        	if($(plussign).hasClass("disabled"))        		return;        	minussign = $("<b class='dict'>-</b>").click(function(){                    	removeDictField(this);                   });            row = $("<div class='dict_row'><input class='dict' type='text'/>:" +                    "<input class='dict' type='text'/></div>")                    .append(minussign);           $(plussign).before(row);        },        removeDictField = function(minsign){        	if($(minsign).hasClass("disabled"))        		return;        	$(minsign).parent().remove();        },        //get all information about node        getNodeInfo = function(){            var attr = {},            	checked,            	dictobj,            	dictattrs,            	ind,            	fields,            	a1,a2,                object = temp_data.getObject(),                attr_data = temp_data.getObjectAttr();            if(object){                //reads node info                if(!node_info.find("input[name='color_default']").first().is(":checked")){                    object.color=node_info.find("input[name='color']").first().val();                }                else{                    object.color = "default";                }                object.size=node_info.find("input[name='size']").first().val();                object.shape=node_info.find("input[name='shape']").first().val();                object.title=attribures.find("input[name='name']").first().val();                object.scale=node_info.find("input[name='scale']").first().val();                src = img.attr("src");                object.image = src? src : "";                                $.each(attr_data.fields,function(i,key){                checked = attribures.find("input[name='"+key+"_default']").first().is(":checked");                if(!checked){	                switch(attr_data.types[i]){	                    case "dict":	                    	dictobj = new Object();	                    	dictattrs = attribures.find("input[name='"+key+"_default']").first().siblings(':not(:last-child)');	                        for (ind=0; ind<dictattrs.length; ind++){	                        	fields = dictattrs[ind];	                        	a1 = $(fields).children("input").first().val();	                        	a2 = $(fields).children("input").last().val();	                        	dictobj[a1]=a2;	                        }	                        attr[key] = dictobj;	                        ZOOMPYCDB.test = dictobj;	                        break;	                    default:	                        attr[key] = attribures.find("input[name='"+key+"']").first().val();	                        break;	                	}	                }	                else{	                	attr[key] = "default";	                }                });                }                                                //reads node attributes                /*for(var i=0;i<attr_data.fields.length;i++){                    var key = attr_data.fields[i];                    if(attribures.find("input[name='"+key+"_default']").first().is(":checked")){                        attr[key] = "default";                    }                    else{                        attr[key] = attribures.find("input[name='"+key+"']").first().val();                    }                }*/            return {node:object,attr:attr};        },        //get all information about relation - attributes actually        getRelInfo = function(){            var rel = temp_data.getObject(),                obj_attr = temp_data.getObjectAttr();            for(var i=0;i<obj_attr.fields.length;i++){                rel[obj_attr.fields[i]] = attribures.find("input[name="+obj_attr.fields[i]+"]").val();            }            return rel;        },        //get all information about background - attributes actually        getBgInfo = function(){            var object = temp_data.getObject();            if(object){                //reads bg info                object.width=bg_info.find("input[name='width']").first().val();                object.height=bg_info.find("input[name='height']").first().val();                object.z=bg_info.find("input[name='z']").first().val();            }            return object;        };    loadSearchWidget();    node_info.find(".save_button").on("click",function(){        $(document).trigger("save_node_clicked");    });    node_info.find(".delete_button").on("click",function(){        $(document).trigger("delete_node_clicked");    });    rel_info.find(".save_button").on("click",function(){        $(document).trigger("save_rel_clicked");    });    rel_info.find(".delete_button").on("click",function(){        $(document).trigger("delete_rel_clicked");    });    bg_info.find(".save_button").on("click",function(){        $(document).trigger("save_bg_clicked");    });    bg_info.find(".delete_button").on("click",function(){        $(document).trigger("delete_bg_clicked");    });    group_info.find(".delete_button").on("click",function(){    	$(document).trigger("delete_ng_clicked");    });    node_info.find("[name='color_default']").first().on("click",function(){        if(checkDefaultPair("color",node_info))            setDefaultValue("color",node_info);    });    neighbors.find("button").first().on("click",function(){         $(document).trigger("find_neighbors",neighbors.find("input").first().val());    });    img_submit.on("click",function(){        var url = img_url.val();        if(validateURL(url))            img.attr("src",img_url.val());        else            $(document).trigger("error_message","URL не валиден.");    });    $(document).on("node_chosen",function(){        setNodeInfo();        setNodeAttributes();    });    $(document).on("rel_chosen",function(){        setRelInfo();        setRelAttributes();    });    $(document).on("bg_chosen",function(){        setBgInfo();    });    $(document).on("ng_chosen",function(){        setNgInfo();    });    $(document).on("clean_object_editor",function(){    	clean();    });    return{        getNodeInfo: getNodeInfo,        getRelInfo: getRelInfo,        clean: clean,        getBgInfo: getBgInfo    };};