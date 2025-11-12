class query_work
{
    static set_url_params_with_url_encode(url,controller,data,options)
    {
        //注意要把params整体作为唯一的参数传进去，要先Json_encode，然后是url_encode
        let url_with_params=url+"?params="+encodeURIComponent(JSON.stringify(data))+"&controller="+controller+"&options="+encodeURIComponent(JSON.stringify(options));
        return url_with_params;
    }
    static query(controller,data,fun)
    {
        let path="/main/controller/accept_query.php";

        let url_test=path;
        if(query_work.preset_domain==null)
        {
            query_work.preset_domain="";
        }

        if(query_work.preset_domain!=null)
        {
            // "http://192.168.101.24:8087"
            url_test=query_work.preset_domain+path;
        }

        let options={
            lang:TransInner.lang
        };
        let url_with_params= query_work.set_url_params_with_url_encode(url_test,controller,data,options);
        console.log(url_with_params,"url_with_params_debug");

        if(query_work.preset_domain!=null)
        {
            path=query_work.preset_domain+path;
        }
        $.post(path,{
            "controller":controller,
            "params":data,
            "options":options
        },function(data_string){
            console.log(data_string,"data_string123123");
            let data=JSON.parse(data_string);
            //返回的数据
            console.log(data);
            if(fun)
            {
                fun(data);
            }
        });
        return null;
    }
}