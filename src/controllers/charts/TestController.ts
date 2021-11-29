import { ControllerCallbackParams } from "../../lib/framework/routing";
import { BaseController } from "../BaseController";

export class TestController extends BaseController {
  test({ res }: ControllerCallbackParams) {
    res.send("<h1>Hello, world!</h1>");
  }
}
