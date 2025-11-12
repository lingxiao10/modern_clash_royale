// 坐标转换器 - 用于为顶部玩家提供镜像视图
class CoordinateTransformer {
    static start=true;
    constructor() {
    }

    /**
     * 转换Y坐标 - 为顶部玩家翻转Y轴
     * @param {number} y - 原始Y坐标
     * @param {boolean} isTopPlayer - 是否为顶部玩家
     * @returns {number} - 转换后的Y坐标
     */
    static transformY(y, isTopPlayer) {
        let height=GameEngine.gameEngine.GAME_HEIGHT;
        // if(!CoordinateTransformer.start)
        // {
        //     return y;
        // }
        if (isTopPlayer) {
            return height - y;
        }
        return y;
    }


    /**
     * 转换X坐标 - 为顶部玩家翻转X轴（如果需要镜像对称）
     * @param {number} x - 原始X坐标
     * @param {boolean} isTopPlayer - 是否为顶部玩家
     * @returns {number} - 转换后的X坐标
     */
    transformX(x, isTopPlayer) {
        // 目前不需要X轴镜像，保持原样
        return x;
    }
}