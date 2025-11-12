// (function($) {
class login
{
    static get_lang()
    {
        return this.lang;
    }
}
class Storage
{
    constructor()
    {

    }
    static setItem(key, value)
    {
        if(typeof(value)=="object" || typeof(value)=="array")
        {
            value=JSON.stringify(value);
        }

        localStorage.setItem(key, value);
    }
    static removeItem(key)
    {
        localStorage.removeItem(key);
    }
    static getItem(key)
    {
        let value= localStorage.getItem(key);

        if(value && typeof(value)=="string"&&value.trim().match(/^[\{\[]+/))
        {
            let json=JSON.parse(value);
            if(json)
            {
                value=json;
            }
        }

        return value;
    }
}


    var languages = {
        zh: {
            title: '选择登录方式',
            loginBtn: '登录',
            guestBtn: '游客身份游戏',
            emailLabel: '邮箱：',
            sendBtn: '发送验证码',
            sending: '发送中...',
            resent: '重新发送',
            codeLabel: '验证码：',
            loginBtn2: '登录',
            nicknameLabel: '昵称：',
            setBtn: '设置',
            setNicknameT: '设置昵称',
            verifySent: '验证码已发送',
            enterEmail: '请输入邮箱',
            enterCode: '请输入验证码',
            enterNickname: '请输入昵称',
            setSuccess: '设置成功',
            error: '错误',
            chooseMode: '选择游戏模式',
            friendBattle: '和朋友对战',
            netMatch: '匹配全网玩家',
            singlePlayer: '单人模式'
        },
        en: {
            title: 'Choose Login Method',
            loginBtn: 'Login',
            guestBtn: 'Play as Guest',
            emailLabel: 'Email:',
            sendBtn: 'Send Verification Code',
            sending: 'Sending...',
            resent: 'Resend',
            codeLabel: 'Verification Code:',
            loginBtn2: 'Login',
            nicknameLabel: 'Nickname:',
            setBtn: 'Set',
            verifySent: 'Verification code sent',
            enterEmail: 'Please enter email',
            enterCode: 'Please enter verification code',
            enterNickname: 'Please enter nickname',
            setSuccess: 'Success',
            error: 'Error',
            chooseMode: 'Choose Game Mode',
            friendBattle: 'Battle with Friend',
            netMatch: 'Match Online Players',
            singlePlayer: 'Single Player'
        }
    };

    window.check_not_null=function(value,comment)
    {
        if(typeof value==='object')
        {
            return false;
        }

        if(value==null||value==''||value==0 || (typeof (value)!='string' && isNaN(value)))
        {
            console.error(comment);
        }
    }
    window.getUrlParams=function(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }
    login.lang =getUrlParams("lang")||"en";

    // if(login.lang)
    // {
    //     current_lang=login.lang;
    // }
    window.pre_start_game=function(friend_work,net_work,single_work)
    {
        show_pre_start_modal(friend_work,net_work,single_work);
    }
    window.setUrlParam=function(url,name, value) {
        let urlParams = new URLSearchParams(url.split('?')[1]);
        urlParams.set(name, value);
        return url.split('?')[0] + '?' + urlParams.toString();

    }
    function show_pre_start_modal(friend_work,net_work,single_work) {
        var l = languages[login.lang];
        var has_passed_single_work = single_work?true:false;
        var options = [];

        options.push( {text: l.netMatch},{text: l.friendBattle});
        if (has_passed_single_work) {
            options.push({text: l.singlePlayer});
        }
        ui.showOptionsPanel(l.chooseMode, '', options, function(result) {
            if (result.text === l.singlePlayer) {
                window.selected_game_mode = 'single';
                single_work();
                return true;
            } else if (result.text === l.friendBattle) {
                window.selected_game_mode = 'friend';
                friend_work();
                return true;
            } else if (result.text === l.netMatch) {
                window.selected_game_mode = 'net';
                net_work();
                return true;
            } else if (result.text === 'cancel') {
                return true;
            }
        });
    }


    window.getUserId=function()
    {
        return login.userId;
    }
    window.setUserData=function(userData)
    {
        login.userData=userData;
    }
    window.getUserData=function(pro)
    {
        if(pro==null)
        {
            return login.userData;
        }
        else{
            return login.userData?login.userData[pro]:null;
        }

    }
    window.setUserId=function(userId)
    {
        login.userId=userId;
    }
    window.getUserInfo=function()
    {
        let userInfo= Storage.getItem("user_info");
        if(typeof(userInfo)=="object")
        {

        }
        else if(userInfo && typeof(userInfo)=="string" && userInfo.trim().match(/^\{/))
        {
            try{
                userInfo=JSON.parse(userInfo);
                console.log(userInfo,"userInfo123123123_real");
            }
            catch (error) {
                console.error("Error parsing user_info cookie:", error);
                userInfo = null;
            }

        }
        else{
            userInfo=null;
        }
        return userInfo;
    }
    window.setUserInfo=function(userInfo)
    {
        console.log(userInfo,"userInfo123123");
        Storage.setItem("user_info", JSON.stringify(userInfo));
    }
    window.getUserRid=function()
    {
        let userInfo=window.getUserInfo();
        console.log(userInfo,"userInfo123123ss");
        if(userInfo)
        {
            let user_work_rid= userInfo.user_work_rid;
            return user_work_rid;
        }
        else{
            return null;
        }
    }
    window.logout=function(fun)
    {
        query_work.query("login",{ident:get_ident(),action:"logout"}, function (data2){
            if(data2.success)
            {
                ui.showToast(t_inner("logout_success"));
            }
        });

        // $.removeCookie('ident_now', { path: '/' });
        // $.removeCookie('user_info',{ path: '/' });

        Storage.removeItem("user_info");

        Storage.removeItem("ident_now");

        setUserId(null);
        if(GameUI && GameUI.gameUi)
        {
            GameUI.gameUi.react();
        }
        if(login.refresh)
        {
            login.refresh();
        }
        if(fun)
        {
            fun();
        }
        // get_user_id();

        window.location.reload();
    }
    window.get_ident=function ()
    {
        let ident = Storage.getItem("ident_now");
        return ident;
    }
    window.set_ident=function(ident)
    {
        Storage.setItem("ident_now", ident);
    }
    // window.query_game_pay=function(state_update_array,spend_game_jifen,fun)
    // {
    //     let game_id =get_game_id();
    //     console.log(game_id,"game_id123123aaa");
    //     let ident=get_ident();
    //     console.log(ident, "ident123123123");
    //     query_work.query('game_pay', {state_update_array: state_update_array,
    //         spend_game_jifen:spend_game_jifen,
    //         ident: ident,game_id:game_id}, function (data2){
    //             if(fun)
    //             {
    //                 fun(data2);
    //             }
    //     });
    // };
    // window.query_game_data=function(fun)
    // {
    //     let game_id =get_game_id();
    //     console.log(game_id,"game_id123123aaa");
    //     let ident=get_ident();
    //     console.log(ident, "ident123123123");
    //     query_work.query('game_data', {
    //         ident: ident,game_id:game_id}, function (data2){
    //         if(fun)
    //         {
    //             fun(data2);
    //         }
    //     });
    // };
    window.get_game_id=function()
    {
        let urlParams = new URLSearchParams(window.location.search);
        let game_id = urlParams.get('game_id');
        if(login.gameId)
        {
            game_id=login.gameId;
        }

        return game_id;
    }
    window.get_user_info=function(callback){
        let ident=get_ident();
        let game_id=get_game_id();
        query_work.query('login', {action: 'get_user_info', ident: ident,game_id:game_id}, function (data2) {

            console.log(data2,"data2123aaaaa");
            check_not_null(data2.game_user_id,"game_user_id");
            console.log(data2.game_user_id,"set_game_user_id");
            if(data2.game_user_id)
            {
                setUserId(data2.game_user_id);
            }
            // setUserId(data2.game_user_id);
            setUserData(data2);
            console.log("user_info123123123123");
            setUserInfo(data2);

            let userRid=getUserRid();
            if(callback)
            {
                callback(data2);
            }
        },false);
    };
    window.get_user_id_pure = function (callback) {
        console.log(11,"get_user_id123123");
        // let urlParams = new URLSearchParams(window.location.search);
        let game_id =get_game_id();

        console.log(game_id,"game_id123123aaa");
        let ident=get_ident();
        console.log(ident, "ident123123123");

        if (ident) {
            query_work.query('login',
                {action: 'check_ident',

                    ident: ident,
                    game_id:game_id
                }, function (data) {

                console.log(1,"check_ident123123");

                    if (data.valid) {
                        get_user_info(callback);
                    } else {

                        // $.removeCookie('ident_now', { path: '/' });
                        Storage.removeItem("ident_now");
                        callback();
                    }
                });
        } else {
            callback();
        }
    }
    window.get_user_id = function (callback) {
        console.log(11,"get_user_id123123");
        // let urlParams = new URLSearchParams(window.location.search);
        let game_id =get_game_id();

        console.log(game_id,"game_id123123aaabb");
        let ident=get_ident();
        console.log(ident, "ident123123123bbbb");
        if (ident) {
            query_work.query('login',
                {action: 'check_ident',

                ident: ident,
                    game_id:game_id
                }, function (data) {
                if (data.valid) {
                    console.log(data.valid, "valid123123123");
                    query_work.query('login', {action: 'get_user_info', ident: ident,game_id:game_id}, function (data2) {
                        console.log(data2,"data2123aaaaa");
                        check_not_null(data2.game_user_id,"game_user_id");
                        console.log(data2.game_user_id,"set_game_user_id");



                        setUserId(data2.game_user_id);
                        setUserData(data2);

                        Storage.setItem("user_info", {
                                game_user_id:data2.game_user_id
                            }
                        );

                        if(login.refresh)
                        {
                            login.refresh(data2);
                        }
                        if(callback)
                        {
                            callback(data2);
                        }
                    },false);
                } else {
                    // $.removeCookie('ident_now', { path: '/' });
                    Storage.removeItem("ident_now");
                        show_login_modal(callback);


                }
            });
        } else {
            show_login_modal(callback);
        }
    }
    // <button id="close-choice-modal"
    //         style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 24px; color: #999; cursor: pointer;">×</button>

    function show_login_modal(callback) {
        var l = languages[login.lang];
        let guest= {text: l.guestBtn};
        let list=[{text: l.loginBtn},guest];
        if(login.hide_guest)
        {
            list=[{text: l.loginBtn}];
        }
        ui.showOptionsPanel(l.title, '', list, function(result) {
            console.log(result,"result123123");
            if (result.text === l.loginBtn) {
                show_login_form_modal(callback);
                return true;
            } else if (result.text === l.guestBtn) {
                query_work.query('login', {action: 'guest'}, function (data) {
                    console.log(data,"data123123123");
                    console.log(callback,"callback123123123");
                    // $.cookie('ident_now', data.ident, { expires: 36500, path: '/' });

                    Storage.setItem("ident_now", data.ident);

                    console.log(data.game_user_id,"data.game_user_id123123123");
                    setUserId(data.game_user_id);
                    setUserData(data);
                    // callback(data);
                    GameUI.gameUi.react();
                    callback(data);
                });
                return true;
            } else if (result.text === 'cancel') {
                return true;
            }
        });
    };

    window.  clearAll=function () {
        // 获取当前域名
        const hostname = window.location.hostname;

        // 获取所有 Cookie 名称
        const cookies = document.cookie.split(';');

        cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();

            if (cookieName) {
                // 删除当前域名下所有路径的 Cookie
                this._removeAllPaths(cookieName, '');

                // 如果是子域名（如 www.example.com），也尝试删除主域名的 Cookie
                if (hostname.split('.').length > 2) {
                    const mainDomain = '.' + hostname.split('.').slice(-2).join('.');
                    this._removeAllPaths(cookieName, mainDomain);
                }
            }
        });

        console.log(`已清除域名 ${hostname} 下所有 Cookie`);
    }

    function get_share_code()
    {
        return HelperInner.getUrlParams("c");
    }
    // clearAll();
    function show_login_form_modal(callback) {
        var l = languages[login.lang];
        // <button id="close-modal"
        //         style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 24px; color: #999; cursor: pointer;">×</button>
        var modal_html = `
        <div id="login-form-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 40px; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); max-width: 400px; width: 90%; transform: scale(0.9); animation: fadeInScale 0.5s ease-out forwards;">
                <h3 style="margin: 0 0 20px 0; text-align: center; color: #333; font-size: 24px;">${l.loginBtn}</h3>
                <form id="login-form">
                    <div style="margin-bottom: 15px;">
                        <label for="email" style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">${l.emailLabel}</label>
                        <input type="email" id="email" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px;">
                    </div>
                    <button type="button" id="send-code-btn" style="width: 100%; padding: 10px; background: black; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background 0.3s;">${l.sendBtn}</button>
                </form>
               
            </div>
            <style>
                @keyframes fadeInScale {
                    to {
                        transform: scale(1);
                    }
                }
                button:hover:not(:disabled) {
                    background: #666 !important;
                }
            </style>
        </div>
    `;
        $('body').append(modal_html);
        var $modal = $('#login-form-modal');
        $modal.find('#send-code-btn').click(function () {
            var email = $modal.find('#email').val();
            if (!email) {
                ui.showToast(l.enterEmail);
                return;
            }
            $('#send-code-btn').prop('disabled', true).text(l.sending);
            query_work.query('login', {action: 'send_code', email: email}, function (data) {
                if (data.error) {
                    ui.showToast(data.error);
                    $('#send-code-btn').prop('disabled', false).text(l.sendBtn);
                    return;
                }
                $('#send-code-step').remove(); // 清除旧步骤如果有
                var code_step_html = `
                <div id="send-code-step" style="margin-top: 15px;">
                    <div style="margin-bottom: 15px;">
                        <label for="code" style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">${l.codeLabel}</label>
                        <input type="text" id="code" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px;">
                    </div>
                    <button id="login-btn" type="button" style="width: 100%; padding: 10px; background: black; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background 0.3s;">${l.loginBtn2}</button>
                </div>
            `;
                $('#login-form').append(code_step_html);
                $('#login-btn').click(function () {
                    var code = $('#code').val();
                    if (!code) {
                        ui.showToast(l.enterCode);
                        return;
                    }

                    query_work.query('login', {action: 'verify_login', email: email, code: code,
                        game_id:get_game_id(),
                        coinsPerShare:config.coinsPerShare,
                        c:get_share_code()
                    }, function (data) {


                        console.log(data, "login_success");
                        if (data.error) {

                            if(GameUI&&GameUI.gameUi)
                            {
                                GameUI.gameUi.react();
                            }

                            ui.showToast(data.error);
                        } else {



                            console.log(data.ident, "ident123123123");
                            // $.cookie('ident_now', data.ident, { expires: 36500, path: '/' });
                            Storage.setItem("ident_now", data.ident);
                            let ident = get_ident();
                            setUserId(data.game_user_id);
                            setUserData(data);
                            console.log([data.ident,ident], "ident123123123aaa");
                            $modal.remove();

                            if(GameUI&&GameUI.gameUi)
                            {
                                get_user_info(function(){

                                    GameUI.gameUi.react();
                                    callback(data);
                                });
                            }
                            else{
                                callback(data);
                            }
                        }
                    });
                });
                var count = 30;
                var timer = setInterval(function () {
                    count--;
                    $('#send-code-btn').text(`${l.resent} (${count})`);
                    if (count == 0) {
                        clearInterval(timer);
                        $('#send-code-btn').prop('disabled', false).text(l.sendBtn);
                    }
                }, 1000);
                ui.showToast(l.verifySent);
            });
        });
        $modal.find('#close-modal').click(function () {
            $modal.remove();
        });
    };
    // <button id="close-set-modal"
    //         style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 24px; color: #999; cursor: pointer;display:none;">×</button>

    function show_set_nickname_modal() {
        var l = languages[login.lang];
        var modal_html = `
        <div id="set-nickname-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 40px; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); max-width: 400px; width: 90%; transform: scale(0.9); animation: fadeInScale 0.5s ease-out forwards;">
                <h3 style="margin: 0 0 20px 0; text-align: center; color: #333; font-size: 24px;">${l.setNicknameT}</h3>
                <form id="set-nickname-form">
                    <div style="margin-bottom: 15px;">
                        <label for="set-nickname-input" style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">${l.nicknameLabel}</label>
                        <input type="text" id="set-nickname-input" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px;">
                    </div>
                    <button type="submit" style="width: 100%; padding: 10px; background: black; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background 0.3s;">${l.setBtn}</button>
                </form>

            </div>
            <style>
                @keyframes fadeInScale {
                    to {
                        transform: scale(1);
                    }
                }
                button:hover:not(:disabled) {
                    background: #666 !important;
                }
            </style>
        </div>
    `;
        $('body').append(modal_html);
        var $modal = $('#set-nickname-modal');
        $modal.find('#set-nickname-form').submit(function (e) {
            e.preventDefault();
            var nickname = $modal.find('#set-nickname-input').val();
            if (!nickname) {
                ui.showToast(l.enterNickname);
                return;
            }
            query_work.query('login', {
                action: 'set_nickname',
                ident:get_ident(),
                nickname: nickname
            }, function (data) {
                if (data.error) {
                    ui.showToast(data.error);
                } else {
                    ui.showToast(l.setSuccess);
                    $modal.remove();
                }
            });
        });
        $modal.find('#close-set-modal').click(function () {
            $modal.remove();
        });
    };
    // window.view_user_info = function (project_id, callback) {
    //     var ident = $.cookie('ident_now');
    //     if (!ident) {
    //         callback(null);
    //         return;
    //     }
    //     query_work.query('login', {action: 'get_user_info', ident: ident, project_id: project_id,
    //         game_id:project_id}, function (data) {
    //         callback(data);
    //         if (data && !data.error && (!data.nickname || data.nickname == '')) {
    //             show_set_nickname_modal();
    //         }
    //     });
    // };
// })(jQuery);
