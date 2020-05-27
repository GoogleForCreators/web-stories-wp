/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useInsertElement } from '../../../components/canvas';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

fdescribe('Element min size and playback', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render ok', () => {
    expect(
      fixture.container.querySelector('[data-testid="fullbleed"]')
    ).toBeTruthy();
  });

  describe('add 2 videos', () => {
    let video1;
    let video2;
    let video1Frame;
    let video2Frame;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const videoProps = {
        x: 0,
        y: 0,
        width: 260,
        height: 120,
        resource: {
          type: 'video',
          mimeType: 'video/webm',
          src: 'https://woolyss.com/f/spring-vp9-vorbis.webm',
          poster: 'https://i.imgur.com/fyezDHY.png',
        },
      };
      video1 = await fixture.act(() => insertElement('video', videoProps));
      await sleep(100); // auto-play issue
      video2 = await fixture.act(() =>
        insertElement('video', { ...videoProps, x: 20, y: 20 })
      );
      video1Frame = fixture.querySelector(
        `[data-element-id="${video1.id}"] [data-testid="videoFrame"]`
      );
      video2Frame = fixture.querySelector(
        `[data-element-id="${video2.id}"] [data-testid="videoFrame"]`
      );
    });

    it('hit play button on the covered element', async () => {
      // video1 is covered by video2
      // select video1 hover on play button, hit play, verify that it's playing
      const video1bb = video1Frame.getBoundingClientRect();

      await fixture.events.mouse.click(video1bb.x, video1bb.y);

      await sleep(300); // can be wait for selector

      await fixture.events.mouse.click(
        video1bb.x + video1bb.width / 2,
        video1bb.y + video1bb.height / 2
      );
      const video1El = fixture.querySelector(`#video-${video1.id}`);
      const video2El = fixture.querySelector(`#video-${video2.id}`);
      const video1isPlaying = video1El.paused === false;
      const video2isPlaying = video2El.paused === false;

      expect(video1isPlaying).toBe(true);
      expect(video2isPlaying).toBe(false);
      // await sleep(25000);
    });
  });
});
