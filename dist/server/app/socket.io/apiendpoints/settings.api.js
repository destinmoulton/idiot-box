"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IBDB_1 = __importDefault(require("../../db/IBDB"));
const SettingsModel_1 = __importDefault(require("../../models/db/SettingsModel"));
const settingsModel = new SettingsModel_1.default(IBDB_1.default);
const settings = {
    all: {
        get: {
            params: [],
            func: async () => await settingsModel.getAll(),
        },
    },
    category: {
        get: {
            params: ["category"],
            func: async (category) => {
                return await settingsModel.getAllForCategory(category);
            },
        },
    },
    editor: {
        add: {
            params: ["category", "key", "value"],
            func: async (category, key, value) => {
                return await settingsModel.addSetting(category, key, value);
            },
        },
        update: {
            params: ["id", "category", "key", "value"],
            func: async (id, category, key, value) => {
                return await settingsModel.updateSetting(id, category, key, value);
            },
        },
        delete: {
            params: ["id"],
            func: async (id) => await settingsModel.deleteSetting(id),
        },
    },
};
exports.default = settings;
//# sourceMappingURL=settings.api.js.map