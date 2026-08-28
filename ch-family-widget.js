<style>
  .ch-family-widget,
  .ch-family-widget * {
    box-sizing: border-box;
  }

  .ch-family-widget {
    --ch-bg: #f7f2ec;
    --ch-text: #14100e;
    --ch-accent: #7a3f8f;
    --ch-accent-dark: #5d2f6a;
    --ch-border: rgba(122, 63, 143, 0.22);
    --ch-shadow: 0 18px 50px rgba(0, 0, 0, 0.14);
    --ch-radius: 0px;
    font-family: Arial, sans-serif;
  }

  .ch-family-tab {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 52px;
    height: 176px;
    background: rgba(247, 242, 236, 0.96);
    border: 1px solid var(--ch-border);
    border-right: none;
    border-radius: 14px 0 0 14px;
    box-shadow: var(--ch-shadow);
    z-index: 9998;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 8px 10px;
    cursor: pointer;
    transition: transform 0.25s ease, background 0.25s ease;
    backdrop-filter: blur(8px);
  }

  .ch-family-tab:hover {
    transform: translateY(-50%) translateX(-4px);
    background: rgba(247, 242, 236, 1);
  }

  .ch-family-tab-badge {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 50%;
    border: 1px solid rgba(122, 63, 143, 0.45);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .ch-family-tab-badge img {
    display: block;
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .ch-family-tab-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--ch-accent-dark);
    font-weight: 700;
    user-select: none;
  }

  .ch-family-overlay {
    position: fixed;
    inset: 0;
    background: rgba(20, 16, 14, 0.32);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
    z-index: 9996;
  }

  .ch-family-panel {
    position: fixed;
    right: 72px;
    bottom: 32px;
    width: 360px;
    max-width: calc(100vw - 32px);
    background: var(--ch-bg);
    color: var(--ch-text);
    border: 1px solid rgba(122, 63, 143, 0.28);
    box-shadow: var(--ch-shadow);
    z-index: 9997;
    opacity: 0;
    transform: translateY(18px);
    pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .ch-family-panel-inner {
    position: relative;
    padding: 26px 26px 24px;
  }

  .ch-family-close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: var(--ch-accent-dark);
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
  }

  .ch-family-kicker {
    margin: 0 0 10px;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--ch-accent-dark);
    font-weight: 700;
  }

  .ch-family-title {
    margin: 0 0 14px;
    font-size: 22px;
    line-height: 1.05;
    font-weight: 800;
    color: #14100e;
  }

  .ch-family-text {
    margin: 0 0 22px;
    font-size: 16px;
    line-height: 1.45;
    color: #3c312d;
  }

  .ch-family-btn {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    width: 100%;
    min-height: 44px;
    padding: 14px 16px;
    text-decoration: none;
    background: #14100e;
    color: #fff;
    font-size: 14px;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 800;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .ch-family-btn:hover {
    transform: translateY(-1px);
    background: #000;
  }

  .ch-family-btn-arrow {
    font-size: 16px;
    line-height: 1;
  }

  .ch-family-widget.is-open .ch-family-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  .ch-family-widget.is-open .ch-family-panel {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  @media (max-width: 767px) {
    .ch-family-tab {
      width: 46px;
      height: 148px;
      padding: 10px 6px 8px;
    }

    .ch-family-tab-badge {
      width: 24px;
      height: 24px;
      margin-bottom: 10px;
    }

    .ch-family-tab-badge img {
      width: 14px;
      height: 14px;
    }

    .ch-family-tab-label {
      font-size: 9px;
      letter-spacing: 0.22em;
    }

    .ch-family-panel {
      right: 12px;
      left: 12px;
      bottom: 12px;
      width: auto;
      max-width: none;
    }

    .ch-family-panel-inner {
      padding: 22px 18px 18px;
    }

    .ch-family-title {
      font-size: 20px;
    }

    .ch-family-text {
      font-size: 15px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ch-family-tab,
    .ch-family-panel,
    .ch-family-overlay,
    .ch-family-btn {
      transition: none;
    }
  }
</style>

<div class="ch-family-widget" id="chFamilyWidget">
  <button class="ch-family-tab" id="chFamilyTab" type="button" aria-label="Открыть информацию о Cider House">
    <span class="ch-family-tab-badge" aria-hidden="true">
      <img src="https://static.tildacdn.com/tild3737-6430-4936-b339-366238613430/_32x.png" alt="">
    </span>
    <span class="ch-family-tab-label">Cider House</span>
  </button>

  <div class="ch-family-overlay" id="chFamilyOverlay"></div>

  <div class="ch-family-panel" id="chFamilyPanel" role="dialog" aria-modal="true" aria-labelledby="chFamilyTitle">
    <div class="ch-family-panel-inner">
      <button class="ch-family-close" id="chFamilyClose" type="button" aria-label="Закрыть">×</button>

      <p class="ch-family-kicker">CIDER HOUSE FAMILY</p>
      <h3 class="ch-family-title" id="chFamilyTitle">Часть Cider House</h3>
      <p class="ch-family-text">
        Этот бренд входит в семейство продуктов Cider House.
      </p>

      <a class="ch-family-btn" href="https://ciderhouse.ru/" target="_blank" rel="noopener noreferrer">
        <span>Перейти на Cider House</span>
        <span class="ch-family-btn-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</div>

<script>
  (function () {
    var root = document.getElementById('chFamilyWidget');
    if (!root) return;

    var tab = document.getElementById('chFamilyTab');
    var panel = document.getElementById('chFamilyPanel');
    var overlay = document.getElementById('chFamilyOverlay');
    var closeBtn = document.getElementById('chFamilyClose');

    function openPanel() {
      root.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closePanel() {
      root.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    tab.addEventListener('click', function () {
      if (root.classList.contains('is-open')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    overlay.addEventListener('click', closePanel);
    closeBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePanel();
      }
    });
  })();
</script>
