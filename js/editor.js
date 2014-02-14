$(function() {
    oStorage  = new editor.MyStorage();
    json_data  = oStorage.getItem("json_data");
    editor.update_data();
    if(typeof json_data != "undefined" && json_data!=null){
        $(Object.keys(json_data)).each(function(){
            if($("#pieLabel option").length===0){
                var titles = json_data[this].titles;
                var option1 = $("<option/>").attr("value",titles[0]).text(titles[0]);
                var option2 = $("<option/>").attr("value",titles[1]).text(titles[1]);
                $("#pieLabel").append(option1);
                $("#pieNumber").append(option2);
            }
            var option = $("<option/>").attr("value",this).text(this);
            $("#pieSource").append(option);
        });
    }


    editor.Tab($(".tabs.menu"));
    editor.Tab($(".container_pie"));
    editor.Tab($(".new_data"),function(element){ if( $(element).attr("rel")==="new_data_json"){ $("#new_data input:radio:first").click() } });

    /** TABS **/
    //$(".menu li").click(editor.onClickTab);
    
    /** 
     *  DATA
     **/

    /** Load **/
    $("#menu_data li.item").click(editor.onClickData);
    $("#menu_charts li").click(editor.onClickChart);
    //$(".container_pie .nav-tabs li").click(editor.onClickTabPie);
    $("#pieSource").change(function(event){
        var source = $(this).val();
        $("#pieLabel option,#pieNumber option").remove();
        var titles = json_data[source].titles;
        $.each(titles,function(i,element){
            var option = $("<option/>").attr("value",i).text(this);
            $("#pieLabel,#pieNumber").append(option);
        });
        $("#pieLabel").val($("#pieLabel option:eq(0)").attr("value"));
        $("#pieNumber").val($("#pieNumber option:eq(1)").attr("value"));
    });

    $("#new_data input:radio").click(function(event) {
        $("#new_data .form-group").hide();
        $("#new_data .form-group." + $(this).val()).show();
    });

    $(".computeChart").click(function(event){
        event.preventDefault();
        var container = $(".preview_chart").get(0);
        var source = $("#pieSource").val();
        var data = json_data[source].data;
        var config = {};
        config.label = +$("#pieLabel").val();
        config.value = +$("#pieNumber").val();
        config.radius = $("#pieRadius").val();
        config.title = $("#pieTitle").val();
        config.out_radius = $("#pieOutRadius").val();
        editor.Pie(container,data,config);
    });
    /** Save **/
    $(".new_data button").click(editor.onSaveData);
});

var editor = {
 /**
     * CLASS MyStorage
     *
     **/

    Tab : function(target, additional){
        
        var object = $(target);
        var container =  $(".content", object);
        var header = $(".header", object);

        var onClickTab = function(event) {
            var rel = $(this).attr("rel");
            $(this).parent().find("li").removeClass("active");
            $(this).addClass("active"); 
            $(container).children().hide().find("li").removeClass('active');
            $("#"+rel).show();
            if(additional) {
                additional(this);
            }
        }

        $("li", header).click(onClickTab);
        $("li:first",header).click();

    },      

    computeTable : function(rel) {


        var getData = (function () {

          return function () {
            var page  = parseInt(window.location.hash.replace('#', ''), 10) || 1
              , limit = 30
              , row   = (page - 1) * limit
              , count = page * limit
              , part  = [];

            for(;row < count;row++) {
              if(row<data.length)
                part.push(data[row]);
            }

            return part;
          }
        })();

        $("#dataTextarea,#dataTitle").val("");
        $(".new_data table tbody tr,.new_data table th").remove();
        $('.dragdealer.vertical').hide(); //hides the vertical scroll bar
        if (rel!=="new") {
            var json_data = oStorage.getItem("json_data");
            var record = json_data[rel];
            
            var data = record.data;
            var titles = record.titles;
            var title = record.title;
            
            $("#dataTextarea").val(JSON.stringify(data, null, "\t"));
            
            var lines = data.map(function(element){ return element.join("\t"); })
            var text = lines.join("\n");
            $("#dataCopy").val(text); //.val().split("\n").map(function(d){ return d.split("\t") })
            
            $("#dataCsv").val("");
            $("#dataTitle").val(title);
            $("#new_data_table table").remove()
            var table = $('#new_data_table').data("handsontable");
            if(table)
                table.destroy();
            $('#new_data_table').handsontable({ 
                data : getData(),
                  rowHeaders: true,
                  colHeaders: true,
                  minRows: 0,
            })
            $("#new_data_table").append("<div>testesttestest</div>");
            //$('#new_data_table table').addClass('table');
        }
    },

    onSaveData : function(event) {
        event.preventDefault();
        var titles = $(".new_data thead input");
        if (titles.length>0)
            titles = titles.map( function(i,element) { return $(element).val() } );
        else
            titles = [];
        var container_class = $("#new_data input:radio:checked").val();
        var container = $("#new_data ." + container_class);

        var title = $("#dataTitle").val();
        var value = [];


        var record = {
            data : [],
            title : title,
            titles : titles,
        };

        if(container_class === "json") {
            try {
                value = jQuery.parseJSON(container.find("textarea").val());
            }
            catch(e){
                alert("error " + e);
                return false;
            }
        }
        else if(container_class === "csv") {
            var input = container.find("input:file");
            var file = input.get(0).files[0];
            var hasTitles = $("#isdataCopy").is(":checked");
            if (typeof file !== "undefined") {
                var reader = new FileReader();
                reader.onload = function(e) { 
                    var result = e.target.result;
                    var data = d3.csv.parseRows(result.replace(/\s*;/g, ","));
                    console.log(hasTitles);
                    console.log(data);
                    if (hasTitles === true) {
                        record.titles = data[0];
                        record.data = data.splice(1);
                    }
                    else {
                        record.data = data;
                    }
                    console.log(record);
                    editor.save_data(record);
                }; 
                reader.readAsText(file);
                return false;
            }
            else{
                alert("error");
                return false
            }
        }
        else{
            return false;
        }
        console.log(value);
        record.value = value;
        editor.save_data(record);
        //window.location.reload();
    },
    
    onClickData : function(event) {
        event.preventDefault();
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active"); 
        $(".main>div").hide();
        $(".new_data").show();
        var rel = $(this).attr("rel");
        
        editor.computeTable(rel);
    },

    onClickChart : function(event) {
        event.preventDefault();
        var rel = $(this).attr("rel");
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active"); 
        $(".main>div").hide();
        $("."+rel).show();
    },

    update_data : function () {
        var json_data  = oStorage.getItem("json_data");
        if((typeof json_data !== "undefined") && (json_data!=null)){
            $(Object.keys(json_data)).each(function() {
                    $(".sources").append("<li class='item' rel='"+this+"'><a href='#'>"+this+"</a><span class='glyphicon glyphicon-remove'></span></li>");
            });
        }
        $(".sources").append("<li class='item' rel='new'><a href='#'>New</a></li>");
    },
    
    save_data : function(record){
        var json_data = oStorage.getItem("json_data");
        if((typeof json_data === "undefined") || json_data==null) {
            json_data = {};
        }
        record.type = "array";
        if(record.data && !Array.isArray(record.data[0])){
            record.type = "dict";
        }
        var json = {
            title : record.title,
            data : record.data,
            titles : record.titles,
            type : record.type,
        }
        alert(JSON.stringify(json));
        json_data[record.title] = json;
        oStorage.setItem("json_data",json_data);
    },


    as_dict : function(record){
        
        var data = record.data;
        var result = [];
        var titles = record.titles;

        if(Array.isArray(data)){

            for (var i = 0; i < data.length; i++) {
                
                var item = data[i];
                var new_item = {};
                
                if(Array.isArray(item)){
                    
                    for (var i = 0; i < item.length; i++) {
                        var value = item[i];
                        var key = "column"+i;
                        if(titles.length>=(i+1)){
                            key = titles[i];
                        }
                        new_item[key] = value;
                    }
                    result.push(new_item)
                }
            }
        }
    },

    as_array : function(data){
        if(data.length>0){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
            }
        }
    },

    Pie : function(container, data, config) {

        var container = d3.select(container);
        container.selectAll("svg").remove();
        var titles =  Array.map(data,function(t){return t[config.label]})
        var radius = +config.radius, padding = 10;
        var color = d3.scale.ordinal()
                .range(["grey", "#3366CC", "#FF0000", "#FF9900","#109618", "#990099", "#0099C6", "#FFFF00",])
                .domain(titles);

        var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(+config.out_radius);

        var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d[+config.value]; });

        var svg = container.append("svg")
                                  .data([data])
                                  .attr("class", "pie")
                                  .attr("width", radius * 2.1)
                                  .attr("height", radius * 2.85)
                                .append("g")
                                  .attr("transform", "translate(" + (radius+4) + "," + (radius+4) + ")");

        var arcs = svg.selectAll(".arc")
                                    .data(pie)
                                    .enter()
                                  .append("path")
                                    .attr("class", "arc")
                                    .attr("d", arc)
                                    .style("fill", function(d) { return color(d.data[config.label])})
        svg.append("text")
                  .attr("dy", radius + 20)
                  .style("text-anchor", "middle")
                  .text(config.title);
    },

    
    MyStorage : function () {
        try{
            this.storage=window.localStorage;
            this.type="localStorage";
        }
        catch(err) {
            this.storage = {};
            this.type = "dict";
        }

        this.getItem = function(key){
            if (this.type === "localStorage"){
                var value = this.storage.getItem(key);
                return value && JSON.parse(value);
            }
            else {
                return this.storage[key];
            }
        };

        this.setItem = function(key,value) {
            if (this.type === "localStorage"){
                this.storage.setItem(key, JSON.stringify(value));
            }
            else {
                this.storage[key]=value;
            }
        };

        this.removeItem = function(key) {
            if (this.type === "localStorage") {
                this.storage.removeItem(key);
            }
        };
    }
};
