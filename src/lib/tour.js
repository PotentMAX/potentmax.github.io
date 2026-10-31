export function startTour() {
  if (window.__cattyModTour) return;

  function getTarget(step) {
    if (step.sel) return document.querySelector(step.sel);

    if (step.text) {
      var spans = document.querySelectorAll('span');

      for (var i = 0; i < spans.length; i++) {
        if (
          spans[i].textContent.trim().toLowerCase() ===
          step.text.toLowerCase()
        ) {
          return spans[i].closest('.menu-bar_menu-bar-item_oLDa-') || spans[i];
        }
      }
    }

    return null;
  }

  var steps = [
    {
      type: 'welcome',
      title: 'Welcome to CattyMod!',
      desc: 'Let me show you round!'
    },
    {
      type: 'target',
      text: 'Settings',
      desc: 'Here you can manage your settings.'
    },
    {
      type: 'target',
      text: 'File',
      desc: 'Open, save, or manage your files here.'
    },
    {
      type: 'target',
      text: 'Edit',
      desc: 'Quick access to editing options.'
    },
    {
      type: 'target',
      sel: '.gui_blocks-wrapper_1ccgf, .blocklySvg, .scratchCategoryMenu',
      desc: 'This is the Scratch Blocks palette and workspace.'
    },
    {
      type: 'target',
      sel: '.stage_stage_1fD7k',
      desc: 'This is the Stage, where your project comes to life!'
    },
    {
      type: 'target',
      sel: '.controls_controls-container_2xinB',
      desc: 'Use these controls to start, pause, or stop your project.'
    },
    {
      type: 'end',
      title: 'Tour Complete',
      desc: "That's it for the tour! Have Fun!"
    }
  ];

  var currentStep = 0;

  var overlay = document.createElement('div');
  overlay.id = 'cm-tour-overlay';
  overlay.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;pointer-events:none;font-family:sans-serif;';

  document.body.appendChild(overlay);

  var style = document.createElement('style');
  style.id = 'cm-tour-styles';

  style.textContent = `
    @keyframes cmPulse {
      0% { box-shadow: 0 0 0 0px rgba(76, 151, 255, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(76, 151, 255, 0); }
      100% { box-shadow: 0 0 0 0px rgba(76, 151, 255, 0); }
    }

    .cm-highlight {
      outline: 3px solid #4C97FF !important;
      outline-offset: 2px !important;
      border-radius: 4px;
      animation: cmPulse 2s infinite;
      z-index: 999998;
      position: relative;
    }

    .cm-box {
      position: fixed;
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.25);
      border: 1px solid #e0e0e0;
      width: 420px;
      pointer-events: auto;
      color: #333;
      font-family: system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
      transition: all 0.2s ease-out;
      text-align: center;
    }

    .cm-box-small {
      width: 290px;
      padding: 20px;
      border-radius: 12px;
      text-align: left;
    }

    .cm-icon-box {
      width: 56px;
      height: 56px;
      background: #eef4ff;
      color: #4C97FF;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
    }

    .cm-box h3 {
      margin: 0 0 10px 0;
      font-size: 22px;
      color: #111;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .cm-box-small h3 {
      font-size: 17px;
      justify-content: flex-start;
    }

    .cm-box p {
      margin: 0 0 24px 0;
      font-size: 15px;
      color: #555;
      line-height: 1.5;
    }

    .cm-box-small p {
      margin-bottom: 16px;
      font-size: 13px;
      text-align: left;
    }

    .cm-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      cursor: pointer;
      color: #888;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 6px;
    }

    .cm-close:hover {
      color: #000;
      background: #f0f0f0;
    }

    .cm-btn-group {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      align-items: center;
    }

    .cm-box:not(.cm-box-small) .cm-btn-group {
      justify-content: center;
    }

    .cm-btn {
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .cm-btn-primary {
      background: #4C97FF;
      color: #fff;
    }

    .cm-btn-primary:hover {
      background: #3373CC;
    }

    .cm-btn-sec {
      background: #e4e6eb;
      color: #333;
    }

    .cm-btn-sec:hover {
      background: #d8dadf;
    }
  `;

  document.head.appendChild(style);

  var box = document.createElement('div');
  box.className = 'cm-box';
  overlay.appendChild(box);

  window.__cattyModTour = true;

  function cleanup() {
    var hl = document.querySelectorAll('.cm-highlight');

    hl.forEach(el => el.classList.remove('cm-highlight'));

    if (overlay) overlay.remove();
    if (style) style.remove();

    delete window.__cattyModTour;
  }

  function render() {
    document.querySelectorAll('.cm-highlight').forEach(el => {
      el.classList.remove('cm-highlight');
    });

    var step = steps[currentStep];
    box.innerHTML = '';

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'cm-close';

    closeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

    closeBtn.onclick = cleanup;
    box.appendChild(closeBtn);

    // Welcome and end screens
    if (step.type === 'welcome' || step.type === 'end') {
      box.classList.remove('cm-box-small');

      box.style.top = '50%';
      box.style.left = '50%';
      box.style.transform = 'translate(-50%, -50%)';

      var iconBox = document.createElement('div');
      iconBox.className = 'cm-icon-box';

      if (step.type === 'welcome') {
        iconBox.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
        `;
      } else {
        iconBox.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
      }

      box.appendChild(iconBox);
    } else {
      box.classList.add('cm-box-small');
      box.style.transform = 'none';

      var target = getTarget(step);

      if (target) {
        target.classList.add('cm-highlight');

        var rect = target.getBoundingClientRect();
        var top = rect.bottom + 10;
        var left = rect.left;

        if (top + 150 > window.innerHeight) {
          top = rect.top - 160;
        }

        if (left + 290 > window.innerWidth) {
          left = window.innerWidth - 310;
        }

        box.style.top = Math.max(10, top) + 'px';
        box.style.left = Math.max(10, left) + 'px';
      } else {
        box.style.top = '50%';
        box.style.left = '50%';
        box.style.transform = 'translate(-50%, -50%)';
      }
    }

    var title = document.createElement('h3');
    title.textContent =
      step.title || (step.text ? step.text : 'Step ' + currentStep);

    box.appendChild(title);

    var desc = document.createElement('p');
    desc.textContent = step.desc;
    box.appendChild(desc);

    var btnGroup = document.createElement('div');
    btnGroup.className = 'cm-btn-group';

    if (step.type === 'welcome') {
      var skipBtn = document.createElement('button');
      skipBtn.className = 'cm-btn cm-btn-sec';
      skipBtn.textContent = 'Skip';
      skipBtn.onclick = cleanup;

      btnGroup.appendChild(skipBtn);

      var startBtn = document.createElement('button');
      startBtn.className = 'cm-btn cm-btn-primary';

      startBtn.innerHTML = `
        Let's go!
        <svg width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;

      startBtn.onclick = function () {
        currentStep++;
        render();
      };

      btnGroup.appendChild(startBtn);
    } else if (step.type === 'end') {
      var endBtn = document.createElement('button');
      endBtn.className = 'cm-btn cm-btn-primary';
      endBtn.textContent = 'End Tour';
      endBtn.onclick = cleanup;

      btnGroup.appendChild(endBtn);
    } else {
      var nextBtn = document.createElement('button');
      nextBtn.className = 'cm-btn cm-btn-primary';

      nextBtn.innerHTML = `
        Next
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;

      nextBtn.onclick = function () {
        currentStep++;
        render();
      };

      btnGroup.appendChild(nextBtn);
    }

    box.appendChild(btnGroup);
  }

  render();
}
