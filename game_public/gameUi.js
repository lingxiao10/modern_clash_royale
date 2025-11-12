// gameUi.js - 游戏初始UI界面模块
// 该模块负责渲染游戏的初始界面，避免直接显示canvas

// 语言映射，现在由TransInner.js处理

class GameUI {
    static instance = null;
    static gameUi = null;

    updateUserInfo()
    {
        let gameRecord=getUserData("game_record");
        if(gameRecord)
        {
            let level=gameRecord.level;
            let score=gameRecord.score;
            let rank=gameRecord.rank;

            // let text= t_inner('playerInfo').
            // replace('{level}', level).replace('{score}', score);


            let text=getUserData("info_string");

            // const info = document.createElement('div');
            let infoDom=$("#info");
            // if(infoDom.length==0)
            // {
            //     $("#startGameBtn").before("<div id='info'></div>");
            //     infoDom=$("#info");
            // }

            infoDom.html(text);


            // startButton.score = "";
            // buttonContainer.appendChild(info);
        }
    }
    constructor(data) {
        GameUI.gameUi = this;
        if (GameUI.instance) {
            return GameUI.instance;
        }
        if (data.title) {
            this.title = data.title;
            $("title").text(this.title);
        }
        if(this.getUrlPamam("debug"))
        {
            setTimeout(window.startMyConsole, 500);
        }
        GameUI.instance = this;
        this.isDeveloperMode = this.checkDeveloperMode();
        this.menuEnabled = false;
        this.init();
    }

    // 检查是否为开发者模式
    checkDeveloperMode() {
        // 通过URL参数或本地存储检查开发者模式
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('dev') === '1' || localStorage.getItem('developerMode') === 'true';
    }

    refresh()
    {
        let that=this;
        console.log("refresh123123123");
        that.createInitialUI(function(){
            that.bindEvents();
        });
    }
    // 初始化UI
    init() {
        console.log('GameUI初始化开始');
        try {
            let that=this;
            let fun=function(){
                that.refresh();
                console.log('GameUI界面创建完成');

                console.log('GameUI事件绑定完成');
                let game_user_id=getUserId();
                if(game_user_id)
                {
                    console.log("gameEngine123123");
                    if(!GameEngine.gameEngine)
                    {
                        GameEngine.gameEngine=new GameEngine();
                    }
                }
            };
            get_user_id_pure(fun);


        } catch(e) {
            console.error('GameUI初始化错误', e);
        }
    }

    react()
    {
        if(getUserId())
        {
            $("#logoutBtn").show();
            this.refresh();
        }
        else{
            $("#logoutBtn").hide();

        }
    }

    createInitialUI(fun)
    {
        let that=this;
        console.log(GameData,"GameData123123123");
        if(typeof(GameData)!=="undefined")
        {
            GameData.query_game_data(function(gameData,coreData){
                that.createInitialUIPure(gameData,coreData);

                if(fun)
                {
                    fun();
                }
            });
        }
        else{
            that.createInitialUIPure();

            if(fun)
            {
                fun();
            }
        }

    }
    putUserId()
    {
        let userRid=getUserRid();
        if(userRid)
        {
            userRid=Helper.cut(userRid+"",8,"...");
            $("#userId").text("ID: "+userRid);
        }
    }
    copyShare()
    {
        let shareUrl = window.location.href;
        // console.log(coreData.share_code,"coreData.share_code123123123");
        if(this.coreData&&this.coreData.share_code)
        {
            shareUrl=Helper.setUrlParam(shareUrl,
                "c",this.coreData.share_code
            );
        }
        console.log(shareUrl,"shareUrl123123");

        HelperInner.copy(shareUrl);
        ui.showToast(t_inner('shareLinkCopied') || 'Share link copied!');
    }
    // 创建初始UI界面
    createInitialUIPure(gameData,coreData) {
        let hasLogin=GameData.hasLogin();
        this.coreData=coreData;
        this.gameData=gameData;
        console.log(hasLogin,"hasLogin123123");
        let that=this;
        //coreData里面有客服微信/客服邮箱。

        // 隐藏canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        let game_user_id=getUserId();

        // 隐藏其他游戏相关元素
        this.hideGameElements();
        $("#gameInitialUI").remove();

        // 创建主UI容器
        const uiContainer = document.createElement('div');
        uiContainer.id = 'gameInitialUI';
        uiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            color: #fff;
            font-family: Arial, sans-serif;
            overflow: hidden;
        `;


        // Emoji图标
        const emojiContainer = document.createElement('div');
        emojiContainer.style.cssText = `
            font-size: 64px;
            margin-bottom: 20px;
            animation: emojiPulse 2s infinite;
        `;
        emojiContainer.textContent = '⚔️🛡️';

        

        // 客服图标容器
        const customerServiceContainer = document.createElement('div');
        customerServiceContainer.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            display: flex;
            gap: 5px;
            z-index: 3000;
            background: rgba(0,0,0,0.1);
            padding: 5px;
            border-radius: 15px;
        `;

        const customerServiceIcon = document.createElement('div');
        customerServiceIcon.textContent = '💬';
        // customerServiceIcon.innerHTML = "<img style='width:30px;height:30px;' src='/images/kefu.png' >";
        customerServiceIcon.style.cssText = `
            font-size: 20px;
            cursor: pointer;
            transition: background 0.3s;
        `;
        customerServiceIcon.addEventListener('click', () => {
            if (typeof coreData !== 'undefined' && coreData) {
                const options = [];
                if (coreData.customerEmail) {
                    options.push({
                        text: t_inner('copyEmail'),
                        value: 'email'
                    });
                }
                if (coreData.customerWechat) {
                    options.push({
                        text: t_inner('copyWechat'),
                        value: 'wechat'
                    });
                }
                if (coreData.customerPhoneNumber) {
                    options.push({
                        text: t_inner('dialPhone'),
                        value: 'phone'
                    });
                }
                if(coreData.addLinks)
                {
                    for(let i=0;i<coreData.addLinks.length;i++)
                    {
                        let link=coreData.addLinks[i];
                        options.push({
                            text: link.text,
                            value: link.url,
                            url: link.url,
                        });
                    }
                }

                if (options.length > 0) {
                    ui.showOptionsPanel(t_inner('customerService'), '', options, function(data) {
                        if(data.url)
                        {
                            window.open(data.url);
                            return;
                        }
                        else if (data.value === 'email') {
                            Helper.copy(coreData.customerEmail);
                            ui.showToast(t_inner('emailCopied'));
                        } else if (data.value === 'wechat') {
                            Helper.copy(coreData.customerWechat);
                            ui.showToast(t_inner('wechatCopied'));
                        } else if (data.value === 'phone') {
                            // 检测是否为移动设备
                            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
                            if (isMobile) {
                                // 移动设备直接拨号
                                window.open('tel:' + coreData.customerPhoneNumber);
                            } else {
                                // 桌面设备复制号码
                                Helper.copy(coreData.customerPhoneNumber);
                                ui.showToast(t_inner('phoneCopied'));
                            }
                        }
                    });
                } else {
                    ui.showToast(t_inner('pleaseLoginFirst'));
                }
            } else {


                ui.showToast(t_inner('pleaseLoginFirst'));
            }
        });

        customerServiceContainer.appendChild(customerServiceIcon);

        // 语言切换容器
        let urlParams = new URLSearchParams(window.location.search);
        let currentLang = urlParams.get('lang') || 'en';

        const langContainer = document.createElement('div');
        langContainer.id = 'langSwitch';
        langContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 5px;
            z-index: 3000;
            background: rgba(0,0,0,0.1);
            padding: 5px;
            border-radius: 15px;
        `;

        const zhButton = document.createElement('div');
        zhButton.textContent = '中文';
    // #4CAF50
        zhButton.style.cssText = `
            padding: 8px 16px;
            font-size: 12px;
            line-height:14px;
            font-weight: bold;
            background: ${currentLang !== 'zh' ? 'transparent' : '#2196F3'};
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.3s;
        `;
        let notColor="rgb(118, 75, 162)";
        zhButton.addEventListener('click', function() {
            let currentUrl =window.location.href;

            let newUrl = setUrlParam(currentUrl, 'lang', 'zh');
            window.location.href = newUrl;
        });

        const enButton = document.createElement('div');
        enButton.textContent = 'EN';
        enButton.style.cssText = `
              padding: 8px 16px;
            font-size: 12px;
            line-height:14px;
            font-weight: bold;
            background: ${currentLang !== 'en' ? 'transparent' : '#2196F3'};
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.3s;
        `;
        enButton.addEventListener('click', function() {
            let currentUrl = window.location.href;
            let newUrl = setUrlParam(currentUrl, 'lang', 'en');
            window.location.href = newUrl;
        });

        langContainer.appendChild(zhButton);
        langContainer.appendChild(enButton);

        // 标题
        const title = document.createElement('h1');
        title.textContent = this.title;
        title.style.cssText = `
            font-size: 48px;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 0 0 20px rgba(255,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.3);
            animation: titleGlow 3s infinite;
        `;

        uiContainer.appendChild(customerServiceContainer);
        uiContainer.appendChild(langContainer);

        // 宣传语
        const slogan = document.createElement('p');
        slogan.textContent = t_inner('slogan');
        slogan.style.cssText = `
            font-size: 20px;
            margin-bottom: 40px;
            text-align: center;
            opacity: 0.9;
            font-style: italic;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        `;

        // 按钮容器
        let  buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
            overflow-y:scroll;
            max-height: 600px;
             /* 隐藏默认的滚动条样式 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
        `;
        buttonContainer.id="buttonContainer";
        // let level=


        // 开始游戏和分享按钮容器
        const startAndShareContainer = document.createElement('div');
        startAndShareContainer.style.cssText = `
            display: flex;
            gap: 20px;
            align-items: center;
            justify-content: center;
        `;

        // 开始游戏按钮
        const startButton = document.createElement('div');
        startButton.id = 'startGameBtn';
        startButton.classList.add("startGameBtn");
        let emoj="🚀";
        startButton.innerHTML = emoj+' ' + t_inner('startGame'); // 添加 emoji
        let is_repeat_user_invite=false;
        if(this.getRoomId())
        {
            startButton.innerHTML = emoj+' ' + this.getUrlPamam("roomtext"); //'开始提朋友的对战';

            let invite_user_id=this.getUrlPamam("invite_user_id");
            console.log(invite_user_id,"invite_user_id");
            if(getUserId()==invite_user_id)
            {
                is_repeat_user_invite=true;
                // startButton.textContent= t_inner('repeatUser');
            }


        }


        startButton.style.cssText = `
            padding: 15px 30px;
            font-size: 24px;
            font-weight: bold;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.3s;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;

        // 分享按钮
        const shareButton = document.createElement('div');
        shareButton.id = 'shareBtn';
        shareButton.innerHTML = '<img src="https://dev100-1256047633.cos.na-siliconvalley.myqcloud.com/game/images/share.png" alt="share" style="width:25px;height:25px;line-height:25px;margin-top:5px;">'; // 分享图标
        shareButton.style.cssText = `
            padding: 10px 10px;
            border-radius:40px;
            font-size: 24px;
            font-weight: bold;
            background: #FF9800;
            color: white;
            border: none;
            cursor: pointer;
            transition: background 0.3s;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            width: 60px;
            text-align: center;
        `;
        shareButton.title = 'Share Game'; // 添加提示
        shareButton.addEventListener('click', () => {
            that.copyShare();
        });
        shareButton.addEventListener('mouseover', () => {
            shareButton.style.background = '#e65100';
        });
        shareButton.addEventListener('mouseout', () => {
            shareButton.style.background = '#FF9800';
        });

        // 添加开始和分享按钮到容器
        startAndShareContainer.appendChild(startButton);
        if(!is_repeat_user_invite)
        {
            startAndShareContainer.appendChild(shareButton);
        }

        let infoDom= document.createElement('div');
        infoDom.id="info";

        infoDom.style.cssText = `
            padding: 15px 30px;
            font-size:24px;
            border-bottom:1px solid #eee;
        `;
        buttonContainer.appendChild(infoDom);

        if(!is_repeat_user_invite)
        {
            buttonContainer.appendChild(startAndShareContainer);
        }
        else{
            let error= document.createElement('div');
            error.id="error";
            error.style.fontSize="24px";
            error.style.color="orange";
            error.textContent= t_inner('repeatUser');
            buttonContainer.appendChild(error);
        }








        // 如果有用户ID，显示退出登录按钮
        const gameUserId = window.getUserId();
        let display="none";
        if(gameUserId)
        {
            display="block";
        }
        // alert(gameUserId);
        // if (gameUserId) {


        if(this.getRoomId())
        {
            const home = document.createElement('div');
            home.id = 'home';
            home.textContent = t_inner('home');
            home.style.cssText = `
                padding: 15px 30px;
                font-size: 24px;
                font-weight: bold;
                display:block;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.3s;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index:100;
            `;
            // GameUI.gameUi.handleLogout()
            buttonContainer.appendChild(home);
        }



        if(game_user_id)
        {
            // 添加配置文件中的额外按钮
            if (typeof config !== 'undefined' && config.uiExtraButtons && Array.isArray(config.uiExtraButtons)) {

                let buttons=config.uiExtraButtons;
                let buttonsAdmin=[];
                if(buttons==null)
                {
                    buttons=[];
                }
                if(typeof(GameData)!=="undefined" && GameData.getIsAdmin())
                {
                    buttonsAdmin=config.uiExtraButtonsForAdmin;
                }

                buttons.forEach(buttonConfig => {
                    const extraButton = document.createElement('div');
                    extraButton.textContent = buttonConfig.text;
                    extraButton.style.cssText = `
                    padding: 15px 30px;
                    font-size: 24px;
                    font-weight: bold;
                    background: ${buttonConfig.style?.background || '#2196F3'};
                    color: ${buttonConfig.style?.color || 'white'};
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.3s;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                `;
                    extraButton.addEventListener('click', () => {

                        if(!hasLogin)
                        {
                            ui.showToast(t_inner("pleaseLoginFirst"));
                            return;
                        }

                        let funName=buttonConfig.callback;
                        console.log(funName,"funName123123123");
                        let fun=ButtonManager[funName];
                        fun();
                        // if (typeof window[buttonConfig.callback] === 'function') {
                        //     window[buttonConfig.callback]();
                        // } else {
                        //     console.warn(`Callback function '${buttonConfig.callback}' not found on window object`);
                        // }
                    });
                    extraButton.addEventListener('mouseover', () => {
                        const hoverBg = buttonConfig.style?.hoverBackground || '#1976D2';
                        extraButton.style.background = hoverBg;
                    });
                    extraButton.addEventListener('mouseout', () => {
                        extraButton.style.background = buttonConfig.style?.background || '#2196F3';
                    });
                    buttonContainer.appendChild(extraButton);
                });



                if(buttonsAdmin&&buttonsAdmin.length>0)
                {
                    let divide= document.createElement('div');
                    divide.style.cssText = `
                    width: 100%;
                    fontSize: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-top:14px;
                `;
                    divide.innerHTML="<div>Admin</div>";


                    buttonContainer.appendChild(divide);

                    buttonsAdmin.forEach(buttonConfig => {
                        const extraButton = document.createElement('div');
                        extraButton.textContent = buttonConfig.text;
                        extraButton.style.cssText = `
                    padding: 15px 30px;
                    font-size: 24px;
                    font-weight: bold;
                    background: ${buttonConfig.style?.background || '#2196F3'};
                    color: ${buttonConfig.style?.color || 'white'};
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.3s;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                `;
                        extraButton.addEventListener('click', () => {
                            if(!hasLogin)
                            {
                                ui.showToast(t_inner("pleaseLoginFirst"));
                                return;
                            }
                            let funName=buttonConfig.callback;
                            console.log(funName,"funName123123123");
                            let fun=ButtonManager[funName];
                            fun();
                            // if (typeof window[buttonConfig.callback] === 'function') {
                            //     window[buttonConfig.callback]();
                            // } else {
                            //     console.warn(`Callback function '${buttonConfig.callback}' not found on window object`);
                            // }
                        });
                        extraButton.addEventListener('mouseover', () => {
                            const hoverBg = buttonConfig.style?.hoverBackground || '#1976D2';
                            extraButton.style.background = hoverBg;
                        });
                        extraButton.addEventListener('mouseout', () => {
                            extraButton.style.background = buttonConfig.style?.background || '#2196F3';
                        });
                        buttonContainer.appendChild(extraButton);
                    });
                }

            }
        }

        // const logoutButton = document.createElement('div');
        // logoutButton.id = 'logoutBtn';
        // logoutButton.classList.add("logoutBtn");
        // logoutButton.textContent = t_inner('logout');//getUserData("nickname");
        // logoutButton.style.cssText = `
        //         padding: 15px 30px;
        //         font-size: 24px;
        //         font-weight: bold;
        //         display:${display};
        //          background: #FF9800;
        //         color: white;
        //         border: none;
        //         border-radius: 10px;
        //         cursor: pointer;
        //         transition: background 0.3s;
        //         box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        //         z-index:100;
        //     `;
        // GameUI.gameUi.handleLogout()
        // if(logoutButton.textContent&&logoutButton.textContent.trim())
        // {
        //
        // }
        // buttonContainer.appendChild(logoutButton);
        // }






            const createButton = document.createElement('div');
        createButton.textContent = t_inner("createGame");
        createButton.style.cssText = `
                    padding: 15px 30px;
                    font-size: 24px;
                    font-weight: bold;
                    background: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.3s;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                `;
        createButton.addEventListener('click', () => {
                that.makeNew();
            });

        buttonContainer.appendChild(createButton);








        // 如果是开发者模式，添加测试区域
        // if (this.isDeveloperMode) {
        //     const testArea = this.createTestArea();
        //     uiContainer.appendChild(testArea);
        // }
        //
        uiContainer.appendChild(title);
        uiContainer.appendChild(buttonContainer);
        //
        document.body.appendChild(uiContainer);


        get_user_info(function(data){
            console.log(data,"data123123123");
            let userRid=getUserRid();
            $("#buttonContainer").find("#userId").remove();
            if(userRid)
            {

                $("#buttonContainer").append("<div style='position:fixed;left:0px;bottom:40px;width:100%;z-index:1000;text-align:center;' ><span style='padding-left:20px;padding-right:20px;background-color:#000;color:#fff;z-index:1000;border-radius:10px;height:36px;line-height:36px;font-size:16px;display:inline-block;margin-right:10px;' id='userId' class='b1'></span><span style='padding-left:20px;padding-right:20px;background-color:#000;color:#fff;z-index:1000;border-radius:10px;height:36px;line-height:36px;font-size:16px;display:inline-block;margin-left:10px;background-color:orange;' class='b1' id='logout'>"+t_inner("logout")+"</span></div>");
                $("#userId").click(function(){
                    // let userId=$("#userId").attr("user_id");
                    Helper.copy(getUserRid()+"_"+get_game_id());
                });
                $("#logout").click(function(){
                    // let userId=$("#userId").attr("user_id");
                    that.handleLogout()
                });
                that.putUserId();
            }
            else{
                let user_id=getUserId();
                if(user_id)
                {
                    $("#logout").remove();
                    $("#buttonContainer").append("<div style='position:fixed;left:0px;bottom:40px;width:100%;z-index:1000;text-align:center;' ><span style='padding-left:20px;padding-right:20px;background-color:#000;color:#fff;z-index:1000;border-radius:10px;height:36px;line-height:36px;font-size:16px;display:inline-block;margin-left:10px;background-color:orange;' class='b1' id='logout'>"+t_inner("logout")+"</span></div>");
                    $("#logout").click(function(){
                        // let userId=$("#userId").attr("user_id");
                        that.handleLogout()
                    });
                    that.putUserId();
                }
                $("#userId").remove();
            }
        });


        this.updateUserInfo();
    }

    // 创建测试区域

    // 测试按钮样式
    getTestButtonStyle() {
        return `
            padding: 10px 20px;
            font-size: 16px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        `;
    }

    // 绑定事件
    bindEvents() {
        // const startGameBtn = document.getElementById('startGameBtn');
        // let logoutBtn = $(".logoutBtn");

        // if (startGameBtn) {
            let fun=() => this.handleStartGame();
            // startGameBtn.removeEventListener('click', fun);
            // startGameBtn.addEventListener('click', fun);
            $(".startGameBtn").click(fun);
            // startGameBtn.addEventListener('mouseover', () => startGameBtn.style.background = '#45a049');
            // startGameBtn.addEventListener('mouseout', () => startGameBtn.style.background = '#4CAF50');
        // }

        $("#home").click(function(){
            let url=window.location.href;
            url=setUrlParam(url,"roomid","");
            window.location.href=url;
        });

        // if (logoutBtn) {
        //     // logoutBtn.addEventListener('click', () => this.handleLogout());
        //     // logoutBtn.addEventListener('mouseover', () => logoutBtn.style.background = '#d32f2f');
        //     // logoutBtn.addEventListener('mouseout', () => logoutBtn.style.background = '#f44336');
            let that=this;
            // logoutBtn.click(function(){
            //     that.handleLogout()
            // });
        // }
    }

    // 处理开始游戏
    handleStartGame() {
        const gameUserId = window.getUserId();

        console.log("handleStartGame");
        if(SoundManager)
        {
            SoundManager.playSound("message_alert");
        }


        let that=this;
        if (!gameUserId) {
            // 用户未登录，先进行登录
            if (typeof window.get_user_id === 'function') {
                window.get_user_id((data) => {
                    if (data && data.game_user_id) {
                        // 登录成功后，继续显示确认面板
                        //刷新一下
                        // that.refresh();


                        // let roomId=that.getRoomId();
                        // if(roomId)
                        // {
                        //
                        //     if(!GameEngine.gameEngine)
                        //     {
                        //         GameEngine.gameEngine=new GameEngine();
                        //     }
                        //     connection.tryJoinFriendRoom();
                        //     // GameEngine.gameEngine.joinFriendBattle(roomId);
                        // }
                        // else{
                        //     this.showGameModeSelection();
                        // }



                    }
                });
            } else {
                alert('无法进行登录操作');
            }
        } else {
            let roomId=that.getRoomId();
            if(roomId)
            {


                if(!GameEngine.gameEngine)
                {
                    GameEngine.gameEngine=new GameEngine();
                }
                connection.tryJoinFriendRoom();
                // GameEngine.gameEngine.joinFriendBattle(roomId);
            }
            else{
                this.showGameModeSelection();
            }
        }
    }

    startFriendBattle()
    {
        {
            if(!GameEngine.gameEngine)
            {
                GameEngine.gameEngine=new GameEngine();
            }
            if (typeof GameEngine !== 'undefined' && GameEngine.gameEngine) {
                connection.startFriendBattle(function(roomId){
                    console.log(roomId,"roomId12312123123123");
                    if(!roomId) {
                        ui.showToast(t_inner('roomCreationFailed'));
                        return;
                    }
                    // 生成分享的连接
                    let share_url = window.location.href;


                    share_url = setUrlParam(share_url, 'invite_user_id',getUserId());

                    share_url = setUrlParam(share_url, 'roomid', roomId);

                    share_url = setUrlParam(share_url, 'roomtext', "Accept Challenge");

                    let c=Helper.getUrlParams("c");
                    if(c)
                    {
                        share_url = setUrlParam(share_url, 'c', c);
                    }

                    // +getUserData("nickname")
                    console.log(share_url, "share_url123123123");

                    HelperInner.copy(share_url);
                    ui.showToast(t_inner('shareCopied'));
                    //已复制
                    // 复制到剪贴板
                    // navigator.clipboard.writeText(share_url).then(function() {
                    //     window.log('分享链接已复制到剪贴板: ' + share_url);
                    //     if (typeof ui !== 'undefined' && ui.showToast) {
                    //
                    //     } else {
                    //         alert(t_inner('shareCopied'));
                    //     }
                    // }).catch(function(err) {
                    //     if (typeof ui !== 'undefined' && ui.showToast) {
                    //         ui.showToast(t_inner('shareFailed'));
                    //     } else {
                    //         alert(t_inner('shareFailed'));
                    //     }
                    //     window.log('复制到剪贴板失败: ', err);
                    // });
                });
            }
        };
    }
    // 显示游戏模式选择
    showGameModeSelection() {
        // 注意：不隐藏初始UI，保持初始界面显示，只在上面layer显示模式选择面板
        let that=this;
        // 检查pre_start_game函数是否存在
        if (typeof pre_start_game !== 'undefined') {
            // 定义游戏模式函数
            let friend_work =that.startFriendBattle;

            let net_work = function() {
                if(!GameEngine.gameEngine)
                {
                    GameEngine.gameEngine=new GameEngine();
                }
                connection.startNetMatch();
            };

            let playSingle = function() {
                if(!GameEngine.gameEngine)
                {
                    GameEngine.gameEngine=new GameEngine();
                }
                connection.playSingle();
            };

            // 调用pre_start_game显示模式选择面板
            pre_start_game(friend_work, net_work, playSingle);
        } else {
            if(!GameEngine.gameEngine)
            {
                GameEngine.gameEngine=new GameEngine();
            }
            // 如果pre_start_game不存在，直接调用联网匹配
            console.log('pre_start_game不存在，直接开始联网匹配');
            if (typeof GameEngine !== 'undefined' && GameEngine.gameEngine) {
                connection.startNetMatch();
            }
        }
    }

    closeUi()
    {
        const initialUI = document.getElementById('gameInitialUI');
        if (initialUI) {
            initialUI.style.display = 'none';
        }
        ui.hideItemListPanel();
    }

    // 开始游戏
    startGame() {
        // 隐藏初始UI
        this.closeUi();

        // 显示canvas和游戏元素
        this.showGameElements();

        // 触发游戏开始
        this.emitStartGame();

        // 显示toast
        if (typeof ui !== 'undefined' && ui.showToast) {
            ui.showToast(t_inner('gameStarted'));
        }
    }

    // 处理退出登录
    handleLogout() {
        let that=this;
        ui.showConfirmPanel('', t_inner('confirmLogout'), null, (confirmed) => {
            if (confirmed) {

                logout();
                that.refresh();
                // 这里应该调用实际的退出登录逻辑
                // 暂时重定向到登录页面或执行退出动作
                // window.location.href = '/'; // 或适当的页面
            }
        });
    }

    // 处理测试退出
    handleTestExit() {
        // 如果游戏已经开始，调用退出游戏逻辑
        if (typeof connection !== 'undefined' && connection.exitGame) {
            if (typeof ui !== 'undefined' && ui.showConfirmPanel) {
                ui.showConfirmPanel('', t_inner('confirmExitGame'), null, (confirmed) => {
                    if (confirmed) {

                        connection.exitGame();
                        ui.showToast(t_inner('exitSuccess'));
                    }
                });
            } else {
                connection.exitGame();
                ui.showToast(t_inner('exitSuccess'));
            }
        } else {
            ui.showToast(t_inner('connectionNotEstablished'));
        }
    }

    // 处理测试胜利
    handleTestWin() {
        // 如果游戏已经开始，调用测试胜利逻辑
        if (typeof GameEngine !== 'undefined' && GameEngine.gameEngine) {
            let userId = null;
            if (typeof connection !== 'undefined' && connection.getUserId) {
                userId = connection.getUserId();
            }

            if (userId) {
                if (typeof ui !== 'undefined' && ui.showConfirmPanel) {
                    ui.showConfirmPanel('', t_inner('confirmTestWin'), null, (confirmed) => {
                        if (confirmed) {
                            connection.gameOver({
                                //当前用户rid
                                userId: userId
                            });
                            ui.showToast(t_inner('testWinAlert'));
                        }
                    });
                } else {
                    connection.gameOver({
                        userId: userId
                    });
                    alert(t_inner('testWinAlert'));
                }
            } else {
                alert(t_inner('userIdNotFound'));
            }
        } else {
            alert(t_inner('gameEngineNotStarted'));
        }
    }

    // 隐藏游戏元素
    hideGameElements() {
        const elementsToHide = [
            'infoPanel',
            'gameOverModal',
            'elixir',
            'panelPlayerPosition',
            'panelMyId',
            'panelOpponentId',
            'panelRoom',
            'startPlay',
            'exitGame',
            'restartBtn',
            'testWin',
            'toggleInfo',
            'closePanel'
        ];

        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });

    }

    // 显示游戏元素
    showGameElements() {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.display = 'block';
            // 设置canvas在页面中央
            canvas.style.position = 'fixed';
            canvas.style.top = '50%';
            canvas.style.left = '50%';
            canvas.style.transform = 'translate(-50%, -50%)';
            canvas.style.zIndex = '1000';
        }
    }
    getUrlPamam(property)
    {
        let urlParams =
            new URLSearchParams(window.location.search);
       return urlParams.get(property);
    }
    getRoomId()
    {
        let roomid=this.getUrlPamam("roomid");
        return roomid;
    }

    // 触发开始游戏事件
    emitStartGame() {
        // 这里可以触发自定义事件，让其他模块知道游戏开始
        const event = new CustomEvent('gameUIStart', {
            detail: { started: true }
        });
        window.dispatchEvent(event);
    }

    // 启用游戏中菜单
    enableInGameMenu() {
        if (!this.menuEnabled) {
            this.menuEnabled = true;
            this.createInGameMenuButton();
        }
    }

    // 禁用游戏中菜单
    disableInGameMenu() {
        if (this.menuEnabled) {
            this.menuEnabled = false;
            this.removeInGameMenuButton();
        }
    }

    showGameOver(data) {
        const isWinner = data.result=="win";
        let message=data.message;
        let that=this;
        if(isWinner)
        {
            SoundManager.playSound("win");
        }
        else{
            SoundManager.playSound("lose");
        }
        if(message==null)
        {
            message=isWinner?t_inner('gameOverWin'):t_inner('gameOverLose');
        }
        ui.informWithoutConfirm(message);
        setTimeout(function(){
            ui.hideConfirmPanel();
            ui.showOptionsPanel(message,"",[
                {
                    text:t_inner('returnToHome'),
                    value:"home",
                },
                {
                    text:t_inner('makeNewGame'),
                    value:"make_new"
                },
                {
                    text:t_inner('continueFight'),
                    value:"play_again"
                },
            ],function(data){
                if(data.value=="home")
                {
                    connection.goHome();
                    // that.showInitialUI();

                }
                else if(data.value=="make_new")
                {
                    that.makeNew();

                }
                else if(data.value=="play_again")
                {
                    connection.playAgain();
                }
            },false);
        },3000);

        this.disableInGameMenu();
    }
    makeNew()
    {
        //当前的域名
        let domain=window.location.hostname;
        // let isHttps=window.location.protocol=="https:";
        // let protocol=isHttps?"https://":"http://";
        // let url=protocol+domain;
        if(domain.match(/^devok\./) || domain.match(/192\.168\.101\.24/))
        {
            ui.showToast(t_inner('createGameAlert'));
            Helper.copy("飞写AI 游戏生成器");
        }
        else{
            let url="https://ai.devokai.com";
            window.open(url);
        }


    }
    // 创建游戏中菜单按钮
    createInGameMenuButton() {
        const menuButton = document.createElement('button');
        menuButton.id = 'gameMenuBtn';
        menuButton.textContent = t_inner('menu');
        menuButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        menuButton.addEventListener('click', () => this.showGameMenu());
        document.body.appendChild(menuButton);
    }

    // 移除菜单按钮
    removeInGameMenuButton() {
        const menuBtn = document.getElementById('gameMenuBtn');
        if (menuBtn) {
            menuBtn.remove();
        }
    }

    // 显示游戏菜单
    showGameMenu() {
        if (typeof ui !== 'undefined' && ui.showOptionsPanel) {
            let list=[
                {text: t_inner('exitToMenu'),value:'exit_game'},
            ];
            if(SoundManager&&SoundManager.getSoundIsOpen())
            {
                list.push( {text: t_inner('closeSoundEffect'),value:'close_sound_effect'});
            }
            else{
                list.push( {text: t_inner('openSoundEffect'),value:'open_sound_effect'});
            }
            if(GameEngine.gameEngine.showGameInstruction)
            {
                list.push({text: t_inner('showGameInstruction'),value:'show_instruction'});
            }



            ui.showOptionsPanel(t_inner('gameMenu'), '', list,  (result) => {
                if (result.value === 'exit_game') {
                    ui.showConfirmPanel('', t_inner('confirmExitToMenu'), null, (confirmed) => {
                        if (confirmed) {
                            this.exitGame();
                        }
                    });
                }
                else if (result.value === 'open_sound_effect') {
                    if(SoundManager)
                    {
                        SoundManager.openSound();
                    }

                }
                else if (result.value === 'close_sound_effect') {
                    if(SoundManager)
                    {
                        SoundManager.closeSound();
                    }
                }
                else if (result.value === 'show_instruction') {
                    GameEngine.gameEngine.showGameInstruction();
                }
            });
        } else {
            if (confirm(t_inner('confirmExit'))) {
                this.exitGame();
            }
        }
    }

    // 退出到初始UI
    // exitToInitialUI() {
    //     // 退出游戏
    //     if (typeof connection !== 'undefined' && connection.exitGame) {
    //         connection.exitGame();
    //     }
    //     // 返回初始界面
    //     this.showInitialUI();
    // }
    exitGame() {
        // 退出游戏
        if (typeof connection !== 'undefined' && connection.exitGame) {
            connection.exitGame();
        }
    }

    // 显示初始UI
    showInitialUI() {
        // 隐藏canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        // 隐藏菜单按钮
        this.disableInGameMenu();
        // 显示初始UI
        const initialUI = document.getElementById('gameInitialUI');
        if (initialUI) {
            initialUI.style.display = 'flex';
        }
        let that=this;

        //刷新数据
        get_user_id_pure(function(){
            that.updateUserInfo();
        });
        // 可能需要重置游戏状态
    }
}

// GameUI将在外部调用初始化

// 导出类（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUI;
}