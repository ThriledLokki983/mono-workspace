"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlugin = void 0;
var express_1 = require("express");
var express_2 = require("express");
var be_core_1 = require("@mono-workspace/be-core");
var UserPlugin = /** @class */ (function (_super) {
    __extends(UserPlugin, _super);
    function UserPlugin() {
        var _this = _super.call(this) || this;
        _this.name = "UserPlugin";
        _this.version = "1.0.0";
        _this.users = [
            { id: 1, name: "John Doe", email: "john@example.com", createdAt: new Date() },
            { id: 2, name: "Jane Smith", email: "jane@example.com", createdAt: new Date() },
        ];
        return _this;
    }
    UserPlugin.prototype.registerRoutes = function (app) {
        var _this = this;
        var router = (0, express_1.Router)();
        // GET /api/users - Get all users
        router.get("/", function (req, res) {
            var response = {
                success: true,
                message: "Users retrieved successfully",
                data: _this.users,
                statusCode: 200,
            };
            res.json(response);
        });
        // GET /api/users/:id - Get user by ID
        router.get("/:id", function (req, res) {
            var id = parseInt(req.params.id);
            var user = _this.users.find(function (u) { return u.id === id; });
            if (!user) {
                var response_1 = {
                    success: false,
                    message: "User not found",
                    data: null,
                    statusCode: 404,
                };
                return res.status(404).json(response_1);
            }
            var response = {
                success: true,
                message: "User retrieved successfully",
                data: user,
                statusCode: 200,
            };
            res.json(response);
        });
        // POST /api/users - Create new user
        router.post("/", function (req, res) {
            var _a = req.body, name = _a.name, email = _a.email;
            if (!name || !email) {
                var response_2 = {
                    success: false,
                    message: "Name and email are required",
                    data: null,
                    statusCode: 400,
                };
                return res.status(400).json(response_2);
            }
            var newUser = {
                id: Math.max.apply(Math, _this.users.map(function (u) { return u.id; })) + 1,
                name: name,
                email: email,
                createdAt: new Date(),
            };
            _this.users.push(newUser);
            var response = {
                success: true,
                message: "User created successfully",
                data: newUser,
                statusCode: 201,
            };
            res.status(201).json(response);
        });
        // Mount the router
        app.use("/api/users", router);
    };
    UserPlugin.prototype.registerMiddleware = function (app) {
        // Add JSON parsing middleware for this plugin's routes
        app.use("/api/users", express_2.default.json());
        console.log("[".concat(this.name, "] Middleware registered"));
    };
    return UserPlugin;
}(be_core_1.BasePlugin));
exports.UserPlugin = UserPlugin;
