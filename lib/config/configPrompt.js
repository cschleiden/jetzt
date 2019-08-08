"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prompts_1 = __importDefault(require("prompts"));
var config_1 = require("../config");
function required(value) {
    return (value && value.length > 0) || false;
}
var flow = [
    {
        type: "confirm",
        name: "create",
        message: "Do you want to create a jetzt.config.js?",
        initial: true
    },
    {
        type: "text",
        name: "subscriptionId",
        message: "Enter your Azure Subscription ID (e.g, 2e54024b-0b4b-4f57-93cd-089da3a2a8fd)",
        validate: required
    },
    {
        type: "text",
        name: "resourceGroup",
        message: "Enter the name of the resource group (e.g., nextjs-group)",
        validate: required
    },
    {
        type: "text",
        name: "location",
        message: "Enter the Azure location you would like to host your application in (e.g., westeurope)",
        validate: required
    },
    {
        type: "text",
        name: "name",
        message: "Enter the name of your function app (e.g., nextjs-function-app)",
        validate: required
    },
    {
        type: "text",
        name: "account",
        message: "Enter the name of the storage account that will be used to host all assets (e.g., nextjsfunctionstorage)",
        validate: required
    }
];
function configPrompt(sourcePath) {
    return __awaiter(this, void 0, void 0, function () {
        var canceled, response, rawConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canceled = false;
                    return [4 /*yield*/, prompts_1.default(flow, {
                            onSubmit: function (prompt, answer, answers) {
                                if (prompt.name === "create" && answer !== true) {
                                    // Return true to cancel
                                    return true;
                                }
                            },
                            onCancel: function () { return (canceled = true); }
                        })];
                case 1:
                    response = _a.sent();
                    if (canceled) {
                        return [2 /*return*/];
                    }
                    rawConfig = {
                        functionApp: {
                            subscriptionId: response["subscriptionId"],
                            location: response["location"],
                            name: response["name"],
                            resourceGroup: response["resourceGroup"]
                        },
                        storage: {
                            account: response["account"]
                        }
                    };
                    return [4 /*yield*/, config_1.JetztConfig.write(sourcePath, rawConfig)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, new config_1.JetztConfig(sourcePath, rawConfig)];
            }
        });
    });
}
exports.configPrompt = configPrompt;
//# sourceMappingURL=configPrompt.js.map