import Enum from "@/utils/Enum";
import Str from "@/utils/Str";
import * as Utils from "@/utils/utils";

export {Enum, Str};

export * from "@/utils/utils";

export default {
    Enum,
    Str,
    ...Utils,
};