import mongoose from "mongoose";

import Event from "../event";
import Load from "../load";
import UserPaymentMethodType from "../payment method";
import { TransactionType } from "./TransactionType";
export default interface Transaction {
    type: TransactionType;
    transactionAmount: number;
    paymentMethod: UserPaymentMethodType | null;
}
