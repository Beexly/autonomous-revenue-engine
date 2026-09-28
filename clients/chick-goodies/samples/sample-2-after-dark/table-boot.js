/* Decides whether the room is rendered or photographed (plan 11.3 item 2).
 *
 * This runs as a classic script so the 1.3 MB renderer is only fetched when it
 * will actually be used: a static import would download it before any check
 * could run. Phones, reduced motion and machines without WebGL get a real
 * render of this same scene as a still, with the same copy over it.
 *
 * Feature detection and viewport width only. Never a user-agent string.
 *
 * table-cinematic.js owns the station nav when it loads, so this file wires the
 * nav only on the path where it does not.
 */
(function () {
  var root = document.documentElement;

  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
                (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) {
      return false;
    }
  }

  var wide = matchMedia('(min-width: 900px)').matches;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (wide && !calm && hasWebGL()) {
    import('./table-cinematic.js').catch(still);
  } else {
    still();
  }

  function still() {
    root.classList.add('scene-still');

    var btns = [].slice.call(document.querySelectorAll('#stations button'));
    var secs = [].slice.call(document.querySelectorAll('.station'));

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var el = document.getElementById('s' + b.getAttribute('data-go'));
        if (el) el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      });
    });

    function mark() {
      var best = 0, mid = innerHeight * 0.5;
      secs.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid * 0.2) best = i;
      });
      btns.forEach(function (b, i) {
        if (i === best) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }
    addEventListener('scroll', mark, { passive: true });
    addEventListener('resize', mark, { passive: true });
    mark();
  }
})();
