import { unsafeCSS } from "lit";
import globalStyles from "./global.css?inline";
import animationStyles from "./animations.css?inline";

export const shadowDomStyles = unsafeCSS(`${globalStyles}${animationStyles}`);