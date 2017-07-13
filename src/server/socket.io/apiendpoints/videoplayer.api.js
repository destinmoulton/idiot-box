import OmxPlayer from 'node-omxplayer';

import VideoPlayerModel from '../../models/VideoPlayerModel';

const videoPlayerModel = new VideoPlayerModel(new OmxPlayer(), 'hdmi');
export default videoplayer = {
    cmd: {
        start: {
            params: ['filename'],
            func: (filename) => videoPlayerModel.start(filename)
        },
        isRunning: {
            params: [],
            func: () => videoPlayerModel.isRunning()
        },
        play: {
            params: [],
            func: () => videoPlayerModel.play()
        },
        pause: {
            params: [],
            func: () => videoPlayerModel.pause()
        },
        fastFwd: {
            params: [],
            func: () => videoPlayerModel.fastFwd()
        },
        rewind: {
            params: [],
            func: () => videoPlayerModel.rewind()
        },
        fwd30: {
            params: [],
            func: () => videoPlayerModel.fwd30()
        },
        back30: {
            params: [],
            func: () => videoPlayerModel.back30()
        },
        toggleSubtitles: {
            params: [],
            func: () => videoPlayerModel.toggleSubtitle()
        }
    }
}