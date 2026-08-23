/**
 * Console command: `Turn app into live mode`
 *
 * Registered under the `ace` CLI as `MaintenanceUpCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class MaintenanceUpCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string;
    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string;
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>>;
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<any>>
     */
    protected $arguments: Array<Array<any>>;
    /**
     * Executes this command.
     */
    handle(): Promise<void>;
}
