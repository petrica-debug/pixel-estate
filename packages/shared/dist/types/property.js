"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyStatus = exports.PropertyType = void 0;
var PropertyType;
(function (PropertyType) {
    PropertyType["APARTMENT"] = "APARTMENT";
    PropertyType["VILLA"] = "VILLA";
    PropertyType["TOWNHOUSE"] = "TOWNHOUSE";
    PropertyType["PENTHOUSE"] = "PENTHOUSE";
    PropertyType["COMMERCIAL"] = "COMMERCIAL";
    PropertyType["HOTEL_UNIT"] = "HOTEL_UNIT";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["UPCOMING"] = "UPCOMING";
    PropertyStatus["ACTIVE"] = "ACTIVE";
    PropertyStatus["FULLY_MINTED"] = "FULLY_MINTED";
    PropertyStatus["RENTING"] = "RENTING";
    PropertyStatus["SALE_PROPOSED"] = "SALE_PROPOSED";
    PropertyStatus["SOLD"] = "SOLD";
    PropertyStatus["PAUSED"] = "PAUSED";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
