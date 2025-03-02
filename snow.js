// 飄雪效果配置
const config = {
    count: 50,          // 雪花數量
    minSize: 2,         // 最小尺寸 (px)
    maxSize: 6,         // 最大尺寸 (px)
    fallSpeed: 1.5,      // 基礎下落速度
    swayRange: 50,      // 水平飄動範圍
    rotation: true,     // 是否旋轉
    color: '#ffffff'    // 雪花顏色
};

// 初始化飄雪
function createSnow() {
    for (let i = 0; i < config.count; i++) {
        const snow = document.createElement('div');
        snow.className = 'snow';
        
        // 隨機初始化屬性
        const size = randomBetween(config.minSize, config.maxSize);
        const startX = randomBetween(0, window.innerWidth);
        const startY = randomBetween(-window.innerHeight, 0);
        const angle = randomBetween(0, 360);
        
        Object.assign(snow.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${startX}px`,
            top: `${startY}px`,
            background: config.color,
            borderRadius: '50%',
            opacity: randomBetween(0.5, 1),
            transform: `rotate(${angle}deg)`
        });

        document.body.appendChild(snow);
        animateSnow(snow);
    }
}

// 雪花動畫
function animateSnow(snow) {
    let x = parseFloat(snow.style.left);
    let y = parseFloat(snow.style.top);
    const sway = randomBetween(-config.swayRange, config.swayRange);
    const spinSpeed = randomBetween(-2, 2);
    const speed = config.fallSpeed * (parseFloat(snow.style.width) / config.maxSize);

    function update() {
        y += speed;
        x += Math.sin(y * 0.02) * (sway * 0.1); // 正弦波模擬自然飄動
        
        if (y > window.innerHeight) {
            // 循環到頂部
            y = -parseFloat(snow.style.height);
            x = randomBetween(0, window.innerWidth);
        }

        Object.assign(snow.style, {
            top: `${y}px`,
            left: `${x}px`,
            transform: `rotate(${config.rotation ? spinSpeed * y : 0}deg)`
        });

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// 隨機數生成
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// 啟動飄雪 + 視窗大小變化重置
window.addEventListener('load', createSnow);
window.addEventListener('resize', () => {
    document.querySelectorAll('.snow').forEach(snow => snow.remove());
    createSnow();
});
