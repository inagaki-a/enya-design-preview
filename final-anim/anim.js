/* 縁家 アニメーション版：スクロール表示（IntersectionObserver）。失敗しても内容は必ず表示する */
(function(){
  var d=document,h=d.documentElement;
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  var hd=d.querySelector("header");
  function sc(){if(hd)hd.classList.toggle("sc",window.scrollY>8)}
  addEventListener("scroll",sc,{passive:true});sc();

  if(reduce||!("IntersectionObserver" in window)){h.classList.remove("js");return}

  var list=[];
  function add(el,i){if(el&&!el.classList.contains("rv")){el.classList.add("rv");el.style.setProperty("--d",Math.min(i,6)*.09+"s");list.push(el)}}

  d.querySelectorAll("main > section:not(.hero) > .wrap").forEach(function(w){
    Array.prototype.forEach.call(w.children,function(c,i){
      if(c.matches("ul,ol")&&c.querySelector("li")){
        Array.prototype.forEach.call(c.children,function(li,j){add(li,j)});
      }else add(c,Math.min(i,2));
    });
  });
  /* 記事ページなど .wrap 以外の構成にも対応 */
  if(!list.length){d.querySelectorAll("main h1,main h2,main p,main img,main li").forEach(function(e,i){add(e,i%4)})}

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}});
  },{rootMargin:"0px 0px -8% 0px",threshold:.08});
  list.forEach(function(el){io.observe(el)});

  /* 保険：3秒後にまだ隠れているものは出す（観測が働かない環境対策） */
  setTimeout(function(){list.forEach(function(el){
    var r=el.getBoundingClientRect();if(r.top<innerHeight*1.2)el.classList.add("in");
  })},3000);
})();
