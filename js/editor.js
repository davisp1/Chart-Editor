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
    editor.Tab($(".new_data"));

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
                additional();
            }
        }

        $("li", header).click(onClickTab);
        $("li:first",header).click();

    },      

    computeTable : function(rel) {
        $("#dataTextarea,#dataTitle").val("");
        $(".new_data table tbody tr,.new_data table th").remove();

        if (rel!=="new") {
            var json_data = oStorage.getItem("json_data");
            var record = json_data[rel];
            
            var data = record.data;
            var titles = record.titles;
            var title = record.title;
            
            $("#dataTextarea").val(JSON.stringify(data, null, "\t"));
            
            var lines = data.map(function(element){
                                return element.join("\t");
                            })
            var text = lines.join("\n");
            $("#dataCopy").val(text); //.val().split("\n").map(function(d){ return d.split("\t") })
            
            $("#dataCsv").val("");
            $("#dataTitle").val(title);
            
            var length_column = data[0].length;
            for(var i=0;i<length_column;i++){
                var text = "column"+i;
                if((i+1) <= titles.length){
                    text = titles[i];
                }
                $(".table thead").append("<th><input type='text' value='" + text + "' placeHoldzer='column" + i + "'/></th>");
            }
            
            var trs = [];
            $.each(data, function(){
                var tr = $("<tr/>");
                $.each(this,function(){
                    td = $("<td/>").text(this);
                    tr.append(td);
                });
                trs.push(tr);
            });
            $(".table tbody").append(trs);
        }
    },

    onSaveData : function(event) {
        event.preventDefault();
        var titles = $(".new_data thead input");
        if (titles.length>0)
            titles = titles.map( function(i,element) { return $(element).val() } );
        else
            titles = [];
        var data_container = $(".panel-collapse.in");
        var input = data_container.find("input");
        var textarea = data_container.find("textarea");
        var value = [];
        if(input.length>0){
            var file = input.get(0).files[0];
            console.log(file);
                if(typeof file != "undefined"){
                    var reader = new FileReader();
                    reader.onload = function(e) { 
                        var result = e.target.result;
                        value = d3.csv.parseRows(result.replace(/\s*;/g, ","));
                        var record = {
                            data : value,
                            title : $("#dataTitle").val(),
                            titles : titles,
                        }
                        editor.save_data(record);
                    }; 
                    reader.readAsText(file);
                    //
                    return false;
                }
                else{
                    alert("error");
                    return false
                }

        }
        else{
            if($("#dataTextarea").val()!=""){
                value = jQuery.parseJSON($("#dataTextarea").val());
            }
            else{
                alert("error t");
                return false;
            }
            console.log(value);
            var record = {
                data : value,
                title : $("#dataTitle").val(),
                titles : titles,
            }
            console.log(record);
            editor.save_data(record);
        }
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
                    $(".sources").append("<li class='item' rel='"+this+"'><a href='#'>"+this+"</a></li>");
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
