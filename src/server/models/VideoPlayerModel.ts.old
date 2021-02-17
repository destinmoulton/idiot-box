import path from 'path';
export default class VideoPlayerModel {
    player = {};
    audioOutput = "";

    constructor(omxPlayer, audioOutput){
        this.player = omxPlayer;

        this.audioOutput = audioOutput;
    }

    start(basePath, filename){
        return new Promise((resolve, reject)=>{
            const source = path.join(basePath, filename);
            this.player.newSource(source, this.audioOutput);
            resolve(true);
        });
    }

    close(){
        return new Promise((resolve, reject)=>{
            this.player.quit();
            resolve(true);
        });
    }

    isRunning(){
        return new Promise((resolve, reject)=>{
            resolve(this.player.running);
        });
    }

    play(){
        return new Promise((resolve, reject)=>{
            this.player.play();
            resolve(true);
        });
    }

    pause(){
        return new Promise((resolve, reject)=>{
            this.player.pause();
            resolve(true);
        });
    }

    fastFwd(){
        return new Promise((resolve, reject)=>{
            this.player.fastFwd();
            resolve(true);
        });
    }

    rewind(){
        return new Promise((resolve, reject)=>{
            this.player.rewind();
            resolve(true);
        });
    }

    fwd30(){
        return new Promise((resolve, reject)=>{
            this.player.fwd30();
            resolve(true);
        });
    }

    back30(){
        return new Promise((resolve, reject)=>{
            this.player.back30();
            resolve(true);
        });
    }

    toggleSubtitles(){
        return new Promise((resolve, reject)=>{
            this.player.subtitles();
            resolve(true);
        });
    }
}