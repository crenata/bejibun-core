import Enum from "@/facades/Enum";
import Str from "@/facades/Str";
import * as Utils from "@/utils/utils";

export {Enum, Str};

export * from "@/utils/utils";

export default {
    Enum,
    Str,
    ...Utils,
};