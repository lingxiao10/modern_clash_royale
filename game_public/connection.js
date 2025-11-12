const currentLang_connection = window.gameLanguage || 'en';
// 前端连接逻辑，解耦
class Connection {
    actionMapForNotice={};
    receiveAction(action)
    {
        let that=this;
        let name=action.name;
        if(name=="alert")
        {
            if(action.msg==null)
            {
                action.msg="alert";
            }
            ui.showToast(action.msg);
        }
        else if(action.functionName)
        {
            let functionName=action.functionName;
            let method=that[functionName];
            if(method)
            {
                method(action.params);
            }
        }
    }
    getUserId()
    {
        

        let userId= getUserId();
        check_not_null(userId,"game_user_id");
        return userId;
        // this.userId = localStorage.getItem('gameUserId');
        // if (!this.userId) {
        //     this.userId = '' + Date.now() + Math.random();
        //     localStorage.setItem('gameUserId', this.userId);
        // }
        // return this.userId;
    }
    getGameId()
    {
        return this.gameEngine.gameId || 'clash_royale';
    }
    confirmCreateFriendRoom(data)
    {
        console.log(data,"data123123123");
        let that=this;
        if(data.success)
        {
            //通知用户创建房间成功
            let fun=that.confirmFun;
            fun(data.roomId);
        }
        else
        {
            //通知用户创建房间失败
            //toast
            // console.log(data,'创建房间失败');

        }
    }

    handleReconnect(gameState, frameNumber, send, players, opponentId) {
        console.log("showGameElements123123123123");
        GameUI.gameUi.startGame();
        window.log('处理重连: frameNumber=' + frameNumber);

        this.myUserId = connection.getUserId();

        if(!gameState)
        {
            return;
        }

        this.gameEngine.restoreState(gameState,frameNumber);

        if (send) {
            connection.sendReconnectConfirm();
        }
    }
    static preset_domain=null;
    constructor(gameEngine) {
        console.log('Initializing connection');
        let that=this;
        this.gameEngine = gameEngine;
        // this.userId = localStorage.getItem('gameUserId');
        // if (!this.userId) {
        //     this.userId = '' + Date.now() + Math.random();
        //     localStorage.setItem('gameUserId', this.userId);
        // }
        let userId = this.getUserId();
        // http://192.168.101.24

        let gameId=this.getGameId();


        let domain=null;

        if(HelperInner.getUrlParams("is_offline")
        &&
            !HelperInner.getUrlParams("is_cpolar")
        )
        {
             domain=Connection.preset_domain?Connection.preset_domain:'http://192.168.101.24';

             // if(HelperInner.getUrlParams("is_cpolar"))
             // {
             //     domain="http://3dfa0abf.r12.vip.cpolar.cn";
             // }

            this.socket = io(domain+':16666', { query: { userId: userId, gameId: gameId } });
        }
        else{


            domain=Connection.preset_domain?Connection.preset_domain:'wss://socket.devokai.com';
            let domain1=window.location.hostname;
            if(domain1.match(/devok\./)||HelperInner.getUrlParams("devok"))
            {
                domain="wss://socket.xfeixie.com";
            }

            console.log(domain,"domain123123123123");
            this.socket = io(domain, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                query: { userId: userId, gameId: gameId }
            });
        }

        this.socket.on("noticeOthers",(data)=>{
            let name=data.name;
            let fun=that.actionMapForNotice[name];
            if(fun)
            {
                fun(data);
            }
        })




        // this.updateStatus = (text) => document.getElementById('status').textContent = text;

        this.socket.on('connect', () => {
            console.log('Socket connected, id: ' + this.socket.id);
            // this.updateStatus("连接成功，匹配中...");
            // $("#myId").text("您的ID: " + userId.slice(-6));
            // this.connected();

            let game=this.gameEngine;
            if(game.connected)
            {
                game.connected();
            }
            // 连接成功后立即检查房间状态
            this.checkRoomStatus();
            // this.tryJoinFriendRoom();
        });
        //matchFailed
        this.socket.on('matchFailed', (data) => {
            console.log('matchFailed:', data);
            // if(this.gameEngine.dealMatchFailed)
            // {
            //     this.gameEngine.dealMatchFailed(data);
            // }
            // this.updateStatus(data.message);
        });

        this.socket.on('roomStatus', (data) => {
            // this.gameEngine.applyForRoom(data);
        });

        this.socket.on('connect_error', (error) => {
            });


        this.socket.on('waiting', () => {
            // console.log('Received waiting');
        });
        this.socket.on('gameOverConfirm', (data) => {
            // ui.showToast("游戏结束");
            // this.gameEngine.handleGameOverConfirm(data);
           let data1= this.gameEngine.handelGameOverConfirm(data);

            //
            if(data1==null)
            {
                data1=data;
            }

            // 禁用游戏内菜单按钮
            if (GameUI.gameUi) {
                GameUI.gameUi.showGameOver(data1);
            }
        });
        let con=that;
        this.socket.on('gameStart', (data) => {

            con.playingAgain=false;

            console.log(data,"gameStart11111");
            ui.hideWaiting();
            setTimeout(function(){
                ui.hideWaiting();
            },1000);

            console.log('Received gameStart:', data);
            if( data.opponentId)
            {
                // this.updateStatus("游戏开始，对手ID: " + data.opponentId.slice(-4));
            }
            GameUI.gameUi.startGame();
            GameUI.gameUi.enableInGameMenu();




            this.gameEngine.frameNumber = data.frameNumber;
             this.checkRoomStatus();
            if(this.gameEngine.closeMatchPanel)
            {
                this.gameEngine.closeMatchPanel();
            }

            let that=this;
            that.gameEngine.startGame(data);

        });

        this.socket.on('opponentDisconnected', () => {
            // 处理对方断开
            console.log('Opponent temporarily disconnected, please wait');
            document.getElementById('status').textContent = t_inner('opponentDisconnected');
            console.log(this.gameEngine,"engine123123123123123");
            this.socket.emit('saveData',{
                // this.state = JSON.parse(JSON.stringify(gameState));
                // this.startTime = gameState.startTime;
                // this.currentFrameTime = Date.now();
                // this.currentFrameNumber = frameNumber;
                //当前的游戏状态
                gameState: this.gameEngine.state,
                frameNumber: this.gameEngine.currentFrameNumber
            });

        });

        // this.socket.on('reconnectResponse', (data) => {
        //     this.gameEngine.handleReconnect(data.gameState, data.frameNumber, false);
        // });
        this.socket.on('re_init_work', (data) => {
            console.log('Received re_init_work:', data);
            connection.handleReconnect(data.gameState, data.frameNumber, false, data.players, data.opponentId);

            // this.socket.emit('syncConfirmed');
        });
        this.socket.on('confirmInitFinishedBoth', (data) => {

            that.gameEngine.receiveConfirmInitFinishedBoth(data);

        });

        this.socket.on("sendInfo",(data)=>{
            console.log(data,"sendInfo123123123123");
            let actionList=data.actionList;
            for(let i in actionList)
            {
                let action=actionList[i];
                that.receiveAction(action);
            }

        });


        //createFriendRoom
        this.socket.on('createFriendRoom', (data) => {
            connection.confirmCreateFriendRoom(data);
        });

        this.socket.on('opponentExited', (data) => {
            // 重置游戏状态
            this.gameEngine.state = null;
            // 断开连接，退出游戏
            this.socket.disconnect();
        });
        this.socket.on('frameUpdate', (data) => {
            if(data.actions && data.actions.length>0)
            {
                // console.log('Received frame:', data.frameNumber, 'actions:', data.actions);
            }

            this.gameEngine.receiveFrame(data.frameNumber, data.actions);
        });
    }
    confirmInitFinished()
    {
        

        this.socket.emit('confirmInitFinished', {
            gameId:this.getGameId(),
            userId:getUserId()
        });
    }
    cancelFriendBattle()
    {
        this.socket.emit('cancelFriendBattle', {
            gameId:this.getGameId(),
            userId:getUserId()
        });
        // let hasRoom=?
    }
    goHome()
    {
        GameUI.gameUi.showInitialUI();
        //发出leave事件
        // this.socket.emit('leave', {
        //     gameId:this.getGameId(),
        //     userId:getUserId()
        // });
        let that=this;
        this.noticeOthers("leave",{},function(){
            that.cancelPlayAgain();
        });
    }

    noticeOthers(name,params,fun)
    {
        this.actionMapForNotice[name]=fun;
        this.socket.emit('noticeOthers', {
            gameId:this.getGameId(),
            userId:getUserId(),
            name:name,
            params:params
        });
    }

    playAgain()
    {
        let that=this;
        if(this.getIsSinglePlay())
        {
            this.playSingle();
        }
        else{
            ui.showWaiting(t_inner('waitingForPlayAgain'),20,function(){
                that.cancelPlayAgain();
            });

            this.playingAgain=true;

            this.socket.emit('playAgain', {
                gameId:that.getGameId(),
                userId:getUserId()
            });
        }
        // let hasRoom=?
    }
    cancelPlayAgain()
    {
        if(!this.playingAgain)
        {
            return;
        }
        this.playingAgain=false;
        let that=this;
        this.socket.emit('cancelPlayAgain', {
            gameId:this.getGameId(),
            userId:getUserId()
        });
        ui.showToast(t_inner('playAgainTimeout'));
        setTimeout(function(){
            //goHome
            that.goHome();
        },1000);
    }

//     const opponentId = room.players[0];
//     const opponentSocket = socketMapReversGlobal[opponentId];
//     socketMapGlobal[socket.id] = userId;
//     socketMapReversGlobal[userId] = socket.id;
//     if (opponentSocket) {
//         io.to(opponentSocket).emit('gameStart', {
//             isPlayer1: true,
//             opponentId: userId,
//             // initialState: room.gameInstance.getInitialState()
//         });
//     }
//     socket.emit('gameStart', {
//     isPlayer1: false,
//     opponentId: opponentId,
//     // initialState: room.gameInstance.getInitialState()
// });

    sendAction(action) {

        // if(this.gameEngine.)
        if(this.gameEngine&&this.gameEngine.getCanSendAction)
        {
            if(!this.gameEngine.getCanSendAction())
            {
                console.log("can not send action");
                return;
            }

        }

        this.socket.emit('action', {
            action: action,
            gameId:this.getGameId(),
            timestamp: Date.now()
        });
    }
    gameOver(loserUserId,options)
    {
        console.log(1,"gameOver123123123");
        this.socket.emit('gameOver', {
            loserUserId:loserUserId,
            userId:this.getUserId(),
            gameId:this.getGameId(),
            options:options
        });
    }

    getIsSinglePlay()
    {
        return this.info?this.info.playSingle:false;
    }

    startPlay(info)
    {
        let that=this;


        if(typeof(GameData)!="undefined")
        {

            GameData.query_game_data(function(game_data,core_data){

                if(that.gameEngine.initBeforeMatch)
                {
                    that.gameEngine.initBeforeMatch(game_data,core_data);
                }

                let gameUserInfo={};
                if(GameEngine.gameEngine.getSynInfoBeforeBattle)
                {
                    gameUserInfo=GameEngine.gameEngine.getSynInfoBeforeBattle(game_data,core_data);
                }
                if(info==null)
                {
                    info={};
                }
                if(info["infoMerge"]==null)
                {
                    info["infoMerge"]={};
                }
                info["infoMerge"][getUserId()]=gameUserInfo;
                if(that.gameEngine.ai)
                {
                    if(that.gameEngine.ai.getSynInfoBeforeBattle)
                    {
                        info["infoMergeAI"]={};
                        info["infoMergeAI"]["virtual_id"]=that.gameEngine.ai.getSynInfoBeforeBattle();
                    }
                }
                console.log(info["infoMerge"],"infoMerge123123");
                that.startPlayPure(info);
            });
        }
        else{
            if(that.gameEngine.initBeforeMatch)
            {
                that.gameEngine.initBeforeMatch();
            }

            that.startPlayPure(info);
        }


    }
    startPlayPure(info) {
        console.log("startPlay123123");
        this.info=info;
        this.socket.emit('startPlay', {

            userId:this.getUserId(),
            gameId:this.getGameId(),
            info:info
        });
        if(info&&(info.startFriendRoom|| info.joinFriendRoom|| info.closeFriendRoom))
        {

        }
        else{
            if(this.gameEngine.openMatchPanel)
            {
                //开始匹配
                this.gameEngine.openMatchPanel();
            }
        }

    }
    requestReconnect() {
        console.log('Client: Sending reconnect request');
        this.socket.emit('reconnectRequest');
    }

    sendReconnectConfirm() {
        this.socket.emit('reconnectConfirm');
    }

    checkRoomStatus() {
        console.log("checkRoomStatus123123");
        this.socket.emit('checkRoomStatus', {
            userId: this.getUserId(),
            gameId: this.getGameId()
        });
    }

    exitGame() {
        this.socket.emit('exitGame', {
            userId: this.getUserId(),
            gameId: this.getGameId()
        });
    }
    // bindCancelMatch() {
    //     $("#cancelMatch").click(() => {
    //         if (connection) {
    //             connection.exitGame();
    //         }
    //     });
    // }
    playSingle()
    {
        this.startPlay({
            playSingle:1,
        });
    }
    startFriendBattle(fun)
    {
        console.log(1,"startFriendBattle1231");
        let info={
            startFriendRoom:1,
        }
        let that=this;
        ui.showWaiting(t_inner('waitingFriend'),120,function(){
            that.cancelFriendBattle();
        });
        that.startPlay(info);
        that.confirmFun=fun;
    }
    tryJoinFriendRoom()
    {
        // if(!GameEngine.gameEngine)
        // {
        //     GameEngine.gameEngine=new GameEngine();
        // }
        let urlParams = new URLSearchParams(window.location.search);
        let roomid = urlParams.get('roomid');

        console.log(roomid,"roomid123123123");
        let game=this.gameEngine;
        if(roomid)
        {

            //先要查询是否存在房间
            //我是否正在游戏过程中
            if(game.state && game.state.gameActive)
            {
                return;
            }
            let that=this;
            //询问是否加入房间
            ui.showConfirmPanel('', t_inner('confirmJoinRoom').replace('{roomid}', roomid), null, (confirmed) => {
                if (confirmed) {
                    let info={
                        joinFriendRoom:true,
                        roomId:roomid
                    }
                    that.startPlay(info);
                } else {
                    // 用户选择不加入房间
                    ui.showToast(t_inner('canceledJoinRoom'));
                }
            });
        }
    }
    startNetMatch()
    {
        let that=this;
        ui.showWaitingWithTimedown(t_inner('matching'), 10, function(){
            // that. cancelNetMatch();
            connection.cancelNetMatch({
            });
        });
        let startAIMatch=config.aiMatchConfig?config.aiMatchConfig.startAIMatch:false;
        console.log(startAIMatch,"startAIMatch123123");
        let matchId=Math.random();
        connection.startPlay({
            matchId:matchId,
            startAIMatch:startAIMatch,
        });
        this.matchId=matchId;
        // this.openMatchPanel();
        // connection.bindCancelMatch();
    }
    cancelNetMatch()
    {
        console.log("cancelNetMatch123123");
        this.socket.emit('cancelNetMatch', {
            matchId:this.matchId,
            userId: this.getUserId(),
            gameId: this.getGameId()
        });
    }

    // 发送游戏状态到服务器进行比较
    sendStateForComparison(gameState) {
        this.socket.emit('stateComparison', {
            userId: this.getUserId(),
            gameId: this.getGameId(),
            gameState: gameState
        });
    }
}

// 全局变量
let connection;
