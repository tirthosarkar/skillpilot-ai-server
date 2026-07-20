import { Response } from "express";
import * as aiService from "../services/aiService";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";
import { AuthRequest } from "../types";

// POST /api/roadmap/generate
export const generateRoadmap = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { targetRole, currentSkills } = req.body as {
      targetRole: string;
      currentSkills: string[];
    };

    const roadmap = await aiService.generateAndSaveRoadmap(
      req.user!.id,
      targetRole,
      currentSkills
    );

    sendResponse(res, 201, roadmap, "Roadmap generated successfully");
  }
);

// GET /api/roadmap
export const getMyRoadmap = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const roadmap = await aiService.getUserRoadmap(req.user!.id);

    sendResponse(res, 200, roadmap);
  }
);

// PATCH /api/roadmap/:nodeId
export const updateNodeStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const nodeId = req.params.nodeId as string;

    const { status } = req.body as {
      status: "Pending" | "InProgress" | "Completed";
    };

    const roadmap = await aiService.updateNodeStatus(
      req.user!.id,
      nodeId,
      status
    );

    sendResponse(res, 200, roadmap, "Node status updated");
  }
);

// DELETE /api/roadmap
export const deleteRoadmap = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await aiService.deleteUserRoadmap(req.user!.id);

    sendResponse(
      res,
      200,
      null,
      "Roadmap deleted — you can now generate a new one"
    );
  }
);