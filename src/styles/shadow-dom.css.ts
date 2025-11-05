import { unsafeCSS } from "lit";
import globalStyles from "./global.css?inline";

export const shadowDomStyles = unsafeCSS(`${globalStyles}`);