import QueueDriverEnum from "@/enums/QueueDriverEnum";
import JobModel from "@/models/JobModel";

const config: Record<string, any> = {
    default: env("QUEUE_DRIVER", "database"),

    connections: {
        database: {
            driver: QueueDriverEnum.Database,
            table: JobModel.tableName,
            retry_after: 60
        }
    }
};

export default config;
