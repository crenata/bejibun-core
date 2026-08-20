import {isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import BaseModel from "@/bases/BaseModel";

const EpochTimestamps = (Base: typeof BaseModel): any =>
    class extends Base {
        $beforeInsert(): void {
            const now = Luxon.DateTime.now().toUnixInteger();
            if (isNotEmpty((this as any)[(this.constructor as any).createdColumn])) {
                (this as any)[(this.constructor as any).createdColumn] = now;
            }
            if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
                (this as any)[(this.constructor as any).updatedColumn] = now;
            }
        }

        $beforeUpdate(): void {
            if (isNotEmpty((this as any)[(this.constructor as any).updatedColumn])) {
                (this as any)[(this.constructor as any).updatedColumn] =
                    Luxon.DateTime.now().toUnixInteger();
            }
        }
    };

export default EpochTimestamps;
