$(function() {
    oStorage  = new editor.MyStorage();
    json_data  = oStorage.getItem("json_data");
    editor.update_data();
    
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
    /** TABS **/
    $(".menu li").click(editor.onClickTab);
    
    /** 
     *  DATA
     **/

    /** Load **/
    $("#menu_data li.item").click(editor.onClickData);
    $("#menu_charts li").click(editor.onClickChart);
    $(".container_pie .nav-tabs li").click(editor.onClickTabPie);
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
            $("#dataTitle").val(title);
            
            var length_column = data[0].length;
            for(var i=0;i<length_column;i++){
                var text = "column"+i;
                if((i+1) <= titles.length){
                    text = titles[i];
                }
                $(".table thead").append("<th><input type='text' value='" + text + "' placeHoldzer='column" + i + "'/></th>");
            }
            
            $.each(data, function(){
                var tr = $("<tr/>");
                $.each(this,function(){
                    td = $("<td/>").text(this);
                    tr.append(td);
                });
                $(".table tbody").append(tr);
            });
        }
    },
    
    computePieForm : function(){
        var $container = $(".container_pie");
        
    },

    onSaveData : function(event) {
        event.preventDefault();
        var titles = $(".new_data thead input").map( function(i,element) { return $(element).val() } );
        var record = {
            data : jQuery.parseJSON($("#dataTextarea").val()),
            title : $("#dataTitle").val(),
            titles : titles,
        }
        
        editor.save_data(record);
        
        window.location.reload();
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

    onClickTab : function(event) {
        var rel = $(this).attr("rel");
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active"); 
        $(".menu_content>.active").removeClass("active");
        $("#"+rel).addClass("active");
    },

    onClickTabPie : function(event) {
        var rel = $(this).attr("rel");
        console.log("zefzffz");
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active"); 
        $(".tab_containers>div").hide();;
        $("."+rel).show();
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
        $(Object.keys(json_data)).each(function() {
                $(".sources").append("<li class='item' rel='"+this+"'><a href='#'>"+this+"</a></li>");
        });
        $(".sources").append("<li class='item' rel='new'><a href='#'>New</a></li>");
    },
    
    save_data : function(record){
        var json_data = oStorage.getItem("json_data");
        if((typeof json_data === "undefined") || json_data==null) {
            json_data = {};
        }
        var json = {
            title : record.title,
            data : record.data,
            titles : record.titles,
        }
        json_data[record.title] = json;
        oStorage.setItem("json_data",json_data);
    },

    Pie : function(container, data, config) {

        var container = d3.select(container);
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
