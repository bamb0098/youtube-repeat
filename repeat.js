;let repeater = (function(){
    class repeatInfo {
        start = false;
        end = false;
        repeat = true;
    }
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    let slider = `
    <div class="middle"> <div class="multi-range-slider"> <!-- 진짜 슬라이더 --> <input type="range" id="input-left" /> <input type="range" id="input-right" /> <!-- 커스텀 슬라이더 --> <div class="slider"> <div class="track"></div> <div class="range"></div> <div class="thumb left"></div> <div class="thumb right"></div> </div> </div> </div>
    `;
    let sliderElement = htmlToElement(slider);
    document.body.append(sliderElement)
    const inputLeft = document.getElementById("input-left");
    const inputRight = document.getElementById("input-right");
    const thumbLeft = document.querySelector(".slider > .thumb.left");
    const thumbRight = document.querySelector(".slider > .thumb.right");
    const range = document.querySelector(".slider > .range");
    const video = document.querySelector('.html5-main-video');
    
    const setLeftValue = () => {
        const _this = inputLeft;
        const [min, max] = [parseInt(_this.min), parseInt(_this.max)];
        // 교차되지 않게, 1을 빼준 건 완전히 겹치기보다는 어느 정도 간격을 남겨두기 위해. 
        _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
        // input, thumb 같이 움직이도록 
        const percent = ((_this.value - min) / (max - min)) * 100;
        thumbLeft.style.left = percent + "%";
        range.style.left = percent + "%";
    };
    const setRightValue = () => {
        const _this = inputRight;
        const [min, max] = [parseInt(_this.min), parseInt(_this.max)];
        // 교차되지 않게, 1을 더해준 건 완전히 겹치기보다는 어느 정도 간격을 남겨두기 위해. 
        _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
        // input, thumb 같이 움직이도록 
        const percent = ((_this.value - min) / (max - min)) * 100;
        thumbRight.style.right = 100 - percent + "%";
        range.style.right = 100 - percent + "%";
    };

    let init = (res)=>{
        let data = res["data"];
        data ||= {};
        let code = location.search.match(/\?v=.+(&|$)/g)[0].replace(/[v?&\=]/g, '');
        let cur = data[code] || new repeatInfo();
        
        let infoElement = document.querySelector('ytd-video-primary-info-renderer');

        sliderElement.style.width = infoElement.getBoundingClientRect().width + "px";
        sliderElement.style.left = infoElement.getBoundingClientRect().x + "px";
        sliderElement.style.top = infoElement.getBoundingClientRect().y + "px";

        [inputLeft.min, inputLeft.max] = [0, video.duration];
        [inputRight.min, inputRight.max] = [0, video.duration];
        [inputLeft.value, inputRight.value] = [cur.start || 0, cur.end || video.duration];

        function update() {
            let info = new repeatInfo();
            info.start = inputLeft.value;
            info.end = inputRight.value;
            data[code] = info;

            chrome.storage.sync.set({ "data": data }, () => {
                setTimeout(update, 5000);
            })
        };
        update();
        setLeftValue();
        setRightValue();

        inputLeft.addEventListener("input", setLeftValue);
        inputRight.addEventListener("input", setRightValue);

        window.addEventListener('resize', function(e) {
            setTimeout(() => {
                let infoElement = document.querySelector('ytd-video-primary-info-renderer');
                sliderElement.style.width = infoElement.getBoundingClientRect().width + "px";
                sliderElement.style.left = infoElement.getBoundingClientRect().x + "px";
                sliderElement.style.top = infoElement.getBoundingClientRect().y + "px";
            }, 500)
        }, false);

        video.addEventListener('timeupdate', function(e) {
            var currentPos = video.currentTime;

            if (currentPos >= inputRight.value) {
                video.currentTime = inputLeft.value
            }
        })
    }

    return {
        init : init
    }
})();


function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}



chrome.storage.sync.get(["data"], (res) => {
    ready(() => {
        repeater.init(res);
    })
})