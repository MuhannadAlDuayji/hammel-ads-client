import mongoose from "mongoose";
import { EventType } from "./EventType";
export default interface Event {
    type: EventType;
    campaignId: string;
    userId: string;
    placementId: string;
    watchTimeStart: number | null;
    watchTimeEnd: number | null;
    watchTime: number | null;
    createdAt: Date;
}
