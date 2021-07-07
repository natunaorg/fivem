"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
/**
 * List of weather types. Used for manipulating weather.
 */
var Weather;
(function (Weather) {
    Weather[Weather["Unknown"] = -1] = "Unknown";
    Weather[Weather["ExtraSunny"] = 0] = "ExtraSunny";
    Weather[Weather["Clear"] = 1] = "Clear";
    Weather[Weather["Clouds"] = 2] = "Clouds";
    Weather[Weather["Smog"] = 3] = "Smog";
    Weather[Weather["Foggy"] = 4] = "Foggy";
    Weather[Weather["Overcast"] = 5] = "Overcast";
    Weather[Weather["Raining"] = 6] = "Raining";
    Weather[Weather["ThunderStorm"] = 7] = "ThunderStorm";
    Weather[Weather["Clearing"] = 8] = "Clearing";
    Weather[Weather["Neutral"] = 9] = "Neutral";
    Weather[Weather["Snowing"] = 10] = "Snowing";
    Weather[Weather["Blizzard"] = 11] = "Blizzard";
    Weather[Weather["Snowlight"] = 12] = "Snowlight";
    Weather[Weather["Christmas"] = 13] = "Christmas";
    Weather[Weather["Halloween"] = 14] = "Halloween";
})(Weather = exports.Weather || (exports.Weather = {}));
