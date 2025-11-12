class HelperInner{
    static cut(string,length,add_string){
        if(string.length<=length){
            return string;
        }
        if(add_string==null){
            add_string="...";
        }
        return string.substring(0,length)+add_string;
    }
    static getUrlParams(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }
    static resolvePropertyPath(obj, propPath) {

        // 将属性路径拆分为数组
        const props = propPath.split('.');
        let current = obj;

        // 逐级获取属性
        for (const prop of props) {
            if (current === undefined || current === null) {
                return undefined; // 如果中间属性不存在，返回undefined
            }
            current = current[prop];
        }
        if(propPath.match(/splashDamage/))
        {
            console.log(current,"propPath=="+propPath);
        }
        //

        return current;
    }
    static setUrlParam(url,name, value) {
        let urlParams = new URLSearchParams(url.split('?')[1]);
        urlParams.set(name, value);
        // 构建新的 URL
        return url.split('?')[0] + '?' + urlParams.toString();
    }
    static keys(obj) {
        let keys= Object.keys(obj);

        //按照个strToNumByASCII来排序
        keys.sort((a, b) => this.strToNumByASCII(a) - this.strToNumByASCII(b));

        return keys;
    }
    static strToNumByASCII(str) {

        //如果是数字直接返回整数
        if(!isNaN(str))
        {
            return Number.parseFloat(str);
        }

        let num = 0;
        for (let i = 0; i < str.length; i++) {
            // 累加每个字符的 ASCII 码（可根据需要调整计算方式）
            num = num * 100 + str.charCodeAt(i); // 乘以100避免不同字符组合冲突
        }
        return num;
    }
    static fixNumber(n)
    {
        let decimals=4;
        let a= Number.parseFloat(n).toFixed(decimals);

        return Number.parseFloat(a);
    }
    static getDomainWithProtocol() {
        const protocol = window.location.protocol; // 获取当前协议（http 或 https）
        let domain = window.location.hostname; // 获取当前域名
        //端口如果有，也添加到域名
        const port = window.location.port; // 获取当前端口
        if (port) {
            domain += `:${port}`; // 组合端口
        }
        return `${protocol}//${domain}`; // 组合协议和域名
    }
    static copy(text) {
        if(text==null)
        {
            ui.showToast(t("copy_failed"));
            return;
        }

        // 创建一个 textarea 元素
        const textarea = document.createElement('textarea');
        textarea.value = text;

        // 防止页面滚动
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';

        // 添加到页面
        document.body.appendChild(textarea);

        // 选中内容
        textarea.select();
        textarea.setSelectionRange(0, text.length); // 兼容移动端

        // 执行复制命令
        const successful = document.execCommand('copy');

        // 删除临时元素
        document.body.removeChild(textarea);

        if (successful) {
            ui.showToast(t("copy_success"));
            console.log('复制成功:', text);
        } else {
            console.error('复制失败，请手动复制');
        }
    }
}
function fix(n)
{
    return Helper.fixNumber(n);
}
