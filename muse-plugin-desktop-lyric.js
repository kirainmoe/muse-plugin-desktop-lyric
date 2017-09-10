/**
 * MUSE Player plugin: desktop-lyric
 * Show lyric on fixed position while page is being scrolled.
 * This is also an official example of developing MUSE plugins.
 *
 * @package muse-plygin-desktop-lyric
 * @author kirainmoe / MoeFront Studio
 * @version 0.1
 * @links https://github.com/kirainmoe/muse-plugin-desktop-lyric
 */
(function(document, window) {

  function MusePluginDesktopLyric() {}

  // disable desktop lyric
  MusePluginDesktopLyric.prototype.closeDesktopLyric = function() {
    if (confirm('Disable desktop lyric?')) {
      document.body.removeChild(this.lyricContainer);
      window.MUSE.destroyMiddleware('onLyricUpdate', this.onUpdate);
    }
  };

  // change position of container
  MusePluginDesktopLyric.prototype.onMove = function(e) {
    var width = desktopLyric.lyricContainer.offsetWidth / 2,
        height = desktopLyric.lyricContainer.offsetHeight / 2;
    var newPosX = e.clientX - width,
        newPosY = e.clientY - height;
    desktopLyric.lyricContainer.style.top = newPosY + 'px';
    desktopLyric.lyricContainer.style.left = newPosX + 'px';
  };
  MusePluginDesktopLyric.prototype.destroyMove = function(e) {
    desktopLyric.lyricContainer.removeEventListener('mousemove', desktopLyric.onMove);
    desktopLyric.lyricContainer.removeEventListener('mouseup', desktopLyric.destroyMove);
  };

  // render desktop lyric to the page
  MusePluginDesktopLyric.prototype.render = function() {
    var lyricContainer = document.createElement('div');
    lyricContainer.setAttribute('class', 'muse-plugin-desktop-lyric__container');

    lyricContainer.addEventListener('contextmenu', this.closeDesktopLyric.bind(this));
    lyricContainer.addEventListener('mousedown', function(e) {
      this.lyricContainer.addEventListener('mousemove', this.onMove);
      this.lyricContainer.addEventListener('mouseup', this.destroyMove);
    }.bind(this));

    this.lyricContainer = lyricContainer;
    document.body.appendChild(this.lyricContainer);
  };

  // handle lyric update event
  MusePluginDesktopLyric.prototype.onUpdate = function(instance, props) {
    if (desktopLyric.lyricContainer) {
      if (desktopLyric.lyricContainer.offsetHeight == 0) {
        desktopLyric.lyricContainer.style.display = 'block';
      }
      if (props.text == '')
        return;
      desktopLyric.lyricContainer.innerHTML = props.text;
    }
  };

  var desktopLyric = new MusePluginDesktopLyric();

  if (window.MUSE) {
    MUSE.registerMiddleware('onLyricUpdate', desktopLyric.onUpdate);
    window.addEventListener('load', desktopLyric.render.bind(desktopLyric));
  } else {
    console.error(
      'muse-plugin-desktop-lyric should be loaded after MUSE Player Object.'
    );
  }

})(document, window);
