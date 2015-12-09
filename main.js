app = {
    extract_config:new Array(),
    out_config:new Array(),
    submit:function(){
        try {
            this.get_config();
            var deal = this.get_deal_data();
            var results = new Array();
            if(deal.length < 1){
                throw "待处理数据不能为空";
            }
            var no = 0;
            for(var i = 0;i<deal.length;i++){
                var r = this.deal(deal[i]);
                if(r !== false){
                    results[no] = r;
                    no++;
                }
            }

            //去重
            if($("#input_repeat").prop("checked")){
                results = this.unique(results);
            }
            results = results.join("\n");
            if($("#input_overlay").prop("checked") && $("#results_textarea").val() != ''){
                results = $("#results_textarea").val()+"\n"+results;
            }
            $("#results_textarea").val(results);
            this.total($("#results_textarea"));
            alert("处理完成");
        }
        catch (err){
            alert(err);
        }
    },
    deal:function(str){
        //抽取
        var oprion_extract = $("#oprion_extract").val();
        if(oprion_extract != "0" && this.extract_config.length > 0){
            var is_exterct = false;
            for(var i = 0;i<this.extract_config.length;i++){
                if(oprion_extract == "1"){
                    if(this.extract_config[i] == str){
                        is_exterct = true;
                        break;
                    }
                }
                else{
                    if(str.indexOf(this.extract_config[i]) != -1){
                        is_exterct = true;
                        break;
                    }
                }
            }
            if(is_exterct == false){
                return false;
            }
        }

        //排除
        var oprion_out = $("#oprion_out").val();
        if(oprion_out != "0" && this.out_config.length > 0){
            var is_out = false;
            for(var i = 0;i<this.out_config.length;i++){
                if(oprion_out == "1"){
                    if(this.out_config[i] == str){
                        is_out = true;
                        break;
                    }
                }
                else{
                    if(str.indexOf(this.out_config[i]) != -1){
                        is_out = true;
                        break;
                    }
                }
            }
            if(is_out == true){
                return false;
            }
        }

        return str;
    },
    get_deal_data:function(){
        var lists = $.trim($("#deal_textarea").val()).split("\n");
        var r = new Array();
        var no = 0;
        for(var i = 0; i < lists.length;i++){
            lists[i] = $.trim(lists[i]);
            if(lists[i]){
                r[no] = lists[i];
                no++;
            }
        }
        return r;
    },
    get_config:function(){
        this.extract_config = new Array();
        this.out_config = new Array();
        var extract_config = $.trim($("#extract_config").val()).split("\n");
        var no = 0;
        for(var i = 0; i < extract_config.length;i++){
            extract_config[i] = $.trim(extract_config[i]);
            if(extract_config[i]){
                this.extract_config[no] = extract_config[i]
                no++;
            }
        }
        this.extract_config = this.unique(this.extract_config);

        var out_config = $.trim($("#out_config").val()).split("\n");
        var no = 0;
        for(var i = 0; i < out_config.length;i++){
            out_config[i] = $.trim(out_config[i]);
            if(out_config[i]){
                this.out_config[no] = out_config[i]
                no++;
            }
        }
        this.out_config = this.unique(this.out_config);
    },
    unique:function(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    },
    clear:function(id){
        $("#"+id).val('');
    },
    export:function (){
        var dataString= $.trim($("#results_textarea").val());
        if(!dataString){
            alert("处理结果为空不能导出");
            return;
        }
        var csvContent = "data:text/csv;charset=utf-8,";
        var encodedUri = csvContent+encodeURI(dataString);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "word.csv");
        link.click();
    },
    total:function(ob){
        var text = $.trim(ob.val()).split("\n");
        console.log(text);
        ob.parents('.panel').find('.total').html("数量:"+text.length)
    }
}