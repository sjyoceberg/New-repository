  const shell = document.getElementById("shell");
        //报错准备
        if (!shell) {
            throw new Error("找不到 id 为 shell 的时间轴容器。");
        }
        //储存
        const items = Array.from(shell.querySelectorAll(".item"));
        if (items.length === 0) {
            throw new Error("时间轴容器中没有 .item 条目。");
        }
        const activeClass = "item--active";
        function setBackground(item) {
            const image = item.querySelector(".img");
            if (!image) {
                throw new Error("时间轴条目中缺少 .img 图片元素。");
            }
            const imageSource = image.getAttribute("src");
            if (!imageSource) {
                throw new Error("时间轴图片缺少 src 路径。");
            }
            shell.style.backgroundImage = `url("${imageSource}")`;
        }
        function activateItem(activeItem) {
            items.forEach((item) => {
                item.classList.remove(activeClass);
            });
            activeItem.classList.add(activeClass);
        }

        // 初始设置
        activateItem(items[0]);
        setBackground(items[0]);

        // 更换背景图
        function updateTimeline() {
            // 滚动距离。
            const scrollPosition = window.scrollY;
            items.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();

                // 页面坐标
                const min = itemRect.top + scrollPosition - window.innerHeight * 0.2;

                //获取信息
                const itemStyle = window.getComputedStyle(item);
                const contentHeight =
                    itemRect.height -
                    parseFloat(itemStyle.paddingTop) -
                    parseFloat(itemStyle.paddingBottom);
                const max = min + contentHeight;

                // 倒数二
                if (
                    index === items.length - 2 &&
                    scrollPosition > min + contentHeight / 2
                ) {
                    // 最后一张图
                    activateItem(items[items.length - 1]);
                    setBackground(items[items.length - 1]);
                }
                //换图片    
                else if (scrollPosition <= max && scrollPosition >= min) {
                    activateItem(item);
                    setBackground(item);
                }
            });
        }
        // 更新时间
        window.addEventListener("scroll", updateTimeline);