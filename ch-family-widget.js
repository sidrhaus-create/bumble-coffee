/* Cider House family widget — Bumble Coffee */
(function(){
  function init(){
    if(document.getElementById('ch-family-widget')) return;

    var style=document.createElement('style');
    style.textContent=`
#ch-family-widget{position:fixed;right:0;top:56%;transform:translateY(-50%);z-index:2147483000;font-family:Unbounded,system-ui,sans-serif;color:#14100E;pointer-events:none}
#ch-family-widget *{box-sizing:border-box}
#ch-family-widget .chfw-shell{position:relative;display:flex;align-items:stretch;pointer-events:auto;filter:drop-shadow(0 12px 28px rgba(20,16,14,.13))}
#ch-family-widget .chfw-panel{width:310px;min-height:194px;background:#F7F2EC;border:1px solid rgba(93,47,106,.24);border-right:0;transform:translateX(100%);opacity:0;pointer-events:none;transition:transform .38s cubic-bezier(.16,1,.3,1),opacity .24s ease;padding:26px 26px 24px;display:flex;flex-direction:column;justify-content:center}
#ch-family-widget.is-open .chfw-panel{transform:translateX(0);opacity:1;pointer-events:auto}
#ch-family-widget .chfw-tab{width:46px;height:146px;border:1px solid rgba(93,47,106,.30);border-right:0;background:#F7F2EC;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;cursor:pointer;padding:10px 0;transition:background .25s ease,color .25s ease}
#ch-family-widget .chfw-tab:hover{background:#F0E7DE}
#ch-family-widget .chfw-mark{width:24px;height:24px;border:1px solid #5D2F6A;border-radius:50%;display:grid;place-items:center;overflow:hidden}
#ch-family-widget .chfw-mark:before{content:'';display:block;width:13px;height:16px;background:#5D2F6A;-webkit-mask:url('assets/phoenix.svg') center/contain no-repeat;mask:url('assets/phoenix.svg') center/contain no-repeat}
#ch-family-widget .chfw-vertical{writing-mode:vertical-rl;transform:rotate(180deg);font-size:8px;font-weight:700;letter-spacing:.24em;white-space:nowrap;color:#5D2F6A}
#ch-family-widget .chfw-eyebrow{font-size:8px;font-weight:700;letter-spacing:.28em;color:#5D2F6A;margin:0 0 12px}
#ch-family-widget .chfw-title{font-size:18px;line-height:1.12;font-weight:800;letter-spacing:-.02em;margin:0 0 12px;color:#14100E}
#ch-family-widget .chfw-text{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:13px;line-height:1.5;color:rgba(20,16,14,.70);margin:0 0 18px}
#ch-family-widget .chfw-link{display:inline-flex;align-items:center;justify-content:space-between;gap:18px;width:100%;padding:13px 14px;background:#14100E;color:#F7F2EC!important;text-decoration:none;font-size:9px;font-weight:700;letter-spacing:.12em;border:1px solid #14100E;transition:background .25s ease,color .25s ease,transform .25s ease}
#ch-family-widget .chfw-link:hover{background:#5D2F6A;border-color:#5D2F6A;transform:translateY(-1px)}
#ch-family-widget .chfw-link span:last-child{font-size:15px;line-height:1}
#ch-family-widget .chfw-close{position:absolute;top:9px;right:53px;width:24px;height:24px;border:0;background:transparent;cursor:pointer;color:#5D2F6A;font-size:17px;line-height:1;display:none}
#ch-family-widget.is-open .chfw-close{display:block}
@media(max-width:640px){
  #ch-family-widget{top:48%;}
  #ch-family-widget .chfw-tab{width:38px;height:124px;gap:9px}
  #ch-family-widget .chfw-mark{width:21px;height:21px}
  #ch-family-widget .chfw-mark:before{width:11px;height:14px}
  #ch-family-widget .chfw-vertical{font-size:7px;letter-spacing:.20em}
  #ch-family-widget .chfw-panel{width:min(286px,calc(100vw - 38px));min-height:176px;padding:22px 20px 20px}
  #ch-family-widget .chfw-title{font-size:16px}
  #ch-family-widget .chfw-text{font-size:12px}
  #ch-family-widget .chfw-close{right:44px}
}
@media(prefers-reduced-motion:reduce){#ch-family-widget .chfw-panel,#ch-family-widget .chfw-link{transition:none}}
`;
    document.head.appendChild(style);

    var root=document.createElement('div');
    root.id='ch-family-widget';
    root.innerHTML=`
      <div class="chfw-shell">
        <div class="chfw-panel" role="dialog" aria-label="Cider House family">
          <button class="chfw-close" type="button" aria-label="Закрыть">×</button>
          <div class="chfw-eyebrow">CIDER HOUSE FAMILY</div>
          <div class="chfw-title">ЧАСТЬ CIDER HOUSE</div>
          <p class="chfw-text">Bumble Coffee входит в семейство брендов Cider House.</p>
          <a class="chfw-link" href="https://ciderhouse.ru/" target="_top" rel="noopener" aria-label="Перейти на сайт Cider House"><span>ПЕРЕЙТИ НА CIDER HOUSE</span><span>→</span></a>
        </div>
        <button class="chfw-tab" type="button" aria-expanded="false" aria-label="Открыть Cider House family">
          <span class="chfw-mark" aria-hidden="true"></span>
          <span class="chfw-vertical">CIDER HOUSE</span>
        </button>
      </div>`;
    document.body.appendChild(root);

    var tab=root.querySelector('.chfw-tab');
    var close=root.querySelector('.chfw-close');
    function setOpen(v){root.classList.toggle('is-open',v);tab.setAttribute('aria-expanded',v?'true':'false')}
    tab.addEventListener('click',function(e){e.stopPropagation();setOpen(!root.classList.contains('is-open'))});
    close.addEventListener('click',function(e){e.stopPropagation();setOpen(false)});
    document.addEventListener('click',function(e){if(root.classList.contains('is-open')&&!root.contains(e.target))setOpen(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false)});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();