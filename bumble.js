/* Loader wrapper: keeps original Bumble runtime intact, then adds Cider House family widget. */
document.write('<script src="./bumble-core.js"><\/script>');
(function(){
  function loadWidget(){
    if(document.getElementById('ch-family-widget-script')) return;
    var s=document.createElement('script');
    s.id='ch-family-widget-script';
    s.src='./ch-family-widget.js?v=2';
    s.defer=true;
    document.head.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadWidget,{once:true});
  else loadWidget();
})();
