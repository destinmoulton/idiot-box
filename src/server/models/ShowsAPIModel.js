class ShowsAPIModel {
    constructor(models){
        this._showsModel = models.showsModel;
        this._showSeasonsModel = models.showSeasonsModel;
    }

    getAllShowsWithSeasonLockedInfo(){
        return this._showsModel.getAll()
                .then((shows)=>{
                    let showsToReturn = [];
                    let promisesToRun = [];
                    shows.forEach((show)=>{
                        const cmd = this._showSeasonsModel.getSeasonsForShow(show.id)
                                        .then((seasons)=>{
                                            const newShow = Object.assign({}, show);

                                            let countLocked = 0;
                                            let countUnLocked = 0;
                                            seasons.forEach((season)=>{
                                                if(season.locked === 1){
                                                    countLocked++;
                                                } else {
                                                    countUnLocked++;
                                                }
                                            });
                                            
                                            newShow['num_seasons_locked'] = countLocked;
                                            newShow['num_seasons_unlocked'] = countUnLocked;
                                            return Promise.resolve(newShow);
                                        });
                        promisesToRun.push(cmd);
                    })
                    return Promise.all(promisesToRun);
                })
    }
}

export default ShowsAPIModel;