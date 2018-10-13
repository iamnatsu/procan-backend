import { routeAuth } from "./auth";
import { routeRegist } from "./regist";

export function routing() {
  routeAuth();
  routeRegist();
}
