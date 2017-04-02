/**
 * Created by Ranshaw on 2017/3/8.
 * 直接配置域名，运行即可
 * 下载过程中，有时候会报错，正在解决中，
 */

let iconv = require('iconv-lite'),
    cheerio = require('cheerio'),
    host = 'http://jng.168aiman.com/service.html',
    http = host.substring(0,host.indexOf(':')) === 'http'? require('http') : require('https'),
    request = require('request'),
    dir  = './images/',
    fs   = require('fs');


let getImgs = {
    addrList: [],
    domain:'http://resource.jianuoge.cn',
    init() {
        /*
        * js动态加载的图片抓取不到
        * */
        this.mkdir("images");
        this.getSrc();/*获取img标签里的图片*/
        this.getBgSrc();/*获取css里面的图片*/
    },
    mkdir:function(dirname){

        fs.mkdir(dirname,function(err){
            if(err){
                console.log("创建文件夹失败")
            }
        })

    },
    getSrc(){
        let me = this;
        http.get(host,function(res,req){

             res.on('data',function(data){
                let $   =  cheerio.load(data);

                let srcList =   Array.from( $('img'),x => {

                    if(x != '' && typeof x.attribs.src != 'undefined'){
                        
                        return  x.attribs.src.indexOf('http') > -1 ?  x. attribs.src : host +  x. attribs.src;
                    }
                });

                if(srcList.length>0 && srcList.constructor == Array){

                    me.loadImgs(srcList)
                }

            }).on('error',function(err){
                if(err){
                    console.log('获取图片链接失败 ！')
                }
            });


        })
    },
    loadImgs(imgs){
        imgs.forEach(function(v){
            if(v != '' && typeof v != 'undefined'){
                    
                let fileName =  v.substring(v.lastIndexOf('/')+1,v.length) ;

                http.get(v ,function(res){
                    let imgData = '';
                    res.setEncoding("binary");/*设置编码*/
                    res.on('data',function(chunk){
                        imgData+=chunk;
                    });

                    res.on('end',function(){
                        fs.writeFile(dir+fileName,imgData,"binary",function(err){
                            if(err){
                                console.log(err)
                            }else{
                                console.log(fileName+"下载成功")
                            }
                        })
                    }).on('error',function(err){
                        console.log('下载失败'+err)
                    })

                })

            }

        })
    },
    getBgSrc(){
        let me = this;
        http.get(host,function(res){
            let data = '';
            res.setEncoding('UTF8');
            res.on('data',function(chunk){
                data += chunk;

            });

            res.on('end',function(){
                let  $ = cheerio,
                    $$ = $(data),
                    linkList = $$.find('link') ;


                /*获取主页的css文件*/
                let hrefList = Array.from(linkList,function(v){

                    let data = $(v).attr('href');

                    if(data.indexOf('css') > -1){
                        return data;
                    }else {
                        return '';
                    }
                });

                hrefList.forEach(function(v){

                    if( v !== '') {
                        /*下载css文件*/
                        http.get(v,function(res){
                            let data = '';
                            res.setEncoding('UTF8');
                            res.on('data',function(chunk){
                                data += chunk;
                            });
                            res.on('end',function(){
                                let css = data;

                                me.getBgUrl(css);


                            })
                        });

                    }

                });









            })


            
        })
    },
    getBgUrl (css){

        let data = css,
            me = this,
            start =  data.indexOf('url'),
            end = data.indexOf(')',start),
            addr = data.substring(start,end),
            newData = data.substring(end+1,data.length);

            this.addrList.push(addr);

            if(start > -1) {

                this.getBgUrl(newData);

            }else{
                /*获取url中的地址*/

              let  addrList =  this.addrList.map(function(v,i){
                    let data = v,
                        start = data.indexOf('/');

                    return me.domain + "/v3"+data.substring(start,data.length-1);

                });


                    this.loadImgs(addrList);



            }



    }
};

(function init(){
    /*初始化*/
    getImgs.init();

})();


         



