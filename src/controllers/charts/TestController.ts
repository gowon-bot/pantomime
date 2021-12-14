import { ControllerCallbackParams } from "../../lib/framework/routing";
import { BaseController } from "../BaseController";

export class TestController extends BaseController {
  ping({ res }: ControllerCallbackParams) {
    res.send({
      ping: "pong",
    });
  }
}
