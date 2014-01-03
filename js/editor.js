$(function() {
    oStorage  = new editor.MyStorage();
    editor.update_data();

    /** TABS **/
    $(".menu li").click(editor.onClickTab);
    
    /** 
     *  DATA
     **/

    /** Load **/
    $("#menu_data li.item").click(editor.onClickData);
    
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

    onSaveData : function(event) {
        event.preventDefault();
        var record = {
            data : jQuery.parseJSON($("#dataTextarea").val()),
            title : $("#dataTitle").val(),
            titles : [],
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
    
    update_data : function () {
        var json_data  = oStorage.getItem("json_data");
        $(Object.keys(json_data)).each(function() {
                $(".sources").append("<li class='item' rel='"+this+"'><a href='#'>"+this+"</a></li>");
        });
        $(".sources").append("<li class='item' rel='new'><a href='#'>new</a></li>");
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
