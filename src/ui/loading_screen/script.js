new (class Background {
    constructor() {
        let currentBg = 0;
        const backgrounds = [
            "https://img3.goodfon.com/wallpaper/nbig/7/f0/grand-theft-auto-5-gta-5-v-4k.jpg",
            "https://i.pinimg.com/originals/86/b2/54/86b2543d67abf7d1945a16ea2694c242.jpg",
            "https://libertycity.net/uploads/download/gta5_newobjects/fulls/ngai78eu4dq8pct3tp7an53v91/15210337351268_8bb164-gta5_2018_03_11_21_48_41_798.jpg",
            "https://wallup.net/wp-content/uploads/2016/05/27/226763-Grand_Theft_Auto_V.jpg",
            "https://steamuserimages-a.akamaihd.net/ugc/1666853488464316494/A3BE3989F12E1038E3CDAD7A1157F164B4492B6D/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
        ];

        setInterval(() => {
            document.querySelector("body").style.backgroundImage = `url('${backgrounds[currentBg]}')`;
            currentBg += 1;

            if (currentBg === backgrounds.length) {
                currentBg = 0;
            }
        }, 10 * 1000);
    }
})();

new (class ProgressLoader {
    constructor() {
        let count = 0;
        let thisCount = 0;
        const message = {
            INIT_BEFORE_MAP_LOADED: "Setting Up Game",
            INIT_AFTER_MAP_LOADED: "Initializing Game",
            INIT_SESSION: "Initializing Session",
        };

        const handlers = {
            startInitFunctionOrder: (data) => {
                count = data.count;
                document.querySelector(".progress-text").innerHTML = message[data.type] || data.type;
            },

            startDataFileEntries: (data) => {
                count = data.count;
            },

            initFunctionInvoking: (data) => {
                document.querySelector(".progress-bar-filled").style.width = (data.idx / count) * 100 + "%";
            },

            performMapLoadFunction: (data) => {
                ++thisCount;
                document.querySelector(".progress-bar-filled").style.width = (thisCount / count) * 100 + "%";
            },

            onLogLine: (data) => {
                document.querySelector(".progress-text").innerHTML = data.message + "..!";
            },
        };

        window.addEventListener("message", (e) => {
            const handler = handlers[e.data.eventName];

            if (handler) {
                handler(e.data);
            }
        });
    }
})();
