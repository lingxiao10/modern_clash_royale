class TransInner {

    static this = null;


    static t(key) {
        if(this.lan==null)
        {
            let urlParams = new URLSearchParams(window.location.search);
            this.lan = urlParams.get('lang') || 'en';
            if(login.get_lang&&login.get_lang())
            {
                this.lan=login.get_lang();
            }
        }

        const dict = this.translations[this.lan] || TransInner.translations['en'];
        return dict[key] || key;
    }

    static translations = {
        'zh': {
            'shareLinkCopied': '分享链接已复制',
            'showGameInstruction': '游戏说明',
            "playAgainTimeout":"对方没有同意续战",
            'openSoundEffect': '打开音效',
            "closeSoundEffect":"关闭音效",
            'confirm': '确认',
            'cancel': '取消',
            'ok': '确定',
            'waitingFriend': '等待朋友加入...',
            'confirmJoinRoom': '是否加入房间 {roomid}?',
            'canceledJoinRoom': '已取消加入房间',
            'waitingForPlayAgain': '等待再来一局...',
            'matching': '匹配中...',
            'opponentDisconnected': '对手已断开连接，请等待',
            'slogan': '指挥您的军队，争夺胜利！',
            'playerInfo': '玩家等级：{level}级，总分（{score}）',
            'startGame': '开始游戏',
            'home': '游戏首页',
            'logout': '退出登录',
            'testArea': '开发者测试区域',
            'exitGame': '退出游戏',
            'testWin': '测试胜利',
            'loginFailed': '无法进行登录操作',
            'roomCreationFailed': '创建房间失败',
            'shareCopied': '已复制对战链接，请分享给你的朋友',
            'shareFailed': '连接复制失败',
            'gameStarted': '游戏开始！',
            'confirmLogout': '确认退出登录吗？',
            'confirmExitGame': '确认退出游戏吗？',
            'exitSuccess': '退出成功',
            'connectionNotEstablished': '连接未建立，无法测试退出',
            'confirmTestWin': '测试：确认测试胜利吗？',
            'testWinAlert': '测试胜利',
            "createGameAlert":"请访问微信小程序：飞写AI 游戏生成器",
            'userIdNotFound': '用户ID未找到，无法测试胜利',
            'gameEngineNotStarted': '游戏引擎未启动，无法测试胜利',
            'returnToHome': '返回游戏首页',
            'makeNewGame': '我也要做一个游戏',
            'createGame': '创建游戏',
            'continueFight': '续战',
            'menu': '菜单',
            'gameMenu': '游戏菜单',
            'exitToMenu': '退出游戏',
            'confirmExitToMenu': '确定要退出游戏吗？这将结束当前房间并通知对手。',
            'gameOverWin': '🎉 胜利！🎉',
            'gameOverLose': '😢 失败 😢',
            'confirmExit': '退出游戏吗？',
            'waiting': '等待中...',
            "repeatUser": "您不能接受自己的邀请",
            'waitingForFriend': '等待朋友...',

            'pleaseLoginFirst': '您现在是以访客身份登录，请登出，然后用邮箱登录后操作',
            "logout_success":"退出登录成功",
            'customerService': '客服',
            'copyEmail': '复制邮箱',
            'copyWechat': '复制微信',
            'copyPhone': '复制电话',
            'dialPhone': '拨打电话',
            'emailCopied': '邮箱已复制到剪贴板',
            'wechatCopied': '微信已复制到剪贴板',
            'phoneCopied': '电话号码已复制到剪贴板',
            'customerServiceUnavailable': '客服信息不可用',
            // 添加更多如果需要
        },
        'en': {
            'shareLinkCopied': 'Share link copied',
            "createGameAlert":"Please visit the WeChat mini program: 飞写AI 游戏生成器",
            "playAgainTimeout":"Opponent did not agree to continue the fight",
            'openSoundEffect': 'Open Sound Effect',
            "closeSoundEffect":"Close Sound Effect",
            'confirm': 'Confirm',
            'cancel': 'Cancel',
            'ok': 'OK',
            'waitingFriend': 'Waiting for friend...',
            'confirmJoinRoom': 'Join room {roomid}?',
            'canceledJoinRoom': 'Join room canceled',
            'waitingForPlayAgain': 'Waiting for play again...',
            'matching': 'Matching...',
            'opponentDisconnected': 'Opponent disconnected, please wait',
            'slogan': 'Command your army and fight for victory!',
            'playerInfo': 'Player Level: {level}, Total Score: ({score})',
            'startGame': 'Start Game',
            'home': 'Game Home',
            'logout': 'Logout',
            "createGame":"Create Game",
            'testArea': 'Developer Test Area',
            'exitGame': 'Exit Game',
            'testWin': 'Test Win',
            'loginFailed': 'Unable to perform login operation',
            'roomCreationFailed': 'Failed to create room',
            'shareCopied': 'Battle link copied, please share with your friends',
            'shareFailed': 'Failed to copy link',
            'gameStarted': 'Game Started!',
            'confirmLogout': 'Confirm logout?',
            'exitSuccess': 'Exit successful',
            'testWinAlert': 'Test Win',
            'returnToHome': 'Return to Game Home',
            'makeNewGame': 'I want to make a game too',
            'continueFight': 'Play Again',
            'menu': 'Menu',
            'gameMenu': 'Game Menu',
            'exitToMenu': 'Exit Game',
            'confirmExitToMenu': 'Are you sure to exit the game? This will end the current room and notify your opponent.',
            'gameOverWin': '🎉 Victory! 🎉',
            'gameOverLose': '😢 Defeat 😢',
            'confirmExit': 'Exit game?',
            'waiting': 'Waiting...',
            "repeatUser": "You can't accept your own invitation",
            'waitingForFriend': 'Waiting for friend...',
            'confirmExitGame': 'Confirm exit game?',
            'connectionNotEstablished': 'Connection not established, cannot exit',
            'confirmTestWin': 'Test: Confirm test win?',
            'userIdNotFound': 'User ID not found',
            'gameEngineNotStarted': 'Game engine not running',
            'pleaseLoginFirst': 'You are logining as Guest, please logout and then login with Email First',
            'showGameInstruction': 'Game Instruction',
            "logout_success":"Logout success",
            'customerService': 'Customer Service',
            'copyEmail': 'Copy Email',
            'copyWechat': 'Copy Wechat',
            'copyPhone': 'Copy Phone',
            'dialPhone': 'Dial Phone',
            'emailCopied': 'Email copied to clipboard',
            'wechatCopied': 'Wechat copied to clipboard',
            'phoneCopied': 'Phone copied to clipboard',
            'customerServiceUnavailable': 'Customer service unavailable',
            // 添加更多如果需要
        }
    };
}

function t_inner(key) {
    return TransInner.t(key);
}