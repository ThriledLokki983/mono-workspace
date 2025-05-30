import { Express, Request, Response, Router } from "express";
import { BasePlugin } from "@mono/be-core";
import { ApiResponse } from "@mono/be-types";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export class UserPlugin extends BasePlugin {
  readonly name = "UserPlugin";
  readonly version = "1.0.0";

  private users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      createdAt: new Date(),
    },
  ];

  constructor() {
    super();
  }

  protected setup(_config: any): void {
    console.log(`[${this.name}] Setting up plugin...`);
  }

  protected override registerRoutes(app: Express): void {
    const router = Router();

    // GET /api/users - Get all users
    router.get("/", (_req: Request, res: Response) => {
      const response: ApiResponse<User[]> = {
        success: true,
        message: "Users retrieved successfully",
        data: this.users,
        statusCode: 200,
      };
      res.json(response);
    });

    // GET /api/users/:id - Get user by ID
    router.get("/:id", (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const user = this.users.find((u) => u.id === id);

      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          message: "User not found",
          data: null,
          statusCode: 404,
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<User> = {
        success: true,
        message: "User retrieved successfully",
        data: user,
        statusCode: 200,
      };
      return res.json(response);
    });

    // POST /api/users - Create new user
    router.post("/", (req: Request, res: Response) => {
      const { name, email } = req.body;

      if (!name || !email) {
        const response: ApiResponse<null> = {
          success: false,
          message: "Name and email are required",
          data: null,
          statusCode: 400,
        };
        return res.status(400).json(response);
      }

      const newUser: User = {
        id: Math.max(...this.users.map((u) => u.id)) + 1,
        name,
        email,
        createdAt: new Date(),
      };

      this.users.push(newUser);

      const response: ApiResponse<User> = {
        success: true,
        message: "User created successfully",
        data: newUser,
        statusCode: 201,
      };
      return res.status(201).json(response);
    });

    // Mount the router
    app.use("/api/users", router);
  }

  protected override registerMiddleware(_app: Express): void {
    // BaseApp already provides JSON parsing middleware globally
    // No additional middleware needed for this plugin
    console.log(`[${this.name}] Middleware registered`);
  }
}
