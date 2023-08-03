import mongoose from "mongoose";
import { CampaignStatus } from "./CampaignStatus";
import Event from "../event";
import Load from "../load";
export default interface Campaign {
    _id: string;
    title: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    country: string;
    targetedCities: string[];
    photoPath: string;
    link: string;
    status: string;
    createdAt: Date;
    clicks: number;
    views: number;
    moneySpent: number;
    adminMessage: string;
    servedCount: number;
    pendingCount: number;
}
