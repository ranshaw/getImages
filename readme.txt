公司项目需要去扣别人家的网站，一个网站上有四五百张图片，一看就头大呀，然后花了2个小时，

用node撸了一个小玩意，几百张图片刷刷就下来了，很酸爽，


运行过程中，有时候会报这样的错误，


events.js:160
      throw er; // Unhandled 'error' event
      ^

Error: read ECONNRESET
    at exports._errnoException (util.js:1022:11)
    at TCP.onread (net.js:569:26)


暂时找不到解决办法，希望有知道的能告知一下